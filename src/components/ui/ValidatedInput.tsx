import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AlertCircle, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ValidationRule, validateField, sanitizeInput } from '@/utils/inputValidation';

interface ValidatedInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  validationRule?: ValidationRule;
  onValidationChange?: (isValid: boolean, error: string | null) => void;
  showValidationIcon?: boolean;
  sanitize?: boolean;
}

export const ValidatedInput = React.forwardRef<HTMLInputElement, ValidatedInputProps>(
  ({ 
    label, 
    validationRule, 
    onValidationChange, 
    showValidationIcon = true,
    sanitize = true,
    className,
    onChange,
    onBlur,
    value,
    ...props 
  }, ref) => {
    const [error, setError] = useState<string | null>(null);
    const [isValid, setIsValid] = useState<boolean>(true);
    const [isTouched, setIsTouched] = useState(false);

    const validateValue = (val: any) => {
      if (!validationRule) return;

      const fieldName = label || props.name || 'Field';
      const validationError = validateField(val, validationRule, fieldName);
      
      setError(validationError);
      setIsValid(!validationError);
      
      onValidationChange?.(!validationError, validationError);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      let newValue = e.target.value;
      
      // Sanitize input if enabled
      if (sanitize && typeof newValue === 'string') {
        newValue = sanitizeInput(newValue);
        
        // Update the input value if it was sanitized
        if (newValue !== e.target.value) {
          e.target.value = newValue;
        }
      }

      // Validate on change if field has been touched
      if (isTouched) {
        validateValue(newValue);
      }

      onChange?.(e);
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsTouched(true);
      validateValue(e.target.value);
      onBlur?.(e);
    };

    // Validate initial value
    useEffect(() => {
      if (value !== undefined && validationRule) {
        validateValue(value);
      }
    }, [value, validationRule]);

    const inputId = props.id || `input-${Math.random().toString(36).substr(2, 9)}`;

    return (
      <div className="space-y-2">
        {label && (
          <Label htmlFor={inputId} className="text-sm font-medium">
            {label}
            {validationRule?.required && <span className="text-red-500 ml-1">*</span>}
          </Label>
        )}
        
        <div className="relative">
          <Input
            ref={ref}
            id={inputId}
            className={cn(
              className,
              error && isTouched && "border-red-500 focus:border-red-500",
              isValid && isTouched && value && "border-green-500 focus:border-green-500"
            )}
            value={value}
            onChange={handleChange}
            onBlur={handleBlur}
            {...props}
          />
          
          {showValidationIcon && isTouched && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              {error ? (
                <AlertCircle className="h-4 w-4 text-red-500" />
              ) : value && isValid ? (
                <CheckCircle className="h-4 w-4 text-green-500" />
              ) : null}
            </div>
          )}
        </div>
        
        {error && isTouched && (
          <p className="text-sm text-red-500 flex items-center gap-1">
            <AlertCircle className="h-3 w-3" />
            {error}
          </p>
        )}
      </div>
    );
  }
);

ValidatedInput.displayName = "ValidatedInput";