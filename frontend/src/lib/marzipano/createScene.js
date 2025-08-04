import { getStorageUrl } from "@/utils/getStorageUrl";
import { degToRad, createLimiter } from "@/utils/math";
import { ZOOM_MIN, ZOOM_MAX, ZOOM_DEFAULT } from "@/constants/viewerZoom";

export function createScene({
  Marzipano,
  pano,
  marzipanoViewer,
  scenesRef,
  activateScene,
}) {
  const meta = JSON.parse(pano.metadata || "{}");
  const panoId = meta.extra?.panoramaId;
  if (!panoId) return;

  const source = Marzipano.ImageUrlSource.fromString(getStorageUrl(pano.url));
  const geometry = new Marzipano.EquirectGeometry([{ width: 6000 }]);
  const limiter = createLimiter(ZOOM_MIN, ZOOM_MAX);

  let fovDeg = meta.zoom || ZOOM_DEFAULT;
  fovDeg = Math.max(ZOOM_MIN, Math.min(fovDeg, ZOOM_MAX));

  const view = new Marzipano.RectilinearView(
    {
      yaw: degToRad(meta.yaw || 0),
      pitch: degToRad(meta.pitch || 0),
      fov: degToRad(fovDeg),
    },
    limiter
  );

  const scene = marzipanoViewer.createScene({
    source,
    geometry,
    view,
    pinFirstLevel: true,
  });

  // Setup markers nếu có
  if (Array.isArray(meta.markers)) {
    meta.markers.forEach((marker) => {
      const el = document.createElement("div");
      el.className = "space360viewer__marker";

      // Gán class theo loại marker
      const isMapMarker = !!marker.targetSpaceId;
      el.classList.add(isMapMarker ? "marker--map" : "marker--arrow");

      // Tạo phần tử hiệu ứng bên trong
      const inner = document.createElement("div");
      inner.className = "space360viewer__marker-inner";

      // Gắn icon
      const img = document.createElement("img");
      img.src = isMapMarker
        ? "/marker-icons/map-marker.png"
        : "/marker-icons/up-arrow.png";
      img.alt = marker.tooltip || "Marker";
      img.style.width = "32px";
      img.style.height = "32px";
      img.style.objectFit = "contain";
      inner.appendChild(img);

      // 👉 Tooltip hiển thị mô tả
      if (marker.tooltip) {
        const tooltip = document.createElement("div");
        tooltip.className = "space360viewer__marker-tooltip";
        tooltip.innerText = marker.tooltip;
        el.appendChild(tooltip);
      }

      el.appendChild(inner);

      el.onclick = () => {
        if (marker.targetPanoramaId && typeof activateScene === "function") {
          activateScene(marker.targetPanoramaId);
        }
      };

      const markerPosition = {
        yaw: degToRad(marker.position.yaw || 0),
        pitch: degToRad(marker.position.pitch || 0),
      };

      scene.hotspotContainer().createHotspot(el, markerPosition);
    });
  }

  const initialYaw = degToRad(meta.yaw || 0);
  const initialPitch = degToRad(meta.pitch || 0);
  const initialFov = degToRad(fovDeg);

  scenesRef.current[panoId] = {
    scene,
    view,
    initialYaw,
    initialPitch,
    initialFov,
  };
}
