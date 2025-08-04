// utils/math.js
export const degToRad = (deg) => (deg * Math.PI) / 180;

export const createLimiter = (minFovDeg, maxFovDeg) => {
  const minFov = degToRad(minFovDeg);
  const maxFov = degToRad(maxFovDeg);
  return (params) => {
    params.yaw = Math.max(-Math.PI, Math.min(Math.PI, params.yaw));
    params.pitch = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, params.pitch));
    params.fov = Math.max(minFov, Math.min(maxFov, params.fov));
    return params;
  };
};
