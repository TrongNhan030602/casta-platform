import React, { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { getRentalContractById } from "@/services/enterprise/rentalContractService";
import {
  getExhibitionProductsByContract,
  deleteExhibitionSpaceProduct,
} from "@/services/enterprise/exhibitionSpaceProductService";
import { getStorageUrl } from "@/utils/getStorageUrl";
import PanoramaViewer from "./components/SetupExhibitionPage/PanoramaViewer";
import ProductModal from "./components/SetupExhibitionPage/ProductModal";
import ProductInfoModal from "./components/SetupExhibitionPage/ProductInfoModal";

import "@/assets/styles/layout/enterprise/rental-contract/setup-exhibition-page.css";
const radToDeg = (rad) => (rad * 180) / Math.PI;

const SetupExhibitionPage = () => {
  const { contractId } = useParams();
  const navigate = useNavigate();
  const [contract, setContract] = useState(null);
  const [markers, setMarkers] = useState([]);
  const [panoramas, setPanoramas] = useState([]);
  const [activePanorama, setActivePanorama] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [clickedCoords, setClickedCoords] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showInfoModal, setShowInfoModal] = useState(false);

  useEffect(() => {
    const fetchContractAndPanoramas = async () => {
      try {
        const res = await getRentalContractById(contractId);
        const contractData = res.data?.data;
        setContract(contractData);

        const rawPanoramas = contractData?.space?.panoramas || [];
        const parsedPanoramas = rawPanoramas.map((item) => ({
          ...item,
          metadata: item.metadata ? JSON.parse(item.metadata) : {},
        }));

        setPanoramas(parsedPanoramas);
        setActivePanorama(parsedPanoramas[0] || null);
      } catch (err) {
        console.error("Lỗi khi tải hợp đồng:", err);
      }
    };

    fetchContractAndPanoramas();
  }, [contractId]);

  const fetchMarkers = useCallback(async () => {
    if (!activePanorama) return;

    try {
      const res = await getExhibitionProductsByContract(contractId, {
        panorama_id: activePanorama.metadata?.extra?.panoramaId,
      });
      const products = res.data?.data || [];

      // Giữ nguyên yaw, pitch ở độ, không convert ở đây
      const formattedMarkers = products.map((item) => ({
        id: item.id,
        status: item.status,
        productId: item.product?.id,
        productName: item.product?.name,
        description: item.product?.description,
        price: item.product?.price,
        stock: item.product?.stock,
        categoryName: item.product?.category?.name,
        productImageUrl: item.product?.thumbnail
          ? getStorageUrl(item.product.thumbnail)
          : null,
        position: {
          yaw: item.position_metadata?.yaw ?? 0,
          pitch: item.position_metadata?.pitch ?? 0,
        },
        tooltip: item.product?.name || "SP",
      }));

      setMarkers(formattedMarkers);
    } catch (err) {
      console.error("Lỗi khi tải marker:", err);
    }
  }, [contractId, activePanorama]);

  useEffect(() => {
    fetchMarkers();
  }, [fetchMarkers]);

  const handleViewerClick = ({ yaw, pitch }) => {
    setClickedCoords({
      yaw: radToDeg(yaw),
      pitch: radToDeg(pitch),
    });
    setShowModal(true);
  };
  const handleMarkerClick = (marker) => {
    setSelectedProduct(marker);
    setShowInfoModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setClickedCoords(null);
  };

  const handleDeleteMarker = (deletedId) => {
    setMarkers((prev) => prev.filter((m) => m.id !== deletedId));
  };

  return (
    <div className="container py-4">
      <h4>Gắn sản phẩm - {contract?.code}</h4>

      {activePanorama && (
        <PanoramaViewer
          panorama={activePanorama}
          onDoubleClick={handleViewerClick}
          contractId={contractId}
          markers={markers}
          onMarkerClick={handleMarkerClick}
          onDeleteMarker={handleDeleteMarker}
          onChangePanorama={(targetPanoramaId) => {
            const found = panoramas.find(
              (p) => p.metadata?.extra?.panoramaId === targetPanoramaId
            );
            if (found) {
              setActivePanorama(found);
            } else {
              alert("Không tìm thấy ảnh panorama đích.");
            }
          }}
          isModalOpen={showModal || showInfoModal}
          onCloseFullscreen={() => {
            navigate(-1);
          }}
        />
      )}

      <ProductModal
        open={showModal}
        onClose={handleCloseModal}
        coords={clickedCoords}
        contractId={contractId}
        panoramaId={activePanorama?.metadata?.extra?.panoramaId}
        onSuccess={fetchMarkers}
        existingMarkers={markers}
      />
      <ProductInfoModal
        show={showInfoModal}
        onHide={() => setShowInfoModal(false)}
        product={selectedProduct}
        onDelete={async () => {
          try {
            await deleteExhibitionSpaceProduct(selectedProduct.id);
            setMarkers((prev) =>
              prev.filter((m) => m.id !== selectedProduct.id)
            );
            setShowInfoModal(false);
          } catch (err) {
            console.error("Xóa marker thất bại:", err);

            // 🎯 Trích xuất message từ backend trả về
            const msg =
              err?.response?.data?.message ||
              err?.message ||
              "Không thể xoá sản phẩm.";
            toast.error(msg); // 👈 Hiển thị thông báo lỗi rõ ràng
          }
        }}
      />
    </div>
  );
};

export default SetupExhibitionPage;
