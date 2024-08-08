import { z } from "zod";

const SignUpSchema = z
  .object({
    email: z.string().email(),
    username: z.string().min(1, "Username is required"),
    fullName: z.string().min(1, "Full Name is required"),
    password: z.string().min(6, "Password Must be of at least 6 characters"),
    confirmPassword: z
      .string()
      .min(6, "Confirm Password Must be of at least 6 characters"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Password must Match",
    path: ["confirmPassword"],
  });
export default SignUpSchema;
