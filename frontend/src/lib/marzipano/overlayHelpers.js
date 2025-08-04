// @lib/marzipano/overlayHelpers.js
import { ZOOM_MIN, ZOOM_MAX, ZOOM_DEFAULT } from "@/constants/viewerZoom";

export function setupDebugUI(viewer, view, containerEl) {
  const debugEl = document.createElement("div");
  debugEl.className = "space360viewer__debug-panel";
  debugEl.style.cssText = `
  position: absolute;
  top: 10px;
  left: 10px;
  background: rgba(0,0,0,0.7);
  color: #fff;
  font-size: 12px;
  padding: 8px 10px;
  border-radius: 4px;
  z-index: 9999;
  pointer-events: none;
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

  containerEl.appendChild(debugEl);

  const update = () => {
    if (!view) return;
    const radToDeg = (rad) => (rad * 180) / Math.PI;

    debugEl.innerHTML = `
  <div class="debug-item"><strong>Yaw: </strong><span>${radToDeg(
    view.yaw()
  ).toFixed(2)}°</span></div>
  <div class="debug-item"><strong>Pitch: </strong><span>${radToDeg(
    view.pitch()
  ).toFixed(2)}°</span></div>
  <div class="debug-item"><strong>Zoom: </strong><span>${radToDeg(
    view.fov()
  ).toFixed(2)}°</span></div>
`.trim();
    requestAnimationFrame(update);
  };

  requestAnimationFrame(update);
}

export function setupScrollZoom(view, containerEl) {
  const minFov = (ZOOM_MIN * Math.PI) / 180;
  const maxFov = (ZOOM_MAX * Math.PI) / 180;

  const zoomFactor = 1.1;

  containerEl.addEventListener(
    "wheel",
    (e) => {
      e.preventDefault();
      const oldFov = view.fov();
      let newFov = e.deltaY < 0 ? oldFov / zoomFactor : oldFov * zoomFactor;

      // Clamp thủ công
      newFov = Math.max(minFov, Math.min(newFov, maxFov));

      // Chỉ update nếu có thay đổi đủ lớn
      if (Math.abs(newFov - oldFov) > 0.0001) {
        view.setFov(newFov);
      }
    },
    { passive: false }
  );
}
