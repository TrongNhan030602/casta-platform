// @lib/marzipano/logOnDoubleClick.js

export function logOnDoubleClick(viewerRef, getView) {
  const handler = (e) => {
    const viewerEl = viewerRef.current;
    const view = getView();

    if (!viewerEl || !view) return;

    const rect = viewerEl.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const coords = view.screenToCoordinates({ x, y });
    const yawDeg = (coords.yaw * 180) / Math.PI;
    const pitchDeg = (coords.pitch * 180) / Math.PI;

    console.log(
      `🧭 Clicked Yaw: ${yawDeg.toFixed(2)}°, Pitch: ${pitchDeg.toFixed(2)}°`
    );
  };

  viewerRef.current?.addEventListener("dblclick", handler);

  return () => {
    viewerRef.current?.removeEventListener("dblclick", handler);
  };
}
