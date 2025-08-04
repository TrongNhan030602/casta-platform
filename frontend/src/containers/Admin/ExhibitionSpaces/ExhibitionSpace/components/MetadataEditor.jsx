import React, { useState, useEffect, useRef } from "react";
import debounce from "lodash.debounce";
import Button from "@/components/common/Button";
import { getSelectableExhibitionSpaces } from "@/services/admin/exhibitionSpaceService";
import { useLocation } from "react-router-dom";
const metadataSchemas = {
  image: [],
  panorama: ["yaw", "pitch", "zoom"],
  vr_scene: ["yaw", "pitch", "zoom"],
};

const MetadataEditor = ({ mediaType = "image", metadata = {}, onChange }) => {
  const schemaFields = metadataSchemas[mediaType] || [];
  const location = useLocation();
  const currentSpaceId = parseInt(location.pathname.split("/").pop(), 10);
  const [selectableSpaces, setSelectableSpaces] = useState([]);

  useEffect(() => {
    getSelectableExhibitionSpaces()
      .then((res) => {
        // Lọc bỏ chính không gian hiện tại
        const filtered = res.data.filter(
          (space) => space.id !== currentSpaceId
        );
        setSelectableSpaces(filtered);
      })
      .catch((err) => {
        console.error("Lấy danh sách không gian thất bại:", err);
      });
  }, [currentSpaceId]);

  const parseExtraObject = (extraObj) => {
    return Object.entries(extraObj || {}).map(([k, v], i) => ({
      id: `extra-${Date.now()}-${i}`,
      key: k,
      value: v,
    }));
  };

  const serializeExtraArray = (extraArray) => {
    const result = {};
    extraArray.forEach((item) => {
      if (item.key) result[item.key] = item.value;
    });
    return result;
  };

  const prepareExportData = (data) => ({
    ...data,
    extra: serializeExtraArray(data.extra),
  });

  const parseMetadata = (raw) => {
    try {
      let parsed = raw;
      if (typeof raw === "string") {
        parsed = JSON.parse(raw);
        if (typeof parsed === "string") {
          parsed = JSON.parse(parsed);
        }
      }
      return parsed || {};
    } catch (err) {
      console.error("❌ Không parse được metadata JSON:", err);
      return {};
    }
  };

  const [localData, setLocalData] = useState(() => {
    const parsed = parseMetadata(metadata);
    const { extra, ...rest } = parsed;
    return {
      yaw: 0,
      pitch: 0,
      zoom: 1,
      markers: [],
      ...rest,
      extra: parseExtraObject(extra),
    };
  });

  useEffect(() => {
    const parsed = parseMetadata(metadata);
    const { extra, ...rest } = parsed;
    setLocalData({
      yaw: 0,
      pitch: 0,
      zoom: 1,
      markers: [],
      ...rest,
      extra: parseExtraObject(extra),
    });
  }, [metadata]);

  const debouncedOnChange = useRef(
    debounce((newData) => {
      onChange(newData);
    }, 600)
  ).current;

  const updateField = (key, value) => {
    const parsed = value === "" ? "" : parseFloat(value);
    const newData = { ...localData, [key]: isNaN(parsed) ? value : parsed };
    setLocalData(newData);
    onChange(prepareExportData(newData));
  };

  const updateExtra = (id, field, value) => {
    const updated = (localData.extra || []).map((item) =>
      item.id === id ? { ...item, [field]: value } : item
    );
    const newData = {
      ...localData,
      extra: updated,
    };
    setLocalData(newData);
    debouncedOnChange(prepareExportData(newData));
  };

  const addExtra = () => {
    const newItem = {
      id: `extra-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      key: "",
      value: "",
    };
    const updated = [...(localData.extra || []), newItem];
    setLocalData({ ...localData, extra: updated });
  };

  const removeExtra = (id) => {
    const updated = (localData.extra || []).filter((item) => item.id !== id);
    const newData = {
      ...localData,
      extra: updated,
    };
    setLocalData(newData);
    debouncedOnChange(prepareExportData(newData));
  };

  const handleMarkerChange = (index, field, value) => {
    const markers = [...(localData.markers || [])];
    if (field.startsWith("position.")) {
      const key = field.split(".")[1];
      markers[index].position = {
        ...markers[index].position,
        [key]: parseFloat(value),
      };
    } else if (field === "targetSpaceId") {
      markers[index][field] = value === "" ? null : parseInt(value, 10);
    } else {
      markers[index][field] = value;
    }
    const newData = { ...localData, markers };
    setLocalData(newData);
    onChange(prepareExportData(newData));
  };

  const addMarker = () => {
    const newMarker = {
      id: `marker-${Date.now()}`,
      tooltip: "",
      position: { yaw: 0, pitch: 0 },
      targetSpaceId: null,
      targetPanoramaId: "",
    };
    const markers = [...(localData.markers || []), newMarker];
    const newData = { ...localData, markers };
    setLocalData(newData);
    onChange(prepareExportData(newData));
  };

  const removeMarker = (index) => {
    const markers = (localData.markers || []).filter((_, i) => i !== index);
    const newData = { ...localData, markers };
    setLocalData(newData);
    onChange(prepareExportData(newData));
  };

  const validateMetadata = () => {
    if (schemaFields.includes("yaw") && isNaN(localData.yaw)) return false;
    if (schemaFields.includes("pitch") && isNaN(localData.pitch)) return false;
    if (schemaFields.includes("zoom") && isNaN(localData.zoom)) return false;
    return true;
  };

  return (
    <div className="mt-3 border p-3 rounded bg-light">
      <h5>Thông tin Metadata</h5>

      {schemaFields.map((key) => (
        <div
          key={key}
          className="form-group"
        >
          <label>{key.toUpperCase()}:</label>
          <input
            type="number"
            className="form-control"
            value={isNaN(localData[key]) ? "" : localData[key]}
            onChange={(e) => updateField(key, e.target.value)}
            step="0.01"
            placeholder={`Nhập ${key}`}
          />
        </div>
      ))}

      {(mediaType === "panorama" || mediaType === "vr_scene") && (
        <>
          <hr />
          <h6>Markers</h6>
          {localData.markers?.map((marker, index) => (
            <div
              key={marker.id}
              className="border p-2 mb-2 bg-white rounded"
            >
              <div className="form-group">
                <label>Tooltip</label>
                <input
                  className="form-control"
                  value={marker.tooltip}
                  onChange={(e) =>
                    handleMarkerChange(index, "tooltip", e.target.value)
                  }
                />
              </div>
              <div className="form-row mt-2 d-flex gap-2">
                <input
                  type="number"
                  className="form-control"
                  value={
                    isNaN(marker.position?.yaw) ? "" : marker.position?.yaw
                  }
                  onChange={(e) =>
                    handleMarkerChange(index, "position.yaw", e.target.value)
                  }
                  placeholder="Yaw"
                />
                <input
                  type="number"
                  className="form-control"
                  value={
                    isNaN(marker.position?.pitch) ? "" : marker.position?.pitch
                  }
                  onChange={(e) =>
                    handleMarkerChange(index, "position.pitch", e.target.value)
                  }
                  placeholder="Pitch"
                />
              </div>
              <div className="form-group mt-2">
                <label>Target Space</label>
                <select
                  className="form-control"
                  value={marker.targetSpaceId ?? ""}
                  onChange={(e) =>
                    handleMarkerChange(index, "targetSpaceId", e.target.value)
                  }
                >
                  <option value="">-- Không chọn --</option>
                  {selectableSpaces.map((space) => (
                    <option
                      key={space.id}
                      value={space.id}
                    >
                      {space.name} ({space.code})
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group mt-2 mb-1">
                <label>Target Panorama ID</label>
                <input
                  type="text"
                  className="form-control"
                  value={marker.targetPanoramaId ?? ""}
                  onChange={(e) =>
                    handleMarkerChange(
                      index,
                      "targetPanoramaId",
                      e.target.value
                    )
                  }
                />
              </div>
              <Button
                type="button"
                variant="danger-outline"
                onClick={() => removeMarker(index)}
              >
                Xoá Marker
              </Button>
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            className="my-2"
            onClick={addMarker}
          >
            + Thêm Marker
          </Button>
        </>
      )}

      <hr />
      <h6>Metadata mở rộng (extra)</h6>
      {Array.isArray(localData.extra) &&
        localData.extra.map(({ id, key, value }) => (
          <div
            key={id}
            className="d-flex gap-2 align-items-center mb-2"
          >
            <input
              className="form-control"
              value={key}
              onChange={(e) => updateExtra(id, "key", e.target.value)}
              placeholder="Tên key"
            />
            <input
              className="form-control"
              value={value}
              onChange={(e) => updateExtra(id, "value", e.target.value)}
              placeholder="Giá trị"
            />
            <Button
              type="button"
              variant="danger-outline"
              onClick={() => removeExtra(id)}
            >
              &times;
            </Button>
          </div>
        ))}
      <Button
        type="button"
        variant="outline"
        onClick={addExtra}
      >
        + Thêm Metadata
      </Button>

      <hr />
      <h6>Xem trước JSON (chỉ áp dụng cho ảnh 360)</h6>
      <pre className="bg-dark text-light p-2 rounded small">
        {JSON.stringify(prepareExportData(localData), null, 2)}
      </pre>

      {!validateMetadata() && (
        <p className="text-danger mt-2">⚠️ Metadata không hợp lệ</p>
      )}
    </div>
  );
};

export default MetadataEditor;
