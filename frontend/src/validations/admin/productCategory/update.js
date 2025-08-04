// @/validations/admin/productCategory/productCategoryUpdateSchema.js
import { productCategoryBaseSchema } from "./base";

export const productCategoryUpdateSchema = productCategoryBaseSchema.shape({
  parent_id: productCategoryBaseSchema.fields.parent_id
    .test(
      "not-self",
      "Danh mục không được là cha của chính nó",
      function (val) {
        const currentId = this.options.context?.currentId;
        return val === "" || val === null || Number(val) !== Number(currentId);
      }
    )
    .test("is-valid", "Danh mục cha không hợp lệ", (val) => {
      return val === "" || val === null || !isNaN(Number(val));
    }),
});
