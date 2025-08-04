// src/utils/productStatusUtils.js

import { PRODUCT_STATUSES } from "@/constants/productStatus";

// Mapping logic chuyển trạng thái theo vai trò (doanh nghiệp)
const ENTERPRISE_TRANSITIONS = {
  draft: ["pending"],
  pending: ["draft"],
  rejected: ["draft", "pending"],
  published: ["pending", "disabled"],
  disabled: ["draft", "pending", "published"],
};

export const getEnterpriseStatusOptions = (currentStatus) => {
  const transitions = ENTERPRISE_TRANSITIONS[currentStatus] || [];

  if (!transitions.includes(currentStatus)) {
    transitions.push(currentStatus);
  }

  return Object.values(PRODUCT_STATUSES)
    .filter(({ value }) => transitions.includes(value))
    .map(({ value, label }) => ({ value, label }));
};
