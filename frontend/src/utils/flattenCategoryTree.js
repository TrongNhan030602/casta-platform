// utils/flattenCategoryTree.js

/**
 * Dạng hiển thị: "A > B > C"
 */
const flattenCategoryTree = (tree, prefix = "") => {
  let result = [];

  tree.forEach((node) => {
    const label = prefix ? `${prefix} > ${node.name}` : node.name;
    result.push({
      value: String(node.id),
      label,
    });

    if (node.children && node.children.length > 0) {
      result = result.concat(flattenCategoryTree(node.children, label));
    }
  });

  return result;
};

/**
 * Dạng hiển thị: "— — Tên" theo độ sâu. Dùng tốt cho dropdown.
 */
export const flattenCategoryTreeForDropdown = (tree, depth = 0) => {
  let result = [];

  tree.forEach((node) => {
    result.push({
      value: String(node.id),
      label: `${"— ".repeat(depth)}${node.name}`,
    });

    if (node.children && node.children.length > 0) {
      result = result.concat(
        flattenCategoryTreeForDropdown(node.children, depth + 1)
      );
    }
  });

  return result;
};

/**
 * Dạng hiển thị: full breadcrumb như "Điện tử > Máy tính > Laptop"
 */
export const flattenCategoryTreeForBreadcrumb = (tree, prefix = "") => {
  let result = [];

  tree.forEach((node) => {
    const label = prefix ? `${prefix} > ${node.name}` : node.name;
    result.push({
      value: String(node.id),
      label,
    });

    if (node.children && node.children.length > 0) {
      result = result.concat(
        flattenCategoryTreeForBreadcrumb(node.children, label)
      );
    }
  });

  return result;
};

export default flattenCategoryTree;
