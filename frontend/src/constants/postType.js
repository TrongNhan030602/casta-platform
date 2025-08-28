export const POST_TYPES = {
  news: {
    value: "news",
    label: "Tin tức",
    color: "success",
  },
  event: {
    value: "event",
    label: "Sự kiện",
    color: "primary",
  },
};

// Dùng cho <Select />, filter...
export const POST_TYPE_OPTIONS = Object.values(POST_TYPES).map(
  ({ value, label }) => ({ value, label })
);
