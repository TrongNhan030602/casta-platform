//@validations/admin/post/postSchema.js
import * as yup from "yup";
import { POST_STATUSES } from "@/constants/postStatus";
import { POST_TYPES } from "@/constants/postType";

export const postSchema = yup.object({
  type: yup.string().required().oneOf(Object.keys(POST_TYPES)),
  title: yup.string().required().max(255),
  slug: yup.string().nullable().max(255),
  category_id: yup.number().nullable(),
  summary: yup.string().nullable(),
  content: yup.string().nullable(),
  gallery: yup.array().of(yup.number()).nullable(),
  tags: yup.array().of(yup.number()).nullable(),
  status: yup.string().required().oneOf(Object.keys(POST_STATUSES)),
  is_sticky: yup.boolean().nullable(),
  published_at: yup.date().nullable(),
  author_id: yup.number().nullable(),
  event_location: yup.string().nullable().max(255),
  event_start: yup.date().nullable(),
  event_end: yup.date().nullable().min(yup.ref("event_start")),
  meta_title: yup.string().nullable().max(255),
  meta_description: yup.string().nullable(),
});
