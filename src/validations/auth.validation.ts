import { ILogin, ISignUp } from "@/interfaces/auth.interface";
import { z } from "zod";

export const passwordSchema = z
  .string()
  .min(8, { message: "Password must be at least 8 characters long" })
  .refine((val) => /[A-Z]/.test(val), {
    message: "Password must contain at least one uppercase letter",
  })
  .refine((val) => /[a-z]/.test(val), {
    message: "Password must contain at least one lowercase letter",
  })
  .refine((val) => /[0-9]/.test(val), {
    message: "Password must contain at least one number",
  })
  .refine((val) => /[!@#$%^&*()\-_+=[\]{};:'",.<>/?\\|]/.test(val), {
    message: "Password must contain at least one symbol",
  });

export const signUpSchema: z.ZodType<ISignUp> = z
  .object({
    email: z
      .string()
      .min(2, { message: "Email is required" })
      .regex(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, {
        message: "Enter a valid email",
      }),
    password: passwordSchema,
    confirm_password: z.string(),
    username: z.string().min(2, { message: "Username is required" }),
    // topics: z.array(z.string()).min(1, { message: "At least one topic is required" }),
  })
  // .refine((data) => data.password === data.confirm_password, {
  //   message: "Passwords don't match",
  //   path: ["confirm_password"],
  // });


export const loginSchema: z.ZodType<ILogin> = z.object({
  email: z
    .string()
    .min(2, { message: "Email is required" })
    .regex(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, {
      message: "Enter a valid email",
    }),
  password: z.string().min(6, {
    message: "Password must be longer than or equal to 6 characters.",
  }),
});

// export const forgotPasswordSchema: z.ZodType<IForgotPassword> = z.object({
//   email: z
//     .string()
//     .min(2, { message: "Email is required" })
//     .regex(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, {
//       message: "Enter a valid email",
//     })
//     .email({ message: "Invalid email address" }),
// });


// export const resetPasswordSchema: z.ZodType<IResetPassword> = z
//   .object({
//     new_password: passwordSchema,
//     confirm_password: z.string(),
//   })
//   .refine((data) => data.new_password === data.confirm_password, {
//     message: "Passwords don't match",
//     path: ["confirm_password"],
//   });
// export const changePasswordSchema: z.ZodType<IChangePassword> = z
//   .object({
//     old_password: z.string(),
//     new_password: passwordSchema,
//     confirm_password: z.string(),
//   })
//   .refine((data) => data.new_password === data.confirm_password, {
//     message: "Passwords don't match",
//     path: ["confirm_password"],
//   });
export type LoginType = z.infer<typeof loginSchema>;
// export type ForgotPasswordType = z.infer<typeof forgotPasswordSchema>;
// export type OTPType = z.infer<typeof otpSchema>;
export type SignUpType = z.infer<typeof signUpSchema>;
// export type UpdateAccountType = z.infer<typeof updateAccountSchema>;
// export type ResetPasswordType = z.infer<typeof resetPasswordSchema>;
// export type ChangePasswordType = z.infer<typeof changePasswordSchema>;
