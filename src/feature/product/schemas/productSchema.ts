import { z } from "zod";

export const updateProductSchema = z.object({
  name: z
    .string()
    .min(1, "Product name is required")
    .max(100, "Product name must not exceed 100 characters"),

  price: z
    .number({ message: "Price must be a valid number" })
    .min(0, "Price must be greater than or equal to 0"),

  status: z.enum(["active", "hidden", "out_of_stock"], {
    message: "Status is required or invalid",
  }),

  categoryId: z.string().optional(),

  description: z.string().optional(),

  imageUrl: z.string().optional(),
});

export const createProductSchema = z.object({
  name: z
    .string()
    .min(1, "Product name is required")
    .max(100, "Product name must not exceed 100 characters"),

  price: z
    .number({ message: "Price must be a valid number" })
    .min(0, "Price must be greater than or equal to 0"),

  categoryId: z.string().min(1, "Category is required"),

  status: z.enum(["active", "hidden", "out_of_stock"]),

  description: z.string().optional(),

  imageUrl: z.string().optional(),
});

export type CreateProductFormData = z.infer<typeof createProductSchema>;
export type UpdateProductFormData = z.infer<typeof updateProductSchema>;
