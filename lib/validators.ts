import { z } from "zod";
import { formatNumberWithDecimal } from "./utils";

const currencyValidator = z.string().refine(
    (val) => /^\d+(\.\d{2})?$/.test(formatNumberWithDecimal(+val)),
    "Price must be a number with up to 2 decimal places"
);

export const insertProductSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters long"),
  slug: z.string().min(3, "Slug must be at least 3 characters long"),
  category: z.string().min(3, "Category must be at least 3 characters long"),
  brand: z.string().min(3, "Brand must be at least 3 characters long"),
  description: z.string().min(10, "Description must be at least 10 characters long"),
  stock: z.coerce.number().min(0, "Stock must be at least 0"),
  images: z.array(z.string()).min(1, "At least one image is required"),
  isFeatured: z.boolean().optional(),
  banner: z.string().nullable(),
  price: currencyValidator,

});

// Schema for signing in a user
export const signInFormSchema = z.object({
  email: z.string().email('Invalid email address').min(3, 'Email must be at least 3 characters'),
  password: z.string().min(3, 'Password must be at least 3 characters'),
});

// Schema for signing up a user
export const signUpFormSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string().min(6, 'Confirm password must be at least 6 characters'),
}).refine((data) => data.password === data.confirmPassword, {
  path: ['confirmPassword'],
  message: 'Passwords do not match',
});








