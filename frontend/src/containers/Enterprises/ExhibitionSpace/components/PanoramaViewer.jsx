import React, { useEffect, useRef } from "react";
import { usePanoramaScenes } from "@/hooks/usePanoramaScenes";
import { FaTimes } from "react-icons/fa";
import "@/assets/styles/layout/enterprise/exhibition-space/panorama-viewer.css";

const PanoramaViewer = ({ show, onHide, panoramas = [] }) => {
  const containerRef = useRef(null);
  const viewerRef = useRef(null);
  const { setupViewer, destroyViewer, safeResize } =
    usePanoramaScenes(viewerRef);

  useEffect(() => {
    if (show && window.Marzipano && viewerRef.current) {
      setupViewer(window.Marzipano, panoramas);
      safeResize();

      const resizeTimeout = setTimeout(safeResize, 300);

      if (containerRef.current?.requestFullscreen) {
        containerRef.current.requestFullscreen().catch(() => {
          console.warn("Fullscreen request denied");
        });
      }

      return () => {
        clearTimeout(resizeTimeout);
        destroyViewer();

        if (document.fullscreenElement) {
          document.exitFullscreen().catch(() => {});
        }
      };
    }

    if (!show) {
      destroyViewer();
      if (document.fullscreenElement) {
        document.exitFullscreen().catch(() => {});
      }
    }
  }, [show, panoramas, setupViewer, destroyViewer, safeResize]);

  useEffect(() => {
    const escListener = (e) => {
      if (e.key === "Escape") onHide();
    };
    document.addEventListener("keydown", escListener);
    return () => document.removeEventListener("keydown", escListener);
  }, [onHide]);

  if (!show) return null;

  return (
    <div
      className="panorama-viewer__fullscreen"
      ref={containerRef}
    >
      <div className="panorama-viewer__toolbar">
        <FaTimes
          className="panorama-viewer__close-icon"
          title="Đóng trình xem"
          onClick={onHide}
        />
      </div>

      <div
        ref={viewerRef}
        className="panorama-viewer__viewer"
      />
    </div>
  );
};

export default PanoramaViewer;
