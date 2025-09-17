import React from "react";
import { Input } from "./input";
import { Label } from "./label";

interface FormFieldProps {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: () => void;
  error?: string;
  required?: boolean;
  className?: string;
  disabled?: boolean;
}

export function FormField({
  label,
  name,
  type = "text",
  placeholder,
  value,
  onChange,
  onBlur,
  error,
  required = false,
  className = "",
  disabled = false,
}: FormFieldProps) {
  return (
    <div className={`space-y-2 ${className}`}>
      <Label htmlFor={name} className="block text-sm font-medium text-[#272635]">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </Label>
      <Input
        id={name}
        name={name}
        type={type}
        placeholder={placeholder}
        value={value || ""}
        onChange={onChange}
        onBlur={onBlur}
        disabled={disabled}
        className={`w-full border-[#e4e4e7] focus:border-[#03a84e] focus:ring-[#03a84e] h-12 sm:h-14 px-4 text-sm sm:text-base transition-colors ${
          error 
            ? "border-red-300 focus:border-red-500 focus:ring-red-500" 
            : ""
        }`}
      />
      {error && (
        <p className="text-red-500 text-xs sm:text-sm mt-1 flex items-center">
          <svg
            className="w-3 h-3 mr-1 flex-shrink-0"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
          {error}
        </p>
      )}
    </div>
  );
}
