import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/form-field";
import { Form, useFormValidation } from "@/components/ui/form";
import { 
  signinSchema, 
  forgotPasswordSchema, 
  resetPasswordSchema, 
  accessCodeSchema,
  contactPersonSchema,
  bankDetailsSchema,
  type SigninFormData,
  type ForgotPasswordFormData,
  type ResetPasswordFormData,
  type AccessCodeFormData,
  type ContactPersonFormData,
  type BankDetailsFormData
} from "@/lib/validations";

// Example 1: Sign In Form
export function SignInFormExample() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const form = useFormValidation<SigninFormData>(signinSchema, {
    email: "",
    password: "",
  });

  const handleSignIn = async (data: SigninFormData) => {
    setLoading(true);
    setError("");
    
    try {
      // Your sign in logic here
      console.log("Sign in data:", data);
    } catch (error: any) {
      setError(error.message || "Sign in failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Sign In</h2>
      
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
          {error}
        </div>
      )}

      <Form schema={signinSchema} onSubmit={handleSignIn}>
        {(formInstance) => (
          <div className="space-y-4">
            <FormField
              label="Email"
              name="email"
              type="email"
              placeholder="Enter your email"
              value={formInstance.watch("email")}
              onChange={formInstance.register("email").onChange}
              onBlur={() => formInstance.trigger("email")}
              error={formInstance.formState.errors.email?.message}
              required
            />

            <FormField
              label="Password"
              name="password"
              type="password"
              placeholder="Enter your password"
              value={formInstance.watch("password")}
              onChange={formInstance.register("password").onChange}
              onBlur={() => formInstance.trigger("password")}
              error={formInstance.formState.errors.password?.message}
              required
            />

            <Button
              type="submit"
              variant="default"
              size="default"
              disabled={loading || !formInstance.formState.isValid}
              className="w-full"
            >
              {loading ? "Signing in..." : "Sign In"}
            </Button>
          </div>
        )}
      </Form>
    </div>
  );
}

// Example 2: Forgot Password Form
export function ForgotPasswordFormExample() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");

  const form = useFormValidation<ForgotPasswordFormData>(forgotPasswordSchema, {
    email: "",
  });

  const handleForgotPassword = async (data: ForgotPasswordFormData) => {
    setLoading(true);
    setSuccess("");
    
    try {
      // Your forgot password logic here
      console.log("Forgot password data:", data);
      setSuccess("Password reset link sent to your email!");
    } catch (error: any) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Forgot Password</h2>
      
      {success && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-green-600 text-sm">
          {success}
        </div>
      )}

      <Form schema={forgotPasswordSchema} onSubmit={handleForgotPassword}>
        {(formInstance) => (
          <div className="space-y-4">
            <FormField
              label="Email"
              name="email"
              type="email"
              placeholder="Enter your email"
              value={formInstance.watch("email")}
              onChange={formInstance.register("email").onChange}
              onBlur={() => formInstance.trigger("email")}
              error={formInstance.formState.errors.email?.message}
              required
            />

            <Button
              type="submit"
              variant="default"
              size="default"
              disabled={loading || !formInstance.formState.isValid}
              className="w-full"
            >
              {loading ? "Sending..." : "Send Reset Link"}
            </Button>
          </div>
        )}
      </Form>
    </div>
  );
}

// Example 3: Reset Password Form
export function ResetPasswordFormExample() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");

  const form = useFormValidation<ResetPasswordFormData>(resetPasswordSchema, {
    password: "",
    confirmPassword: "",
  });

  const handleResetPassword = async (data: ResetPasswordFormData) => {
    setLoading(true);
    setSuccess("");
    
    try {
      // Your reset password logic here
      console.log("Reset password data:", data);
      setSuccess("Password updated successfully!");
    } catch (error: any) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Reset Password</h2>
      
      {success && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-green-600 text-sm">
          {success}
        </div>
      )}

      <Form schema={resetPasswordSchema} onSubmit={handleResetPassword}>
        {(formInstance) => (
          <div className="space-y-4">
            <FormField
              label="New Password"
              name="password"
              type="password"
              placeholder="Enter new password"
              value={formInstance.watch("password")}
              onChange={formInstance.register("password").onChange}
              onBlur={() => formInstance.trigger("password")}
              error={formInstance.formState.errors.password?.message}
              required
            />

            <FormField
              label="Confirm Password"
              name="confirmPassword"
              type="password"
              placeholder="Confirm new password"
              value={formInstance.watch("confirmPassword")}
              onChange={formInstance.register("confirmPassword").onChange}
              onBlur={() => formInstance.trigger("confirmPassword")}
              error={formInstance.formState.errors.confirmPassword?.message}
              required
            />

            <Button
              type="submit"
              variant="default"
              size="default"
              disabled={loading || !formInstance.formState.isValid}
              className="w-full"
            >
              {loading ? "Updating..." : "Update Password"}
            </Button>
          </div>
        )}
      </Form>
    </div>
  );
}

// Example 4: Access Code Form
export function AccessCodeFormExample() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const form = useFormValidation<AccessCodeFormData>(accessCodeSchema, {
    code: "",
  });

  const handleAccessCode = async (data: AccessCodeFormData) => {
    setLoading(true);
    setError("");
    
    try {
      // Your access code validation logic here
      console.log("Access code data:", data);
    } catch (error: any) {
      setError("Invalid access code");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Enter Access Code</h2>
      
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
          {error}
        </div>
      )}

      <Form schema={accessCodeSchema} onSubmit={handleAccessCode}>
        {(formInstance) => (
          <div className="space-y-4">
            <FormField
              label="6-Digit Code"
              name="code"
              type="text"
              placeholder="Enter 6-digit code"
              value={formInstance.watch("code")}
              onChange={formInstance.register("code").onChange}
              onBlur={() => formInstance.trigger("code")}
              error={formInstance.formState.errors.code?.message}
              required
            />

            <Button
              type="submit"
              variant="default"
              size="default"
              disabled={loading || !formInstance.formState.isValid}
              className="w-full"
            >
              {loading ? "Verifying..." : "Verify Code"}
            </Button>
          </div>
        )}
      </Form>
    </div>
  );
}


// Example 6: Contact Person Form
export function ContactPersonFormExample() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");

  const form = useFormValidation<ContactPersonFormData>(contactPersonSchema, {
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    position: "",
  });

  const handleContactPerson = async (data: ContactPersonFormData) => {
    setLoading(true);
    setSuccess("");
    
    try {
      // Your contact person logic here
      console.log("Contact person data:", data);
      setSuccess("Contact person added successfully!");
    } catch (error: any) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Add Contact Person</h2>
      
      {success && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-green-600 text-sm">
          {success}
        </div>
      )}

      <Form schema={contactPersonSchema} onSubmit={handleContactPerson}>
        {(formInstance) => (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                label="First Name"
                name="firstName"
                type="text"
                placeholder="Enter first name"
                value={formInstance.watch("firstName")}
                onChange={formInstance.register("firstName").onChange}
                onBlur={() => formInstance.trigger("firstName")}
                error={formInstance.formState.errors.firstName?.message}
                required
              />

              <FormField
                label="Last Name"
                name="lastName"
                type="text"
                placeholder="Enter last name"
                value={formInstance.watch("lastName")}
                onChange={formInstance.register("lastName").onChange}
                onBlur={() => formInstance.trigger("lastName")}
                error={formInstance.formState.errors.lastName?.message}
                required
              />
            </div>

            <FormField
              label="Email"
              name="email"
              type="email"
              placeholder="Enter email"
              value={formInstance.watch("email")}
              onChange={formInstance.register("email").onChange}
              onBlur={() => formInstance.trigger("email")}
              error={formInstance.formState.errors.email?.message}
              required
            />

            <FormField
              label="Phone"
              name="phone"
              type="tel"
              placeholder="Enter phone number"
              value={formInstance.watch("phone")}
              onChange={formInstance.register("phone").onChange}
              onBlur={() => formInstance.trigger("phone")}
              error={formInstance.formState.errors.phone?.message}
              required
            />

            <FormField
              label="Position"
              name="position"
              type="text"
              placeholder="Enter position"
              value={formInstance.watch("position")}
              onChange={formInstance.register("position").onChange}
              onBlur={() => formInstance.trigger("position")}
              error={formInstance.formState.errors.position?.message}
              required
            />

            <Button
              type="submit"
              variant="default"
              size="default"
              disabled={loading || !formInstance.formState.isValid}
              className="w-full"
            >
              {loading ? "Adding..." : "Add Contact Person"}
            </Button>
          </div>
        )}
      </Form>
    </div>
  );
}

// Example 7: Bank Details Form
export function BankDetailsFormExample() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");

  const form = useFormValidation<BankDetailsFormData>(bankDetailsSchema, {
    bankName: "",
    accountNumber: "",
    routingNumber: "",
    accountType: "",
  });

  const handleBankDetails = async (data: BankDetailsFormData) => {
    setLoading(true);
    setSuccess("");
    
    try {
      // Your bank details logic here
      console.log("Bank details data:", data);
      setSuccess("Bank details saved successfully!");
    } catch (error: any) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Bank Details</h2>
      
      {success && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-green-600 text-sm">
          {success}
        </div>
      )}

      <Form schema={bankDetailsSchema} onSubmit={handleBankDetails}>
        {(formInstance) => (
          <div className="space-y-4">
            <FormField
              label="Bank Name"
              name="bankName"
              type="text"
              placeholder="Enter bank name"
              value={formInstance.watch("bankName")}
              onChange={formInstance.register("bankName").onChange}
              onBlur={() => formInstance.trigger("bankName")}
              error={formInstance.formState.errors.bankName?.message}
              required
            />

            <FormField
              label="Account Number"
              name="accountNumber"
              type="text"
              placeholder="Enter account number"
              value={formInstance.watch("accountNumber")}
              onChange={formInstance.register("accountNumber").onChange}
              onBlur={() => formInstance.trigger("accountNumber")}
              error={formInstance.formState.errors.accountNumber?.message}
              required
            />

            <FormField
              label="Routing Number"
              name="routingNumber"
              type="text"
              placeholder="Enter routing number"
              value={formInstance.watch("routingNumber")}
              onChange={formInstance.register("routingNumber").onChange}
              onBlur={() => formInstance.trigger("routingNumber")}
              error={formInstance.formState.errors.routingNumber?.message}
              required
            />

            <FormField
              label="Account Type"
              name="accountType"
              type="text"
              placeholder="Enter account type"
              value={formInstance.watch("accountType")}
              onChange={formInstance.register("accountType").onChange}
              onBlur={() => formInstance.trigger("accountType")}
              error={formInstance.formState.errors.accountType?.message}
              required
            />

            <Button
              type="submit"
              variant="default"
              size="default"
              disabled={loading || !formInstance.formState.isValid}
              className="w-full"
            >
              {loading ? "Saving..." : "Save Bank Details"}
            </Button>
          </div>
        )}
      </Form>
    </div>
  );
}
