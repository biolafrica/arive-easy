'use client';

import { PhotoIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { useState, useRef, useCallback, ChangeEvent, useEffect } from 'react';
import { Button } from '../primitives/Button';

interface ProfilePhotoFieldProps {
  name: string;
  label?: string;
  value?: File | string | null;
  onChange: (file: File | null) => void;
  onBlur?: () => void;
  maxSize?: number;
  required?: boolean;
  disabled?: boolean;
  error?: string;
  helperText?: string;
  size?: 'sm' | 'md' | 'lg';
}

const sizeMap = {
  sm: 'w-16 h-16',
  md: 'w-24 h-24',
  lg: 'w-32 h-32',
};

const ProfilePhotoField: React.FC<ProfilePhotoFieldProps> = ({
  name,
  label = 'Photo',
  value,
  onChange,
  onBlur,
  maxSize = 5,
  required = false,
  disabled = false,
  error,
  helperText,
  size = 'md',
}) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (value instanceof File) {
      const url = URL.createObjectURL(value);
      setPreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    } else if (typeof value === 'string') {
      setPreviewUrl(value);
    } else {
      setPreviewUrl(null);
    }
    return undefined;
  }, [value]);

  const validateFile = useCallback(
    (file: File): string | null => {
      if (!file.type.startsWith('image/')) return 'Please upload an image file';
      const maxSizeBytes = maxSize * 1024 * 1024;
      if (file.size > maxSizeBytes) return `Image must be less than ${maxSize}MB`;
      return null;
    },
    [maxSize]
  );

  const handleFileSelect = useCallback(
    (file: File | null) => {
      if (!file) {
        onChange(null);
        setUploadError('');
        return;
      }
      const err = validateFile(file);
      if (err) {
        setUploadError(err);
        return;
      }
      setUploadError('');
      onChange(file);
    },
    [onChange, validateFile]
  );

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleRemove = () => {
    onChange(null);
    setPreviewUrl(null);
    setUploadError('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleClick = () => {
    if (!disabled) fileInputRef.current?.click();
  };

  const displayError = uploadError || error;
  const avatarSize = sizeMap[size];

  return (
    <div>
      {label && (
        <label className="block text-sm font-medium text-heading mb-3">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      <div className="flex items-center gap-5" onBlur={onBlur}>
        <input
          ref={fileInputRef}
          type="file"
          name={name}
          accept="image/*"
          onChange={handleInputChange}
          disabled={disabled}
          className="sr-only"
          aria-invalid={!!displayError}
          aria-describedby={displayError ? `${name}-photo-error` : undefined}
        />

        {/* ── Avatar circle ── */}
        <div
          className={`
            relative flex-shrink-0 ${avatarSize} rounded-full overflow-hidden
            bg-hover border border-border
          `}
        >
          {previewUrl ? (
            <img
              src={previewUrl}
              alt="Profile photo"
              className="w-full h-full object-cover"
            />
          ) : (
            /* Placeholder image icon */
            <div className="w-full h-full flex items-center justify-center">
              <PhotoIcon className="w-1/2 h-1/2 text-secondary"/>
            </div>
          )}

          {/* Remove overlay on hover when photo is set */}
          {previewUrl && !disabled && (
            <button
              type="button"
              onClick={handleRemove}
              aria-label="Remove photo"
              className="
                absolute inset-0 flex items-center justify-center
                bg-black/0 hover:bg-black/40
                transition-colors duration-200 group
              "
            >
              <XMarkIcon className="w-5 h-5 text-white opacity-0 group-hover:opacity-100 transition-opacity"/>
            </button>
          )}
        </div>

        <Button 
          type="button"
          onClick={handleClick}
          disabled={disabled}
          variant='outline'
        >
          {previewUrl ? 'Change photo' : 'Upload photo'}
        </Button>
      </div>

      {helperText && !displayError && (
        <p className="mt-2 text-xs text-secondary">{helperText}</p>
      )}
      {displayError && (
        <p id={`${name}-photo-error`} className="mt-2 text-sm text-red-600 dark:text-red-400">
          {displayError}
        </p>
      )}
    </div>
  );
};

export default ProfilePhotoField;