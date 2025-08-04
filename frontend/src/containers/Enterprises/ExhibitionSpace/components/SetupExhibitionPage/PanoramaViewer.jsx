/* eslint-disable react-hooks/exhaustive-deps */
/* global Marzipano */
import React, { useEffect, useRef, useState } from "react";
import { getStorageUrl } from "@/utils/getStorageUrl";

const clamp = (num, min, max) => Math.min(Math.max(num, min), max);
const degToRad = (deg) => (deg * Math.PI) / 180;

function createProductMarker(marker, onMarkerClick, scene) {
  const el = document.createElement("div");
  el.className = "custom-marker";

  if (marker.productImageUrl) {
    const img = document.createElement("img");
    img.src = marker.productImageUrl;
    img.alt = marker.tooltip || "Sản phẩm";
    img.className = "marker-image";
    el.appendChild(img);
  } else {
    el.innerText = marker.tooltip || "●";
    el.className = "marker-text";
  }

  el.onclick = () => {
    onMarkerClick?.(marker);
  };

  scene.hotspotContainer().createHotspot(el, {
    yaw: degToRad(marker.position.yaw),
    pitch: degToRad(marker.position.pitch),
  });
}

function createNavMarker(nav, onChangePanorama, scene) {
  if (!nav.position || !nav.targetPanoramaId) return;

  const el = document.createElement("div");
  el.className = "nav-hotspot";

  const img = document.createElement("img");
  img.src = "/marker-icons/map-marker.png";
  img.alt = nav.tooltip || "Đi tới";
  img.className = "nav-hotspot-icon";
  el.appendChild(img);

  if (nav.tooltip) {
    const label = document.createElement("div");
    label.className = "nav-tooltip";
    label.innerText = nav.tooltip;
    el.appendChild(label);
  }

  el.onclick = () => onChangePanorama?.(nav.targetPanoramaId);

  scene.hotspotContainer().createHotspot(el, {
    yaw: degToRad(nav.position.yaw),
    pitch: degToRad(nav.position.pitch),
  });
}

const PanoramaViewer = ({
  panorama,
  markers = [],
  onDoubleClick,
  onMarkerClick,
  onChangePanorama,
  onCloseFullscreen,
  isModalOpen,
}) => {
  const viewerRef = useRef(null);
  const panoViewer = useRef(null);
  const viewRef = useRef(null);
  const autorotateRef = useRef(null);
  const [isAutorotating, setIsAutorotating] = useState(true);

  useEffect(() => {
    if (!panorama?.url) return;
    if (viewerRef.current) viewerRef.current.innerHTML = "";

    const viewer = new Marzipano.Viewer(viewerRef.current);
    panoViewer.current = viewer;

    const source = Marzipano.ImageUrlSource.fromString(
      getStorageUrl(panorama.url)
    );
    const geometry = new Marzipano.EquirectGeometry([{ width: 6000 }]);

    const yaw = degToRad(panorama.metadata?.yaw ?? 0);
    const pitch = clamp(
      degToRad(panorama.metadata?.pitch ?? 0),
      -Math.PI / 2,
      Math.PI / 2
    );
    const zoom = clamp(panorama.metadata?.zoom ?? 75, 30, 90);
    const fov = degToRad(zoom);

    const minFov = degToRad(30);
    const maxFov = degToRad(100);
    const limiter = Marzipano.util.compose(
      Marzipano.RectilinearView.limit.vfov(minFov, maxFov),
      Marzipano.RectilinearView.limit.pitch(-Math.PI / 2, Math.PI / 2),
      Marzipano.RectilinearView.limit.yaw(-Math.PI, Math.PI)
    );

    const view = new Marzipano.RectilinearView({ yaw, pitch, fov }, limiter);
    viewRef.current = view;

    const scene = viewer.createScene({
      source,
      geometry,
      view,
      pinFirstLevel: true,
    });

    scene.switchTo();

    markers.forEach((marker) =>
      createProductMarker(marker, onMarkerClick, scene)
    );
    (panorama.metadata?.markers || []).forEach((nav) =>
      createNavMarker(nav, onChangePanorama, scene)
    );

    const handleDoubleClick = (event) => {
      const rect = viewerRef.current.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      const coords = view.screenToCoordinates({ x, y });
      onDoubleClick?.({ yaw: coords.yaw, pitch: coords.pitch });
    };

    viewerRef.current.addEventListener("dblclick", handleDoubleClick);

    const autorotate = Marzipano.autorotate({
      yawSpeed: 0.05,
      targetPitch: pitch,
      targetFov: fov,
    });
    autorotateRef.current = autorotate;
    viewer.startMovement(autorotate);
    setIsAutorotating(true);

    return () => {
      viewerRef.current?.removeEventListener("dblclick", handleDoubleClick);
      viewer.destroy();
    };
  }, [panorama, markers]);

  const handleResetView = () => {
    if (!viewRef.current || !panorama?.metadata) return;

    const yaw = degToRad(panorama.metadata.yaw ?? 0);
    const pitch = degToRad(panorama.metadata.pitch ?? 0);
    const zoom = clamp(panorama.metadata.zoom ?? 75, 30, 90);
    const fov = degToRad(zoom);

    viewRef.current.setYaw(yaw);
    viewRef.current.setPitch(pitch);
    viewRef.current.setFov(fov);
  };

  const toggleAutorotate = () => {
    const viewer = panoViewer.current;
    if (!viewer || !autorotateRef.current) return;

    if (isAutorotating) {
      viewer.stopMovement();
      setIsAutorotating(false);
    } else {
      viewer.startMovement(autorotateRef.current);
      setIsAutorotating(true);
    }
  };

  return (
    <>
      <div
        ref={viewerRef}
        className={`panorama-viewer ${isModalOpen ? "hidden" : ""}`}
        aria-label="Panorama Viewer"
      />
      <button
        onClick={onCloseFullscreen}
        className="panorama-exit-button"
        aria-label="Thoát chế độ xem toàn màn hình"
        title="Thoát"
      >
        ✕
      </button>
      <button
        onClick={handleResetView}
        className="panorama-exit-button"
        style={{ top: "70px" }}
        aria-label="Reset góc nhìn"
        title="Reset góc nhìn"
      >
        ↺
      </button>
      <button
        onClick={toggleAutorotate}
        className="panorama-exit-button"
        style={{ top: "120px" }}
        aria-label="Tự xoay / Dừng"
        title="Tự xoay / Dừng"
      >
        {isAutorotating ? "⏸" : "▶"}
      </button>
    </>
  );
};

export default PanoramaViewer;
