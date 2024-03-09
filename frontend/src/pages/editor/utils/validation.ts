import z from "zod";

export const validateCreateCollectionSchema = z.object({
  code: z.string().min(1),
  title: z.string().min(1),
  description: z.string().min(0).nullable(),
});

export const validateExecuteCodeSchema = z.object({
  code: z.string().min(1),
  languageId: z.number().min(1),
});

export const validateGetCollectionSchema = z.object({
  offset: z.number().min(0).optional(),
  limit: z.number().min(1).max(50).optional(),
  keyword: z.string().min(1).optional(),
});
