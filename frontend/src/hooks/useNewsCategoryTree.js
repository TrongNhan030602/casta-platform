import { useQuery } from "@tanstack/react-query";
import { getNewsCategoryTree } from "@/services/admin/newsCategoriesService";
import {
  flattenCategoryTreeForDropdown,
  flattenCategoryTreeForDropdownMaxLevel2,
} from "@/utils/flattenCategoryTree";

/**
 * @param {boolean} maxLevel2 - nếu true, flatten tree chỉ cho phép chọn tối đa cấp 2
 */
export const useNewsCategoryTree = (maxLevel2 = false) =>
  useQuery({
    queryKey: ["newsCategoryTree", maxLevel2],
    queryFn: getNewsCategoryTree,
    staleTime: 1000 * 60 * 10,
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
