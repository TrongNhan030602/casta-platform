import { useEffect, useRef } from "react";
import { FaTimes } from "react-icons/fa";
import { usePanoramaScenes } from "@/hooks/usePanoramaScenes";
import ViewerContainer from "./ViewerContainer";
import "@/assets/styles/layout/admin/exhibition-space/space-360-viewer.css";

const Space360Viewer = ({ show, onHide, panoramas = [] }) => {
  const viewerRef = useRef(null);
  const containerRef = useRef(null);
  const { setupViewer, destroyViewer, safeResize } =
    usePanoramaScenes(viewerRef);

  // Khởi tạo hoặc cleanup viewer khi show thay đổi
  useEffect(() => {
    if (show && window.Marzipano && viewerRef.current) {
      setupViewer(window.Marzipano, panoramas);
      safeResize();

      const resizeTimeout = setTimeout(safeResize, 300);

      // Yêu cầu fullscreen khi show modal
      if (containerRef.current?.requestFullscreen) {
        containerRef.current.requestFullscreen().catch(() => {
          console.warn("Fullscreen request denied");
        });
      }

      return () => {
        clearTimeout(resizeTimeout);
        destroyViewer();

        // Thoát fullscreen khi đóng modal
        if (document.fullscreenElement) {
          document.exitFullscreen();
        }
      };
    }

    // Nếu modal đóng mà chưa có cleanup bên trên (an toàn)
    if (!show) {
      destroyViewer();
      if (document.fullscreenElement) {
        document.exitFullscreen();
      }
    }
  }, [show, panoramas, setupViewer, safeResize, destroyViewer]);

  // ESC để đóng modal
  useEffect(() => {
    const escListener = (e) => {
      if (e.key === "Escape") onHide();
    };
    document.addEventListener("keydown", escListener);
    return () => document.removeEventListener("keydown", escListener);
  }, [onHide]);

  const renderToolbar = (
    <div className="space360viewer__toolbar">
      <FaTimes
        className="space360viewer__icon"
        title="Đóng trình xem"
        onClick={onHide}
      />
    </div>
  );

  const renderViewerBody = (
    <>
      {renderToolbar}
      <ViewerContainer ref={viewerRef} />
    </>
  );

  return (
    <>
      {show ? (
        <div
          className="space360viewer__fullscreen"
          ref={containerRef} // gán ref vào div này
        >
          {renderViewerBody}
        </div>
      ) : null}
    </>
  );
};

export default Space360Viewer;
