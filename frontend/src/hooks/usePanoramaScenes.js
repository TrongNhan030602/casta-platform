import { useRef } from "react";
import { setupDebugUI, setupScrollZoom } from "@/lib/marzipano/overlayHelpers";
import { createScene } from "@/lib/marzipano/createScene";
import { logOnDoubleClick } from "@/lib/marzipano/logOnDoubleClick";

export function usePanoramaScenes(viewerRef) {
  const marzipanoViewer = useRef(null);
  const scenesRef = useRef({});
  const logCleanupRef = useRef(null);

  const safeResize = () => {
    if (marzipanoViewer.current?.resize) {
      marzipanoViewer.current.resize();
    }
  };

  const waitForViewerReady = () =>
    new Promise((resolve) => {
      const check = () => {
        const el = viewerRef.current;
        if (el && el.offsetWidth > 0 && el.offsetHeight > 0) {
          resolve();
        } else {
          requestAnimationFrame(check);
        }
      };
      check();
    });

  const initViewerIfNeeded = (Marzipano) => {
    if (!marzipanoViewer.current) {
      marzipanoViewer.current = new Marzipano.Viewer(viewerRef.current);
      safeResize();
    }
  };

  const clearScenes = () => {
    Object.values(scenesRef.current).forEach(({ scene }) => {
      try {
        scene.destroy();
      } catch (err) {
        console.warn("⚠️ Scene destroy error:", err.message);
      }
    });
    scenesRef.current = {};
  };

  const buildScenes = (Marzipano, panoramas) => {
    panoramas.forEach((pano) => {
      try {
        createScene({
          Marzipano,
          pano,
          marzipanoViewer: marzipanoViewer.current,
          scenesRef,
          safeResize,
          activateScene, // ✅ thêm dòng này
        });
      } catch (err) {
        console.warn("⚠️ Lỗi tạo scene:", err);
      }
    });
  };

  const activateScene = async (panoId) => {
    const sceneData = scenesRef.current[panoId];
    if (!sceneData) {
      console.warn("❌ Không tìm thấy scene:", panoId);
      return;
    }

    const waitForStageReady = () =>
      new Promise((resolve) => {
        const check = () => {
          const viewer = marzipanoViewer.current;
          if (!viewer) return resolve();

          const stage = viewer.stage?.();
          const domEl = stage?.domElement?.();
          if (domEl && domEl.offsetWidth > 0 && domEl.offsetHeight > 0) {
            resolve();
          } else {
            requestAnimationFrame(check);
          }
        };
        check();
      });

    await waitForStageReady();

    sceneData.scene.switchTo({ transitionDuration: 800 });

    // RESET lại góc nhìn về mặc định khi chuyển cảnh
    sceneData.view.setYaw(sceneData.initialYaw || 0);
    sceneData.view.setPitch(sceneData.initialPitch || 0);
    sceneData.view.setFov(sceneData.initialFov);

    safeResize();

    sceneData.scene.addEventListener("loadComplete", () => safeResize());

    // Cập nhật UI
    setupDebugUI(marzipanoViewer.current, sceneData.view, viewerRef.current);
    setupScrollZoom(sceneData.view, viewerRef.current);

    logCleanupRef.current?.();
    logCleanupRef.current = logOnDoubleClick(viewerRef, () => sceneData.view);
  };

  const activateMainScene = async (panoramas) => {
    const main = panoramas.find((p) => {
      try {
        const meta = JSON.parse(p.metadata || "{}");
        const panoId = meta.extra?.panoramaId;
        return (
          meta.extra?.isMain === true ||
          ["pano-main", "pano", "main-pano"].includes(panoId)
        );
      } catch {
        return false;
      }
    });

    if (!main) return;

    const panoId = JSON.parse(main.metadata || "{}")?.extra?.panoramaId;
    if (panoId) {
      await activateScene(panoId);
    }
  };

  const setupViewer = async (Marzipano, panoramas) => {
    await waitForViewerReady();
    initViewerIfNeeded(Marzipano);
    clearScenes();
    buildScenes(Marzipano, panoramas);
    await activateMainScene(panoramas);
  };

  const destroyViewer = () => {
    try {
      if (marzipanoViewer.current) {
        Object.values(scenesRef.current).forEach(({ scene }) => {
          try {
            scene.destroy();
          } catch (err) {
            console.warn("⚠️ Scene destroy error:", err.message);
          }
        });

        scenesRef.current = {};
        marzipanoViewer.current = null;
        logCleanupRef.current?.();
        logCleanupRef.current = null;
      }
    } catch (err) {
      console.warn("⚠️ Lỗi khi destroy viewer:", err.message);
    }
  };

  return {
    setupViewer,
    destroyViewer,
    marzipanoViewer,
    safeResize,
  };
}
