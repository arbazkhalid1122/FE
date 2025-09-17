import { z } from "zod";

// Signup form validation schema
export const signupSchema = z.object({
  name: z
    .string({ message: "Please enter your full name" })
    .min(1, "Please enter your full name")
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name is too long (maximum 50 characters)")
    .regex(/^[a-zA-Z\s]+$/, "Name can only contain letters and spaces"),
  email: z
    .string({ message: "Please enter your email address" })
    .min(1, "Please enter your email address")
    .email("Please enter a valid email address (example: john@company.com)"),
  password: z
    .string({ message: "Please create a password" })
    .min(1, "Please create a password")
    .min(8, "Password must be at least 8 characters long")
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, "Password must include uppercase letter, lowercase letter, number, and special character (@$!%*?&)"),
});

// Signin form validation schema
export const signinSchema = z.object({
  email: z
    .string({ message: "Please enter your email address" })
    .min(1, "Please enter your email address")
    .email("Please enter a valid email address"),
  password: z
    .string({ message: "Please enter your password" })
    .min(1, "Please enter your password"),
});

// Forgot password validation schema
export const forgotPasswordSchema = z.object({
  email: z
    .string({ message: "Please enter your email address" })
    .min(1, "Please enter your email address")
    .email("Please enter a valid email address"),
});

// Reset password validation schema
export const resetPasswordSchema = z.object({
  password: z
    .string({ message: "Please create a new password" })
    .min(1, "Please create a new password")
    .min(8, "Password must be at least 8 characters long")
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, "Password must include uppercase letter, lowercase letter, number, and special character (@$!%*?&)"),
  confirmPassword: z
    .string({ message: "Please confirm your new password" })
    .min(1, "Please confirm your new password"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match. Please try again.",
  path: ["confirmPassword"],
});

// Access code validation schema
export const accessCodeSchema = z.object({
  code: z
    .string({ message: "Please enter the 6-digit access code" })
    .min(1, "Please enter the 6-digit access code")
    .length(6, "Access code must be exactly 6 digits")
    .regex(/^\d+$/, "Access code must contain only numbers"),
});


// Contact person validation schema
export const contactPersonSchema = z.object({
  firstName: z
    .string({ message: "Please enter the first name" })
    .min(1, "Please enter the first name")
    .min(2, "First name must be at least 2 characters")
    .max(50, "First name is too long (maximum 50 characters)"),
  lastName: z
    .string({ message: "Please enter the last name" })
    .min(1, "Please enter the last name")
    .min(2, "Last name must be at least 2 characters")
    .max(50, "Last name is too long (maximum 50 characters)"),
  email: z
    .string({ message: "Please enter the email address" })
    .min(1, "Please enter the email address")
    .email("Please enter a valid email address"),
  phone: z
    .string({ message: "Please enter the phone number" })
    .min(1, "Please enter the phone number")
    .regex(/^\+?[\d\s\-\(\)]+$/, "Please enter a valid phone number"),
  position: z
    .string({ message: "Please enter the position/title" })
    .min(1, "Please enter the position/title")
    .min(2, "Position must be at least 2 characters")
    .max(100, "Position is too long (maximum 100 characters)"),
});

// Bank details validation schema
export const bankDetailsSchema = z.object({
  bankName: z
    .string({ message: "Please enter the bank name" })
    .min(1, "Please enter the bank name")
    .min(2, "Bank name must be at least 2 characters"),
  accountNumber: z
    .string({ message: "Please enter the account number" })
    .min(1, "Please enter the account number")
    .min(8, "Account number must be at least 8 digits")
    .regex(/^\d+$/, "Account number must contain only numbers"),
  routingNumber: z
    .string({ message: "Please enter the routing number" })
    .min(1, "Please enter the routing number")
    .length(9, "Routing number must be exactly 9 digits")
    .regex(/^\d+$/, "Routing number must contain only numbers"),
  accountType: z
    .string({ message: "Please select the account type" })
    .min(1, "Please select the account type"),
});

// Invite member validation schema
export const inviteMemberSchema = z.object({
  email: z
    .string({ message: "Please enter the email address" })
    .min(1, "Please enter the email address")
    .email("Please enter a valid email address"),
  role: z
    .string({ message: "Please select a role" })
    .min(1, "Please select a role"),
});

// Generic required field validation
export const requiredField = z.string({ message: "This field is required" }).min(1, "This field is required");

// Email validation
export const emailValidation = z.string({ message: "Please enter an email address" }).min(1, "Please enter an email address").email("Please enter a valid email address");

// Phone validation
export const phoneValidation = z.string({ message: "Please enter a phone number" }).min(1, "Please enter a phone number").regex(/^\+?[\d\s\-\(\)]+$/, "Please enter a valid phone number");

// Password validation
export const passwordValidation = z
  .string({ message: "Please enter a password" })
  .min(1, "Please enter a password")
  .min(8, "Password must be at least 8 characters long")
  .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, "Password must include uppercase letter, lowercase letter, and number");

export type SignupFormData = z.infer<typeof signupSchema>;
export type SigninFormData = z.infer<typeof signinSchema>;
export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;
export type AccessCodeFormData = z.infer<typeof accessCodeSchema>;
// On-boarding business profile validation schema
export const onboardingBusinessProfileSchema = z.object({
  businessName: z
    .string({ message: "Business name is required" })
    .min(2, "Business name must be at least 2 characters")
    .max(100, "Business name is too long (maximum 100 characters)")
    .regex(/^[a-zA-Z0-9\s&.,'-]+$/, "Business name contains invalid characters"),
  industry: z
    .string({ message: "Industry is required" })
    .min(1, "Please select an industry"),
  businessType: z
    .string({ message: "Business type is required" })
    .min(1, "Please select a business type"),
  businessAddress: z
    .string({ message: "Business address is required" })
    .min(1, "Business address is required")
    .max(200, "Address is too long (maximum 200 characters)"),
  city: z
    .string({ message: "City is required" })
    .min(2, "City must be at least 2 characters")
    .max(50, "City is too long (maximum 50 characters)")
    .regex(/^[a-zA-Z\s'-]+$/, "City contains invalid characters"),
  country: z
    .string({ message: "Country is required" })
    .min(1, "Please select a country"),
  multipleBranches: z
    .enum(["yes", "no"], { message: "Please specify if you have multiple branches" })
});

// Profile form validation schema  
export const profileFormSchema = z.object({
  firstName: z
    .string({ message: "Please enter your first name" })
    .min(2, "First name must be at least 2 characters")
    .max(50, "First name is too long (maximum 50 characters)")
    .regex(/^[a-zA-Z\s'-]+$/, "First name can only contain letters, spaces, hyphens, and apostrophes"),
  lastName: z
    .string({ message: "Please enter your last name" })
    .min(2, "Last name must be at least 2 characters")
    .max(50, "Last name is too long (maximum 50 characters)")
    .regex(/^[a-zA-Z\s'-]+$/, "Last name can only contain letters, spaces, hyphens, and apostrophes"),
  workEmail: z
    .string({ message: "Please enter your work email" })
    .email("Please enter a valid email address")
    .regex(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, "Please enter a valid email format"),
  phoneNumber: z
    .string({ message: "Please enter your phone number" })
    .min(8, "Phone number must be at least 8 digits")
    .max(15, "Phone number is too long (maximum 15 digits)")
    .regex(/^[\d\s\-\(\)\+]+$/, "Phone number contains invalid characters"),
  role: z
    .string({ message: "Please select your role" })
    .min(1, "Role selection is required"),
  password: z
    .string({ message: "Please create a password" })
    .min(8, "Password must be at least 8 characters long")
    .max(128, "Password is too long (maximum 128 characters)")
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, 
      "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"),
  confirmPassword: z
    .string({ message: "Please confirm your password" })
    .min(1, "Password confirmation is required")
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match. Please ensure both passwords are identical.",
  path: ["confirmPassword"],
});

// Change password validation schema
export const changePasswordSchema = z.object({
  currentPassword: z
    .string({ message: "Please enter your current password" })
    .min(1, "Current password is required"),
  newPassword: z
    .string({ message: "Please enter a new password" })
    .min(8, "Password must be at least 8 characters long")
    .max(128, "Password is too long (maximum 128 characters)")
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, 
      "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"),
  confirmPassword: z
    .string({ message: "Please confirm your new password" })
    .min(1, "Password confirmation is required")
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords do not match. Please ensure both passwords are identical.",
  path: ["confirmPassword"],
}).refine((data) => data.currentPassword !== data.newPassword, {
  message: "New password must be different from your current password.",
  path: ["newPassword"],
});

export type ContactPersonFormData = z.infer<typeof contactPersonSchema>;
export type BankDetailsFormData = z.infer<typeof bankDetailsSchema>;
export type OnboardingBusinessProfileFormData = z.infer<typeof onboardingBusinessProfileSchema>;
export type ProfileFormData = z.infer<typeof profileFormSchema>;
export type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;
