import { useState, useCallback } from 'react';
import { ValidationSchema, validateData, ValidationResult } from '@/utils/inputValidation';
import { TransformationSchema, transformData } from '@/utils/dataTransformation';
import { handleValidationError, handleError } from '@/utils/errorHandler';

interface UseSecureFormOptions {
  validationSchema: ValidationSchema;
  transformationSchema?: TransformationSchema;
  onSubmit: (data: Record<string, any>) => void | Promise<void>;
  onValidationError?: (errors: Record<string, string>) => void;
}

interface UseSecureFormReturn {
  formData: Record<string, any>;
  errors: Record<string, string>;
  isValid: boolean;
  isSubmitting: boolean;
  submitError: string | null;
  updateField: (name: string, value: any) => void;
  validateField: (name: string) => void;
  validateForm: () => boolean;
  submitForm: () => Promise<void>;
  resetForm: () => void;
  setFormData: (data: Record<string, any>) => void;
}

export const useSecureForm = ({
  validationSchema,
  transformationSchema,
  onSubmit,
  onValidationError
}: UseSecureFormOptions): UseSecureFormReturn => {
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isValid, setIsValid] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const updateField = useCallback((name: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear field error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  }, [errors]);

  const validateField = useCallback((name: string) => {
    if (!validationSchema[name]) return;

    const rule = validationSchema[name];
    const value = formData[name];
    
    const fieldError = validateField(value, rule, name);
    
    setErrors(prev => ({
      ...prev,
      [name]: fieldError || ''
    }));
  }, [formData, validationSchema]);

  const validateForm = useCallback((): boolean => {
    try {
      const result: ValidationResult = validateData(formData, validationSchema);
      
      setErrors(result.errors);
      setIsValid(result.isValid);
      
      if (!result.isValid) {
        onValidationError?.(result.errors);
        handleValidationError(
          new Error('Form validation failed'),
          'formValidation',
          'useSecureForm'
        );
      }
      
      return result.isValid;
    } catch (error) {
      handleError(
        error instanceof Error ? error : new Error('Validation error'),
        { component: 'useSecureForm', action: 'validateForm' },
        'medium',
        'validation'
      );
      return false;
    }
  }, [formData, validationSchema, onValidationError]);

  const submitForm = useCallback(async (): Promise<void> => {
    if (isSubmitting) return;

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      // Validate form first
      if (!validateForm()) {
        return;
      }

      // Transform data if schema provided
      let processedData = formData;
      if (transformationSchema) {
        processedData = transformData(formData, transformationSchema);
      }

      // Submit the processed data
      await onSubmit(processedData);
      
      // Clear errors on successful submission
      setErrors({});
      setSubmitError(null);
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred during submission';
      setSubmitError(errorMessage);
      
      handleError(
        error instanceof Error ? error : new Error(errorMessage),
        { component: 'useSecureForm', action: 'submitForm' },
        'high',
        'api'
      );
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, transformationSchema, validateForm, onSubmit, isSubmitting]);

  const resetForm = useCallback(() => {
    setFormData({});
    setErrors({});
    setIsValid(false);
    setSubmitError(null);
  }, []);

  const setFormDataCallback = useCallback((data: Record<string, any>) => {
    setFormData(data);
    setErrors({});
    setSubmitError(null);
  }, []);

  return {
    formData,
    errors,
    isValid,
    isSubmitting,
    submitError,
    updateField,
    validateField,
    validateForm,
    submitForm,
    resetForm,
    setFormData: setFormDataCallback
  };
};