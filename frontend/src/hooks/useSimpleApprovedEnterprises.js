// src/hooks/useSimpleApprovedEnterprises.js
import { useQuery } from "@tanstack/react-query";
import { getSimpleApprovedEnterprises } from "@/services/admin/enterpriseService";

/**
 * Hook lấy danh sách doanh nghiệp đã duyệt, định dạng cho dropdown
 * @param {string} keyword - Từ khóa tìm kiếm
 * @param {number} limit - Giới hạn số lượng doanh nghiệp trả về
 */
export const useSimpleApprovedEnterprises = (keyword = "", limit = 100) =>
  useQuery({
    queryKey: ["simpleApprovedEnterprises", keyword, limit],
    queryFn: () => getSimpleApprovedEnterprises(keyword, limit),
    staleTime: 1000 * 60 * 10,
    select: (res) =>
      (res.data?.data || []).map((ent) => ({
        value: String(ent.id),
        label: ent.name,
      })),
  });
