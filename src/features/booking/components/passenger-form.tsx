'use client';

import { useState } from 'react';
import {
  passengerSchema,
  type PassengerInput,
} from '../schemas/passenger-schema';

interface PassengerFormProps {
  onSubmit: (data: PassengerInput) => void;
  isSubmitting?: boolean;
}

export function PassengerForm({
  onSubmit,
  isSubmitting = false,
}: PassengerFormProps) {
  const [form, setForm] = useState<PassengerInput>({
    fullName: '',
    passportNo: '',
    nationality: '',
    dob: '',
  });

  const [errors, setErrors] = useState<
    Partial<Record<keyof PassengerInput, string>>
  >({});

  function handleChange(field: keyof PassengerInput, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
    // Clear field error on change
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const result = passengerSchema.safeParse(form);

    if (!result.success) {
      const fieldErrors: Partial<Record<keyof PassengerInput, string>> = {};
      for (const issue of result.error.issues) {
        const field = issue.path[0] as keyof PassengerInput;
        if (!fieldErrors[field]) {
          fieldErrors[field] = issue.message;
        }
      }
      setErrors(fieldErrors);
      return;
    }

    setErrors({});
    onSubmit(result.data);
  }

  const inputClasses = (field: keyof PassengerInput) =>
    `w-full rounded-xl border px-4 py-3 text-sm transition-colors
     focus:outline-none focus:ring-2 focus:ring-offset-1
     ${
       errors[field]
         ? 'border-red-300 bg-red-50 text-red-900 focus:border-red-400 focus:ring-red-200 dark:border-red-800 dark:bg-red-950 dark:text-red-200'
         : 'border-gray-200 bg-white text-gray-900 focus:border-gray-400 focus:ring-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:focus:ring-gray-700'
     }`;

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      {/* Full Name */}
      <div>
        <label
          htmlFor="fullName"
          className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          Full Name <span className="text-red-500">*</span>
        </label>
        <input
          id="fullName"
          type="text"
          autoComplete="name"
          placeholder="As shown on passport"
          value={form.fullName}
          onChange={(e) => handleChange('fullName', e.target.value)}
          className={inputClasses('fullName')}
          aria-invalid={!!errors.fullName}
          aria-describedby={errors.fullName ? 'fullName-error' : undefined}
          disabled={isSubmitting}
        />
        {errors.fullName && (
          <p
            id="fullName-error"
            role="alert"
            className="mt-1 text-xs text-red-600 dark:text-red-400"
          >
            {errors.fullName}
          </p>
        )}
      </div>

      {/* Passport Number */}
      <div>
        <label
          htmlFor="passportNo"
          className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          Passport Number <span className="text-red-500">*</span>
        </label>
        <input
          id="passportNo"
          type="text"
          autoComplete="off"
          placeholder="e.g. A12345678"
          value={form.passportNo}
          onChange={(e) =>
            handleChange('passportNo', e.target.value.toUpperCase())
          }
          className={inputClasses('passportNo')}
          aria-invalid={!!errors.passportNo}
          aria-describedby={errors.passportNo ? 'passportNo-error' : undefined}
          disabled={isSubmitting}
        />
        {errors.passportNo && (
          <p
            id="passportNo-error"
            role="alert"
            className="mt-1 text-xs text-red-600 dark:text-red-400"
          >
            {errors.passportNo}
          </p>
        )}
      </div>

      {/* Nationality */}
      <div>
        <label
          htmlFor="nationality"
          className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          Nationality <span className="text-red-500">*</span>
        </label>
        <input
          id="nationality"
          type="text"
          autoComplete="country-name"
          placeholder="e.g. Indian"
          value={form.nationality}
          onChange={(e) => handleChange('nationality', e.target.value)}
          className={inputClasses('nationality')}
          aria-invalid={!!errors.nationality}
          aria-describedby={
            errors.nationality ? 'nationality-error' : undefined
          }
          disabled={isSubmitting}
        />
        {errors.nationality && (
          <p
            id="nationality-error"
            role="alert"
            className="mt-1 text-xs text-red-600 dark:text-red-400"
          >
            {errors.nationality}
          </p>
        )}
      </div>

      {/* Date of Birth */}
      <div>
        <label
          htmlFor="dob"
          className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          Date of Birth <span className="text-red-500">*</span>
        </label>
        <input
          id="dob"
          type="date"
          value={form.dob}
          onChange={(e) => handleChange('dob', e.target.value)}
          max={new Date().toISOString().split('T')[0]}
          className={inputClasses('dob')}
          aria-invalid={!!errors.dob}
          aria-describedby={errors.dob ? 'dob-error' : undefined}
          disabled={isSubmitting}
        />
        {errors.dob && (
          <p
            id="dob-error"
            role="alert"
            className="mt-1 text-xs text-red-600 dark:text-red-400"
          >
            {errors.dob}
          </p>
        )}
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-xl bg-gray-900 px-6 py-3 text-sm font-semibold text-white
                   shadow-sm transition-all hover:bg-gray-800 hover:shadow-md
                   focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2
                   disabled:cursor-not-allowed disabled:opacity-50
                   dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100"
      >
        {isSubmitting ? (
          <span className="flex items-center justify-center gap-2">
            <svg
              className="h-4 w-4 animate-spin"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              />
            </svg>
            Confirming Booking…
          </span>
        ) : (
          'Confirm Booking →'
        )}
      </button>
    </form>
  );
}
