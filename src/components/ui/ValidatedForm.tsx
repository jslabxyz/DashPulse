import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, CheckCircle } from 'lucide-react';
import { ValidationSchema, validateData, ValidationResult } from '@/utils/inputValidation';
import { handleValidationError } from '@/utils/errorHandler';

interface ValidatedFormProps {
  schema: ValidationSchema;
  onSubmit: (data: Record<string, any>) => void | Promise<void>;
  children: React.ReactNode;
  title?: string;
  submitText?: string;
  className?: string;
  disabled?: boolean;
}

export const ValidatedForm: React.FC<ValidatedFormProps> = ({
  schema,
  onSubmit,
  children,
  title,
  submitText = "Submit",
  className,
  disabled = false
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleSubmit = useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      // Extract form data
      const formData = new FormData(e.currentTarget);
      const data: Record<string, any> = {};
      
      formData.forEach((value, key) => {
        data[key] = value;
      });

      // Validate the data
      const result = validateData(data, schema);
      setValidationResult(result);

      if (!result.isValid) {
        handleValidationError(
          new Error('Form validation failed'),
          'formSubmission',
          'ValidatedForm'
        );
        return;
      }

      // Submit the sanitized data
      await onSubmit(result.sanitizedData);
      
      // Clear validation result on successful submission
      setValidationResult(null);
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred';
      setSubmitError(errorMessage);
      handleValidationError(
        error instanceof Error ? error : new Error(errorMessage),
        'formSubmission',
        'ValidatedForm'
      );
    } finally {
      setIsSubmitting(false);
    }
  }, [schema, onSubmit]);

  return (
    <Card className={className}>
      {title && (
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
      )}
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {children}
          
          {/* Validation Summary */}
          {validationResult && !validationResult.isValid && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <span className="text-sm font-medium text-red-800">
                  Please fix the following errors:
                </span>
              </div>
              <ul className="text-sm text-red-700 space-y-1">
                {Object.entries(validationResult.errors).map(([field, error]) => (
                  <li key={field}>• {error}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Submit Error */}
          {submitError && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <span className="text-sm text-red-800">{submitError}</span>
              </div>
            </div>
          )}

          {/* Success Message */}
          {validationResult && validationResult.isValid && !isSubmitting && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span className="text-sm text-green-800">Form submitted successfully!</span>
              </div>
            </div>
          )}

          <Button 
            type="submit" 
            disabled={disabled || isSubmitting}
            className="w-full"
          >
            {isSubmitting ? 'Submitting...' : submitText}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};