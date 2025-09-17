import React from "react";
import { useForm, UseFormReturn, FieldValues, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

interface FormProps<T extends FieldValues> {
  schema: z.ZodSchema<T>;
  onSubmit: SubmitHandler<T>;
  children: (form: UseFormReturn<T>) => React.ReactNode;
  defaultValues?: Partial<T>;
  className?: string;
}

export function Form<T extends FieldValues>({
  schema,
  onSubmit,
  children,
  defaultValues,
  className = "",
}: FormProps<T>) {
  const form = useForm<T>({
    resolver: zodResolver(schema) as any,
    defaultValues: defaultValues as any,
    mode: "onBlur", // Validate on blur for better UX
  });

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className={className}>
      {children(form)}
    </form>
  );
}

// Hook for easy form validation
export function useFormValidation<T extends FieldValues>(
  schema: z.ZodSchema<T>,
  defaultValues?: Partial<T>
) {
  return useForm<T>({
    resolver: zodResolver(schema) as any,
    defaultValues: defaultValues as any,
    mode: "onBlur",
    shouldUnregister: false, // Keep field values even when empty
  });
}
