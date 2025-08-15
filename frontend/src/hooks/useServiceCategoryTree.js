import { useQuery } from "@tanstack/react-query";
import { getServiceCategoryTree } from "@/services/admin/serviceCategoriesService";
import {
  flattenCategoryTreeForDropdown,
  flattenCategoryTreeForDropdownMaxLevel2,
} from "@/utils/flattenCategoryTree";

/**
 * @param {boolean} maxLevel2 - nếu true, flatten tree chỉ cho phép chọn tối đa cấp 2
 */
export const useServiceCategoryTree = (maxLevel2 = false) =>
  useQuery({
    queryKey: ["serviceCategoryTree", maxLevel2],
    queryFn: getServiceCategoryTree,
    staleTime: 1000 * 60 * 10, // 10 phút
    select: (res) => {
      const flattenFn = maxLevel2
        ? flattenCategoryTreeForDropdownMaxLevel2
        : flattenCategoryTreeForDropdown;

      return flattenFn(res.data?.data || []).map((cat) => ({
        ...cat,
        value: Number(cat.value), // Ép value thành number
      }));
    },
  });
