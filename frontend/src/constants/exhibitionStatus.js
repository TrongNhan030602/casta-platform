// 📁 src/constants/exhibitionStatus.js

export const EXHIBITION_SPACE_STATUSES = {
  //color phụ thuộc vào màu bên Bage
  available: {
    value: "available",
    label: "Trống",
    color: "success",
  },
  booked: {
    value: "booked",
    label: "Đã đặt",
    color: "orange",
  },
  maintenance: {
    value: "maintenance",
    label: "Bảo trì",
    color: "warning",
  },
};

export const EXHIBITION_STATUS_OPTIONS = Object.values(
  EXHIBITION_SPACE_STATUSES
).map(({ value, label }) => ({ value, label }));
