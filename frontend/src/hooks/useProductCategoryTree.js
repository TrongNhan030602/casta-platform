import { useQuery } from "@tanstack/react-query";
import { getCategoryTree } from "@/services/admin/productCategoryService";
import { flattenCategoryTreeForDropdown } from "@/utils/flattenCategoryTree";

/**
 * Trả về danh mục sản phẩm dạng flatten cho dropdown
 */
export const useProductCategoryTree = () =>
  useQuery({
    queryKey: ["productCategoryTree"],
    queryFn: getCategoryTree,
    staleTime: 1000 * 60 * 10,
    select: (res) => flattenCategoryTreeForDropdown(res.data?.data || []),
  });
