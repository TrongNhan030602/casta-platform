import React from "react";
import { getStorageUrl } from "@/utils/getStorageUrl";
import Button from "@/components/common/Button";

// Dịch tên nhóm
const GROUP_LABELS = {
  image: "Hình ảnh",
  panorama: "Ảnh 360°",
  video: "Video",
  vr_scene: "Cảnh VR",
  document: "Tài liệu",
  youtube: "Video YouTube",
  other: "Khác",
};

const groupMediaByType = (mediaList) => {
  const grouped = {};

  mediaList.forEach((item) => {
    const key = GROUP_LABELS[item.type] ? item.type : "other";
    if (!grouped[key]) grouped[key] = [];
    grouped[key].push(item);
  });

  return grouped;
};

const MediaDisplay = ({
  media,
  setMediaToDelete,
  setShowDeleteModal,
  setMediaToEdit,
}) => {
  const renderMediaPreview = (item) => {
    const fileUrl = getStorageUrl(item.url);

    switch (item.type) {
      case "image":
      case "panorama":
        return (
          <img
            src={fileUrl}
            alt={item.caption}
            className="media-image"
            title={item.caption}
            onClick={() => window.open(fileUrl, "_blank")}
            style={{ cursor: "pointer" }}
          />
        );

      case "video":
        return (
          <video
            controls
            className="media-video"
            title={item.caption}
            onClick={(e) => e.stopPropagation()}
          >
            <source
              src={fileUrl}
              type="video/mp4"
            />
            Trình duyệt của bạn không hỗ trợ video.
          </video>
        );

      case "vr_scene":
        return (
          <div className="media-vr-placeholder">
            <p>Cảnh VR</p>
            <Button
              size="sm"
              variant="outline"
              onClick={() => window.open(fileUrl, "_blank")}
            >
              Mở Cảnh VR
            </Button>
          </div>
        );

      case "document":
        return (
          <div className="media-document">
            <p>📄 {item.caption || "Tài liệu đính kèm"}</p>
            <Button
              size="sm"
              variant="outline"
              onClick={() => window.open(fileUrl, "_blank")}
            >
              Xem tài liệu
            </Button>
          </div>
        );

      case "youtube":
        return (
          <div className="media-youtube">
            <p>📺 Video YouTube</p>
            <Button
              size="sm"
              variant="outline"
              onClick={() => window.open(fileUrl, "_blank")}
            >
              Xem video
            </Button>
          </div>
        );

      default:
        return (
          <div className="media-file">
            <p>{item.caption || "Tệp đính kèm"}</p>
            <Button
              size="sm"
              variant="outline"
              onClick={() => window.open(fileUrl, "_blank")}
            >
              Mở file
            </Button>
          </div>
        );
    }
  };

  if (!media || media.length === 0) {
    return (
      <div className="section">
        <h3 className="section-title">Danh sách tài liệu, ảnh, video</h3>
        <p>Chưa có media nào.</p>
      </div>
    );
  }

  const groupedMedia = groupMediaByType(media);

  return (
    <div className="section">
      <h3 className="section-title">Danh sách tài liệu, ảnh, video</h3>

      {Object.entries(groupedMedia).map(([type, items]) => (
        <div
          key={type}
          className="media-group"
        >
          <h4 className="media-group-title">{GROUP_LABELS[type]}</h4>

          <div className="media-list">
            {items.map((item) => (
              <div
                key={item.id}
                className="media-item"
              >
                {renderMediaPreview(item)}

                {item.caption && (
                  <p className="media-caption">{item.caption}</p>
                )}

                <div className="d-flex justify-content-between">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setMediaToEdit?.(item)}
                  >
                    Chỉnh sửa
                  </Button>
                  <Button
                    size="sm"
                    variant="danger-outline"
                    onClick={() => {
                      setMediaToDelete(item);
                      setShowDeleteModal(true);
                    }}
                  >
                    Xoá
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default MediaDisplay;
