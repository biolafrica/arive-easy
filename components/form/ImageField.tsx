'use client';

import { useState, useRef, useCallback, DragEvent, ChangeEvent, useEffect } from 'react';
import { XMarkIcon, DocumentIcon } from '@heroicons/react/24/outline';
import { ImageFieldProps } from '@/type/form';

const aspectRatioClass: Record<string, string> = {
  '1:1':  'aspect-square',
  '16:9': 'aspect-video',
  '4:3':  'aspect-[4/3]',
  '3:2':  'aspect-[3/2]',
};

const ImageField: React.FC<ImageFieldProps> = ({
  name,
  label,
  value,
  onChange,
  onBlur,
  accept = 'image/*',
  maxSize = 5,
  required = false,
  disabled = false,
  error,
  helperText,
  preview = true,
  multiple = false,
  aspectRatio,
  className = '',
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (value instanceof File && value.type.startsWith('image/')) {
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

  const validateFile = (file: File): string | null => {
    const maxSizeBytes = maxSize * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      return `File size must be less than ${maxSize}MB`;
    }
    if (accept !== 'image/*' && accept !== '*') {
      const acceptedTypes = accept.split(',').map((t) => t.trim());
      const fileExtension = `.${file.name.split('.').pop()?.toLowerCase()}`;
      const isAccepted = acceptedTypes.some(
        (t) =>
          t === file.type ||
          t === fileExtension ||
          (t.endsWith('/*') && file.type.startsWith(t.replace('/*', '')))
      );
      if (!isAccepted) return `File type not accepted. Allowed: ${accept}`;
    }
    return null;
  };

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
    [onChange, maxSize, accept]
  );

  const handleDragEnter = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) setIsDragging(true);
  };
  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };
  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };
  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (disabled) return;
    const files = e.dataTransfer.files;
    if (files?.length > 0) handleFileSelect(files[0]);
  };

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

  const isImageFile = value instanceof File && value.type.startsWith('image/');
  const isNonImageFile = value instanceof File && !value.type.startsWith('image/');
  const displayError = uploadError || error;

  const acceptLabel = (() => {
    if (accept === 'image/*') return 'PNG, JPG, GIF, WebP';
    if (accept === '*' || accept === '*/*') return 'Any file type';
    return accept.toUpperCase();
  })();

  const ratioClass = aspectRatio ? (aspectRatioClass[aspectRatio] ?? '') : '';

  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-medium text-heading mb-2">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      <div
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onBlur={onBlur}
        onClick={!value ? handleClick : undefined}
        className={[
          'relative rounded-xl border border-dashed transition-all duration-200 overflow-hidden',
          ratioClass,
          !ratioClass ? 'min-h-[200px]' : '',
          isDragging
            ? 'border-accent bg-accent/5'
            : displayError
            ? 'border-red-400 bg-red-50 dark:bg-red-900/10'
            : 'border-border bg-card',
          !value && !disabled ? 'cursor-pointer hover:border-secondary hover:bg-hover/40' : '',
          disabled ? 'opacity-50 cursor-not-allowed' : '',
        ].join(' ')}
      >
        <input
          ref={fileInputRef}
          type="file"
          name={name}
          accept={accept}
          onChange={handleInputChange}
          disabled={disabled}
          multiple={multiple}
          className="sr-only"
          aria-invalid={!!displayError}
          aria-describedby={displayError ? `${name}-error` : undefined}
        />

        {/* ── Has file: image preview ── */}
        {previewUrl && preview && isImageFile && (
          <div className="p-4 flex flex-col items-center gap-3">
            <div className="relative w-full">
              <img
                src={previewUrl}
                alt="Preview"
                className={[
                  'w-full object-cover rounded-lg border border-border',
                  aspectRatio === '1:1' ? 'aspect-square' : '',
                  aspectRatio === '16:9' ? 'aspect-video' : '',
                  aspectRatio === '4:3' ? 'aspect-[4/3]' : '',
                  !aspectRatio || aspectRatio === 'free' ? 'max-h-56' : '',
                ].join(' ')}
              />
              {!disabled && (
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); handleRemove(); }}
                  className="absolute top-2 right-2 p-1.5 bg-red-500 hover:bg-red-600 text-white rounded-full shadow-md transition-colors"
                  aria-label="Remove file"
                >
                  <XMarkIcon className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
            <p className="text-xs text-secondary truncate max-w-full px-2">
              {(value as File).name} · {((value as File).size / 1024 / 1024).toFixed(2)} MB
            </p>
          </div>
        )}

        {/* ── Has file: non-image (PDF, doc, etc.) ── */}
        {isNonImageFile && (
          <div className="p-6 flex items-center gap-4">
            <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center">
              <DocumentIcon className="h-6 w-6 text-accent" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-heading truncate">{(value as File).name}</p>
              <p className="text-xs text-secondary mt-0.5">
                {((value as File).size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
            {!disabled && (
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); handleRemove(); }}
                className="flex-shrink-0 p-1.5 text-secondary hover:text-red-500 rounded-full transition-colors"
                aria-label="Remove file"
              >
                <XMarkIcon className="h-4 w-4" />
              </button>
            )}
          </div>
        )}

        {/* ── Has string URL ── */}
        {typeof value === 'string' && previewUrl && preview && (
          <div className="p-4 flex flex-col items-center gap-3">
            <div className="relative w-full">
              <img
                src={previewUrl}
                alt="Preview"
                className="w-full object-cover rounded-lg border border-border max-h-56"
              />
              {!disabled && (
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); handleRemove(); }}
                  className="absolute top-2 right-2 p-1.5 bg-red-500 hover:bg-red-600 text-white rounded-full shadow-md transition-colors"
                  aria-label="Remove file"
                >
                  <XMarkIcon className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          </div>
        )}

        {/* ── Empty state ── */}
        {!value && (
          <div className="py-10 px-6 flex flex-col items-center text-center gap-4">
            {/* Cloud upload icon — inline SVG matching the reference */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 64 64"
              className={`w-14 h-14 transition-colors ${isDragging ? 'text-accent' : 'text-heading'}`}
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M44 38c4.4 0 8-3.6 8-8 0-4-2.9-7.3-6.7-7.9C44.4 16.4 40.5 13 36 13c-1.3 0-2.5.3-3.6.7C30.5 11 27.4 9 24 9c-5.5 0-10 4.5-10 10 0 .3 0 .7.1 1C10.2 21.5 8 24.5 8 28c0 5.5 4.5 10 10 10h4" />
              <polyline points="24 44 32 36 40 44" />
              <line x1="32" y1="36" x2="32" y2="56" />
            </svg>

            <div className="space-y-1">
              <p className="text-sm font-semibold text-heading">
                {isDragging ? 'Drop your file here' : (label || 'Upload file')}
              </p>
              {helperText && (
                <p className="text-sm text-secondary">{helperText}</p>
              )}
            </div>

            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); handleClick(); }}
              disabled={disabled}
              className="
                px-5 py-2 rounded-lg border border-border bg-card
                text-sm font-medium text-heading
                hover:bg-hover hover:border-secondary
                active:scale-[0.98]
                transition-all duration-150
                disabled:opacity-50 disabled:cursor-not-allowed 
              "
            >
              Select file
            </button>

            <p className="text-xs text-secondary py-5">
              {acceptLabel} · up to {maxSize}MB
            </p>
          </div>
        )}
      </div>

      {helperText && !displayError && !(!value) && (
        <p className="mt-1 text-xs text-secondary">{helperText}</p>
      )}
      {displayError && (
        <p id={`${name}-error`} className="mt-1 text-sm text-red-600 dark:text-red-400">
          {displayError}
        </p>
      )}
    </div>
  );
};

export default ImageField;