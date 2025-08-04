import { RENTAL_CONTRACT_STATUSES } from "@/constants/rentalContractStatus";

export const buildContractStatusMap = (contracts = []) => {
  const map = {};
  contracts.forEach(({ space, status }) => {
    const id = space?.id;
    if (!id) return;
    if (!map[id]) map[id] = new Set();
    map[id].add(status);
  });
  return map;
};

export const getStatusForSpace = (id, statusMap) => {
  const statusSet = statusMap[id] || new Set();
  const get = (key) => RENTAL_CONTRACT_STATUSES[key].value;

  return {
    hasApproved: statusSet.has(get("approved")),
    hasPending: statusSet.has(get("pending")),
    hasCancelled: statusSet.has(get("cancelled")),
    hasExpired: statusSet.has(get("expired")),
    hasRejected: statusSet.has(get("rejected")),
  };
};
