'use client';

import { useState, useRef, useCallback, DragEvent, ChangeEvent, useEffect } from 'react';
import { PhotoIcon, XMarkIcon, CloudArrowUpIcon } from '@heroicons/react/24/outline';
import { ImageFieldProps } from '@/type/form';

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
  aspectRatio = 'free',
  className = '',
}) => {
  const [isDragging, setIsDragging] = useState(false);
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

  const validateFile = (file: File): string | null => {
    if (!file.type.startsWith('image/')) {
      return 'Please upload an image file';
    }

    const maxSizeBytes = maxSize * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      return `File size must be less than ${maxSize}MB`;
    }

    if (accept !== 'image/*') {
      const acceptedTypes = accept.split(',').map(type => type.trim());
      const fileExtension = `.${file.name.split('.').pop()?.toLowerCase()}`;
      const mimeType = file.type;
      
      const isAccepted = acceptedTypes.some(type => 
        type === mimeType || type === fileExtension || 
        (type.endsWith('/*') && mimeType.startsWith(type.replace('/*', '')))
      );
      
      if (!isAccepted) {
        return `File type not accepted. Please upload: ${accept}`;
      }
    }

    return null;
  };

  const handleFileSelect = useCallback((file: File | null) => {
    if (!file) {
      onChange(null);
      setUploadError('');
      return;
    }

    const validationError = validateFile(file);
    if (validationError) {
      setUploadError(validationError);
      return;
    }

    setUploadError('');
    onChange(file);
  }, [onChange, maxSize, accept]);

  const handleDragEnter = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) {
      setIsDragging(true);
    }
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
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
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
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleClick = () => {
    if (!disabled && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const getAspectRatioClass = () => {
    switch (aspectRatio) {
      case '1:1': return 'aspect-square';
      case '16:9': return 'aspect-video';
      case '4:3': return 'aspect-4/3';
      case '3:2': return 'aspect-3/2';
      default: return '';
    }
  };

  const displayError = uploadError || error;

  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-medium text-heading mb-2">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      <div
        className={`
          relative border-2 border-dashed rounded-lg transition-all duration-200
          ${isDragging 
            ? 'border-accent bg-btn-secondary-active' 
            : displayError
            ? 'border-red-500 bg-red-50 dark:bg-red-900/10'
            : 'border-border hover:border-btn-secondary bg-card'
          }
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        `}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={handleClick}
        onBlur={onBlur}
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

        {previewUrl && preview ? (
          <div className={`relative ${getAspectRatioClass()} ${!aspectRatio ? 'h-64' : ''}`}>
            <img
              src={previewUrl}
              alt="Preview"
              className="w-full h-full object-cover rounded-lg"
            />
            {!disabled && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemove();
                }}
                className="absolute top-2 right-2 p-1.5 bg-red-500 hover:bg-red-600 text-white rounded-full shadow-lg transition-colors"
                aria-label="Remove image"
              >
                <XMarkIcon className="h-4 w-4" />
              </button>
            )}
            {value instanceof File && (
              <div className="absolute bottom-2 left-2 right-2 bg-black/70 text-white p-2 rounded text-xs">
                <p className="truncate">{value.name}</p>
                <p>{(value.size / 1024 / 1024).toFixed(2)} MB</p>
              </div>
            )}
          </div>
        ) : (
          <div className="p-8 text-center">
            <div className="flex justify-center mb-4">
              {isDragging ? (
                <CloudArrowUpIcon className="h-12 w-12 text-accent animate-bounce" />
              ) : (
                <PhotoIcon className="h-12 w-12 text-secondary" />
              )}
            </div>
            <p className="text-sm font-medium text-heading mb-1">
              {isDragging ? 'Drop your image here' : 'Click to upload or drag and drop'}
            </p>
            <p className="text-xs text-secondary">
              {accept === 'image/*' ? 'PNG, JPG, GIF, WebP' : accept.toUpperCase()} up to {maxSize}MB
            </p>
          </div>
        )}
      </div>

      {helperText && !displayError && (
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