import React, { useEffect, useRef, useCallback, useState } from 'react';
import type { FieldValues, UseFormReturn, FieldErrors } from 'react-hook-form';
import { Button } from './ui/button';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { saveDraft, loadDraft, clearDraft, getDraftSavedAt } from '../utils/draft-storage';
import { cn } from '../lib/utils';

// ============================================================================
// Types and Interfaces
// ============================================================================

export interface FormTab {
  id: string;
  label: string;
  icon?: React.ReactNode;
  count?: number;
}

export interface FormWrapperProps<T extends FieldValues> {
  // Form configuration
  title: string;
  subtitle?: string;
  isEditMode: boolean;
  
  // Form state
  form: UseFormReturn<T>;
  isSubmitting: boolean;
  isLoading: boolean;
  
  // Callbacks
  onSubmit: (data: T) => Promise<void>;
  onCancel: () => void;
  
  // Features
  enableDraftSave?: boolean;
  contentType?: string;
  contentId?: string;
  tabs?: FormTab[];
  activeTab?: string;
  onTabChange?: (tabId: string) => void;
  enableKeyboardShortcuts?: boolean;
  
  // Children
  children: React.ReactNode;
}

interface ValidationSummaryProps {
  errors: FieldErrors;
  onErrorClick?: (fieldName: string) => void;
}

interface UnsavedChangesDialogProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

interface DraftRestorationDialogProps {
  isOpen: boolean;
  draftSavedAt: Date | null;
  onRestore: () => void;
  onDiscard: () => void;
}

interface LoadingSkeletonProps {
  rows?: number;
}

// ============================================================================
// Sub-components
// ============================================================================

/**
 * Loading skeleton displayed while fetching form data
 */
export function LoadingSkeleton({ rows = 6 }: LoadingSkeletonProps) {
  return (
    <div className="animate-pulse space-y-6" role="status" aria-label="Loading form">
      {/* Header skeleton */}
      <div className="space-y-2">
        <div className="h-8 bg-gray-200 rounded w-1/3"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
      </div>
      
      {/* Form fields skeleton */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-6">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="space-y-2">
            <div className="h-4 bg-gray-200 rounded w-24"></div>
            <div className="h-10 bg-gray-200 rounded w-full"></div>
          </div>
        ))}
      </div>
      
      {/* Actions skeleton */}
      <div className="flex justify-end gap-3">
        <div className="h-10 bg-gray-200 rounded w-24"></div>
        <div className="h-10 bg-gray-200 rounded w-32"></div>
      </div>
      
      <span className="sr-only">Loading form content...</span>
    </div>
  );
}

/**
 * Validation error summary displayed at the top of the form
 */
export function ValidationSummary({ errors, onErrorClick }: ValidationSummaryProps) {
  const errorEntries = Object.entries(errors);
  
  if (errorEntries.length === 0) return null;
  
  const handleErrorClick = (fieldName: string) => {
    if (onErrorClick) {
      onErrorClick(fieldName);
    }
  };
  
  return (
    <Alert 
      variant="destructive" 
      className="mb-6"
      role="alert"
      aria-live="assertive"
    >
      <AlertTitle className="flex items-center gap-2">
        <span aria-hidden="true">⚠️</span>
        Please fix the following errors
      </AlertTitle>
      <AlertDescription>
        <ul className="list-disc list-inside mt-2 space-y-1">
          {errorEntries.map(([fieldName, error]) => {
            const message = getErrorMessage(error);
            return (
              <li key={fieldName}>
                <button
                  type="button"
                  onClick={() => handleErrorClick(fieldName)}
                  className="text-left hover:underline focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 rounded"
                >
                  {formatFieldName(fieldName)}: {message}
                </button>
              </li>
            );
          })}
        </ul>
      </AlertDescription>
    </Alert>
  );
}

/**
 * Unsaved changes confirmation dialog
 */
export function UnsavedChangesDialog({ isOpen, onConfirm, onCancel }: UnsavedChangesDialogProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const confirmButtonRef = useRef<HTMLButtonElement>(null);
  
  // Focus trap and keyboard handling
  useEffect(() => {
    if (isOpen && confirmButtonRef.current) {
      confirmButtonRef.current.focus();
    }
  }, [isOpen]);
  
  useEffect(() => {
    if (!isOpen) return;
    
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onCancel();
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onCancel]);
  
  if (!isOpen) return null;
  
  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="unsaved-changes-title"
    >
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50" 
        onClick={onCancel}
        aria-hidden="true"
      />
      
      {/* Dialog */}
      <div 
        ref={dialogRef}
        className="relative bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4"
      >
        <h2 id="unsaved-changes-title" className="text-lg font-semibold text-gray-900 mb-2">
          Unsaved Changes
        </h2>
        <p className="text-gray-600 mb-6">
          You have unsaved changes. Are you sure you want to leave? Your changes will be lost.
        </p>
        <div className="flex justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
          >
            Stay on Page
          </Button>
          <Button
            ref={confirmButtonRef}
            type="button"
            variant="destructive"
            onClick={onConfirm}
          >
            Leave Without Saving
          </Button>
        </div>
      </div>
    </div>
  );
}

/**
 * Draft restoration dialog
 */
export function DraftRestorationDialog({ 
  isOpen, 
  draftSavedAt, 
  onRestore, 
  onDiscard 
}: DraftRestorationDialogProps) {
  const restoreButtonRef = useRef<HTMLButtonElement>(null);
  
  useEffect(() => {
    if (isOpen && restoreButtonRef.current) {
      restoreButtonRef.current.focus();
    }
  }, [isOpen]);
  
  useEffect(() => {
    if (!isOpen) return;
    
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onDiscard();
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onDiscard]);
  
  if (!isOpen) return null;
  
  const formattedDate = draftSavedAt 
    ? draftSavedAt.toLocaleString() 
    : 'Unknown time';
  
  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="draft-restoration-title"
    >
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50" 
        onClick={onDiscard}
        aria-hidden="true"
      />
      
      {/* Dialog */}
      <div className="relative bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4">
        <h2 id="draft-restoration-title" className="text-lg font-semibold text-gray-900 mb-2">
          Restore Draft?
        </h2>
        <p className="text-gray-600 mb-2">
          A draft was saved on {formattedDate}.
        </p>
        <p className="text-gray-600 mb-6">
          Would you like to restore it or start fresh?
        </p>
        <div className="flex justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={onDiscard}
          >
            Start Fresh
          </Button>
          <Button
            ref={restoreButtonRef}
            type="button"
            onClick={onRestore}
          >
            Restore Draft
          </Button>
        </div>
      </div>
    </div>
  );
}

/**
 * Character counter for fields with max length
 */
export interface CharacterCounterProps {
  current: number;
  max: number;
  className?: string;
}

export function CharacterCounter({ current, max, className }: CharacterCounterProps) {
  const percentage = (current / max) * 100;
  const isNearLimit = percentage >= 80;
  const isAtLimit = current >= max;
  
  return (
    <span 
      className={cn(
        "text-xs",
        isAtLimit ? "text-red-600" : isNearLimit ? "text-yellow-600" : "text-gray-500",
        className
      )}
      aria-live="polite"
    >
      {current}/{max}
    </span>
  );
}

/**
 * Form field wrapper with label, error display, and character counter
 */
export interface FormFieldProps {
  id: string;
  label: string;
  required?: boolean;
  error?: string;
  maxLength?: number;
  currentLength?: number;
  helpText?: string;
  children: React.ReactNode;
  className?: string;
}

export function FormField({
  id,
  label,
  required,
  error,
  maxLength,
  currentLength,
  helpText,
  children,
  className,
}: FormFieldProps) {
  return (
    <div className={cn("space-y-1", className)}>
      <div className="flex items-center justify-between">
        <label 
          htmlFor={id}
          className="block text-sm font-medium text-gray-700"
        >
          {label}
          {required && <span className="text-red-500 ml-1" aria-hidden="true">*</span>}
          {required && <span className="sr-only">(required)</span>}
        </label>
        {maxLength !== undefined && currentLength !== undefined && (
          <CharacterCounter current={currentLength} max={maxLength} />
        )}
      </div>
      
      {children}
      
      {error && (
        <p 
          id={`${id}-error`}
          className="text-sm text-red-600"
          role="alert"
        >
          {error}
        </p>
      )}
      
      {helpText && !error && (
        <p id={`${id}-help`} className="text-xs text-gray-500">
          {helpText}
        </p>
      )}
    </div>
  );
}

// ============================================================================
// Helper Functions
// ============================================================================

function getErrorMessage(error: unknown): string {
  if (typeof error === 'string') return error;
  if (error && typeof error === 'object' && 'message' in error) {
    return String((error as { message: unknown }).message);
  }
  return 'Invalid value';
}

function formatFieldName(fieldName: string): string {
  // Convert camelCase or snake_case to Title Case
  return fieldName
    .replace(/([A-Z])/g, ' $1')
    .replace(/_/g, ' ')
    .replace(/^\w/, c => c.toUpperCase())
    .trim();
}

// ============================================================================
// Main FormWrapper Component
// ============================================================================

export function FormWrapper<T extends FieldValues>({
  title,
  subtitle,
  isEditMode,
  form,
  isSubmitting,
  isLoading,
  onSubmit,
  onCancel,
  enableDraftSave = false,
  contentType,
  contentId,
  tabs,
  activeTab,
  onTabChange,
  enableKeyboardShortcuts = true,
  children,
}: FormWrapperProps<T>) {
  const formRef = useRef<HTMLFormElement>(null);
  const [showUnsavedDialog, setShowUnsavedDialog] = useState(false);
  const [showDraftDialog, setShowDraftDialog] = useState(false);
  const [draftSavedAt, setDraftSavedAt] = useState<Date | null>(null);
  const [pendingNavigation, setPendingNavigation] = useState<(() => void) | null>(null);
  const lastSaveRef = useRef<number>(0);
  
  const { formState: { errors, isDirty, dirtyFields }, reset, getValues } = form;
  
  // ARIA live region for announcements
  const [announcement, setAnnouncement] = useState<string>('');
  
  const announce = useCallback((message: string) => {
    setAnnouncement(message);
    // Clear after announcement
    setTimeout(() => setAnnouncement(''), 1000);
  }, []);
  
  // ============================================================================
  // Draft Management
  // ============================================================================
  
  // Check for existing draft on mount
  useEffect(() => {
    if (!enableDraftSave || !contentType) return;
    
    const savedAt = getDraftSavedAt(contentType, contentId);
    if (savedAt) {
      setDraftSavedAt(savedAt);
      setShowDraftDialog(true);
    }
  }, [enableDraftSave, contentType, contentId]);
  
  // Auto-save draft every 30 seconds
  useEffect(() => {
    if (!enableDraftSave || !contentType || isSubmitting) return;
    
    const interval = setInterval(() => {
      const now = Date.now();
      // Only save if form is dirty and at least 30 seconds since last save
      if (isDirty && now - lastSaveRef.current >= 30000) {
        const data = getValues();
        const success = saveDraft(contentType, data, contentId);
        if (success) {
          lastSaveRef.current = now;
          announce('Draft saved');
        }
      }
    }, 30000);
    
    return () => clearInterval(interval);
  }, [enableDraftSave, contentType, contentId, isDirty, isSubmitting, getValues, announce]);
  
  const handleRestoreDraft = useCallback(() => {
    if (!contentType) return;
    
    const draft = loadDraft<T>(contentType, contentId);
    if (draft) {
      reset(draft.data);
      announce('Draft restored');
    }
    setShowDraftDialog(false);
  }, [contentType, contentId, reset, announce]);
  
  const handleDiscardDraft = useCallback(() => {
    if (contentType) {
      clearDraft(contentType, contentId);
    }
    setShowDraftDialog(false);
  }, [contentType, contentId]);
  
  // ============================================================================
  // Keyboard Shortcuts
  // ============================================================================
  
  useEffect(() => {
    if (!enableKeyboardShortcuts) return;
    
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl+S or Cmd+S to save
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        if (!isSubmitting && formRef.current) {
          formRef.current.requestSubmit();
        }
      }
      
      // Escape to cancel (only if not in a dialog)
      if (e.key === 'Escape' && !showUnsavedDialog && !showDraftDialog) {
        e.preventDefault();
        handleCancelClick();
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [enableKeyboardShortcuts, isSubmitting, showUnsavedDialog, showDraftDialog]);
  
  // ============================================================================
  // Unsaved Changes Detection
  // ============================================================================
  
  const handleCancelClick = useCallback(() => {
    if (isDirty && Object.keys(dirtyFields).length > 0) {
      setPendingNavigation(() => onCancel);
      setShowUnsavedDialog(true);
    } else {
      onCancel();
    }
  }, [isDirty, dirtyFields, onCancel]);
  
  const handleConfirmLeave = useCallback(() => {
    setShowUnsavedDialog(false);
    if (contentType) {
      clearDraft(contentType, contentId);
    }
    if (pendingNavigation) {
      pendingNavigation();
    }
  }, [contentType, contentId, pendingNavigation]);
  
  const handleCancelLeave = useCallback(() => {
    setShowUnsavedDialog(false);
    setPendingNavigation(null);
  }, []);
  
  // ============================================================================
  // Form Submission
  // ============================================================================
  
  const handleFormSubmit = useCallback(async (data: T) => {
    try {
      await onSubmit(data);
      // Clear draft on successful submission
      if (contentType) {
        clearDraft(contentType, contentId);
      }
    } catch (error) {
      // Error handling is done by the parent component
      throw error;
    }
  }, [onSubmit, contentType, contentId]);
  
  // ============================================================================
  // Validation Error Handling
  // ============================================================================
  
  const scrollToFirstError = useCallback(() => {
    const errorKeys = Object.keys(errors);
    if (errorKeys.length === 0) return;
    
    const firstErrorField = errorKeys[0];
    const element = document.getElementById(firstErrorField) || 
                   document.querySelector(`[name="${firstErrorField}"]`);
    
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      (element as HTMLElement).focus();
    }
  }, [errors]);
  
  // Scroll to first error when errors change
  useEffect(() => {
    if (Object.keys(errors).length > 0) {
      scrollToFirstError();
      announce(`Form has ${Object.keys(errors).length} validation error${Object.keys(errors).length > 1 ? 's' : ''}`);
    }
  }, [errors, scrollToFirstError, announce]);
  
  const handleErrorClick = useCallback((fieldName: string) => {
    const element = document.getElementById(fieldName) || 
                   document.querySelector(`[name="${fieldName}"]`);
    
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      (element as HTMLElement).focus();
    }
  }, []);
  
  // ============================================================================
  // Render
  // ============================================================================
  
  // Show loading skeleton
  if (isLoading) {
    return <LoadingSkeleton />;
  }
  
  return (
    <>
      {/* ARIA Live Region for announcements */}
      <div 
        aria-live="polite" 
        aria-atomic="true" 
        className="sr-only"
      >
        {announcement}
      </div>
      
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
          {subtitle && (
            <p className="mt-1 text-sm text-gray-500">{subtitle}</p>
          )}
        </div>
        
        {/* Validation Error Summary */}
        <ValidationSummary errors={errors} onErrorClick={handleErrorClick} />
        
        <form 
          ref={formRef}
          onSubmit={form.handleSubmit(handleFormSubmit)}
          noValidate
        >
          {/* Tabs */}
          {tabs && tabs.length > 0 && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
              <div className="border-b border-gray-200">
                <nav className="flex -mb-px overflow-x-auto" role="tablist">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      type="button"
                      role="tab"
                      aria-selected={activeTab === tab.id}
                      aria-controls={`tabpanel-${tab.id}`}
                      id={`tab-${tab.id}`}
                      onClick={() => onTabChange?.(tab.id)}
                      className={cn(
                        "flex items-center gap-2 px-6 py-4 text-sm font-medium border-b-2 whitespace-nowrap transition-colors",
                        "focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2",
                        activeTab === tab.id
                          ? "border-indigo-500 text-indigo-600 bg-indigo-50/50"
                          : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                      )}
                    >
                      {tab.icon && <span aria-hidden="true">{tab.icon}</span>}
                      <span>{tab.label}</span>
                      {tab.count !== undefined && tab.count > 0 && (
                        <span className="ml-1 px-2 py-0.5 text-xs rounded-full bg-indigo-100 text-indigo-600">
                          {tab.count}
                        </span>
                      )}
                    </button>
                  ))}
                </nav>
              </div>
              
              <div className="p-6">
                {children}
              </div>
            </div>
          )}
          
          {/* Content without tabs */}
          {(!tabs || tabs.length === 0) && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6 p-6">
              {children}
            </div>
          )}
          
          {/* Form Actions */}
          <div className="flex items-center justify-end gap-3 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancelClick}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2"
            >
              {isSubmitting && (
                <svg 
                  className="animate-spin h-4 w-4" 
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <circle 
                    className="opacity-25" 
                    cx="12" 
                    cy="12" 
                    r="10" 
                    stroke="currentColor" 
                    strokeWidth="4" 
                    fill="none" 
                  />
                  <path 
                    className="opacity-75" 
                    fill="currentColor" 
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" 
                  />
                </svg>
              )}
              {isSubmitting 
                ? 'Saving...' 
                : isEditMode 
                  ? `Update ${title.replace(/^(Edit|Create New)\s*/i, '')}` 
                  : `Create ${title.replace(/^(Edit|Create New)\s*/i, '')}`
              }
            </Button>
          </div>
        </form>
      </div>
      
      {/* Dialogs */}
      <UnsavedChangesDialog
        isOpen={showUnsavedDialog}
        onConfirm={handleConfirmLeave}
        onCancel={handleCancelLeave}
      />
      
      <DraftRestorationDialog
        isOpen={showDraftDialog}
        draftSavedAt={draftSavedAt}
        onRestore={handleRestoreDraft}
        onDiscard={handleDiscardDraft}
      />
    </>
  );
}

export default FormWrapper;
