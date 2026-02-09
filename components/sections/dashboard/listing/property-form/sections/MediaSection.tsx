'use client';

import React, { useCallback, useRef, useState } from 'react';
import { usePropertyFormContext } from '../PropertyFormContext';
import * as icon from '@heroicons/react/24/outline';
import { VALIDATION_RULES, YOUTUBE_URL_REGEX } from '../pattern/constants';
import { PropertyImage } from '../pattern/types';
import { SectionHeader, inputClass } from '../pattern/components';

interface ImageUploaderProps {
  onUpload: (file: File) => Promise<string>;
}

export function MediaSection({ onUpload }: ImageUploaderProps) {
  const {
    values,
    errors,
    touched,
    setFieldValue,
    setFieldTouched,
    setVideoTour,
    clearVideoTour,
    setVirtual3DTour,
    clearVirtual3DTour,
  } = usePropertyFormContext();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [videoUrlInput, setVideoUrlInput] = useState(values.tours?.video?.url || '');
  const [virtual3DInput, setVirtual3DInput] = useState(values.tours?.virtual3D?.url || '');

  const showImagesError = touched.images && errors.images;
  const showVideoError = errors['tours.video'];
  const showVirtual3DError = errors['tours.virtual3D'];

  const canAddMore = values.images.length < VALIDATION_RULES.images.maxCount;

  const removeImageFromForm = useCallback((imageId: string) => {
    setFieldValue('images', values.images.filter(img => img.id !== imageId));
  }, [setFieldValue, values.images]);

  const reorderImagesInForm = useCallback((fromIndex: number, toIndex: number) => {
    const newImages = [...values.images];
    const [movedImage] = newImages.splice(fromIndex, 1);
    newImages.splice(toIndex, 0, movedImage);
    setFieldValue('images', newImages);
  }, [setFieldValue, values.images]);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const currentCount = values.images.length;
    const filesToProcess: Array<{ file: File; imageId: string; previewUrl: string }> = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      
      if (currentCount + filesToProcess.length >= VALIDATION_RULES.images.maxCount) {
        break;
      }

      if (!VALIDATION_RULES.images.allowedTypes.includes(file.type as any)) {
        console.warn(`Skipping ${file.name}: invalid type ${file.type}`);
        continue;
      }

      if (file.size > VALIDATION_RULES.images.maxSizeBytes) {
        console.warn(`Skipping ${file.name}: file too large`);
        continue;
      }

      const imageId = `img-${Date.now()}-${i}-${Math.random().toString(36).substr(2, 9)}`;
      const previewUrl = URL.createObjectURL(file);
      
      filesToProcess.push({ file, imageId, previewUrl });
    }

    if (filesToProcess.length === 0) {
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      return;
    }

    const newImages: PropertyImage[] = filesToProcess.map(({ imageId, previewUrl }) => ({
      id: imageId,
      url: previewUrl,
      isUploading: true,
    }));

    const updatedImages = [...values.images, ...newImages];
    setFieldValue('images', updatedImages);
    setFieldTouched('images');

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }

    for (const { file, imageId, previewUrl } of filesToProcess) {
      try {
        const uploadedUrl = await onUpload(file);
        
        setFieldValue('images', (currentImages: PropertyImage[]) => {
          if (!Array.isArray(currentImages)) {
            console.error('currentImages is not an array:', currentImages);
            return currentImages;
          }
          return currentImages.map(img => 
            img.id === imageId 
              ? { ...img, url: uploadedUrl, isUploading: false }
              : img
          );
        });
        
        URL.revokeObjectURL(previewUrl);
      } catch (error) {
        console.error(`Failed to upload image ${imageId}:`, error);
        
        setFieldValue('images', (currentImages: PropertyImage[]) => {
          if (!Array.isArray(currentImages)) {
            return currentImages;
          }
          return currentImages.map(img => 
            img.id === imageId 
              ? { ...img, isUploading: false, error: 'Upload failed' }
              : img
          );
        });
      }
    }
  };

  const handleVideoUrlSubmit = () => {
    if (videoUrlInput && YOUTUBE_URL_REGEX.test(videoUrlInput)) {
      setVideoTour(videoUrlInput);
    }
  };

  const handleVirtual3DSubmit = () => {
    if (virtual3DInput) {
      try {
        new URL(virtual3DInput);
        setVirtual3DTour(virtual3DInput);
      } catch {
        // Invalid URL
      }
    }
  };

  return (
    <div className="space-y-6">

      <SectionHeader
        title="Media & Tours"
        description="Add images and video tours to showcase this property"
      />

      <div>
        <label className="block text-sm font-medium text-heading mb-3">
          Property Images <span className="text-red-500">*</span>
          <span className="text-secondary font-normal ml-2">
            ({values.images.length}/{VALIDATION_RULES.images.maxCount})
          </span>
        </label>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          {values.images.map((image, index) => (
            <ImageCard
              key={image.id}
              image={image}
              index={index}
              total={values.images.length}
              onRemove={() => removeImageFromForm(image.id)}
              onMoveUp={() => index > 0 && reorderImagesInForm(index, index - 1)}
              onMoveDown={() => index < values.images.length - 1 && reorderImagesInForm(index, index + 1)}
            />
          ))}

          {canAddMore && (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="aspect-square rounded-lg border-2 border-dashed border-border hover:border-accent hover:bg-hover
              flex flex-col items-center justify-center gap-2 transition-all duration-200 cursor-pointer"
            >
              <icon.PhotoIcon className="w-8 h-8 text-secondary" />
              <span className="text-sm text-secondary">Add Image</span>
            </button>
          )}
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept={VALIDATION_RULES.images.allowedTypes.join(',')}
          multiple
          onChange={handleFileSelect}
          className="hidden"
        />

        {showImagesError && (
          <p className="text-sm text-red-500">{errors.images}</p>
        )}

        <p className="text-xs text-secondary mt-2">
          Upload up to {VALIDATION_RULES.images.maxCount} images. 
          Max {VALIDATION_RULES.images.maxSizeBytes / (1024 * 1024)}MB each. 
          Supported formats: JPEG, PNG, WebP.
          First image will be the main thumbnail.
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-heading mb-2">
          Video Tour
          <span className="text-secondary font-normal ml-1">(Optional)</span>
        </label>

        {values.tours?.video?.url ? (
          <div className="relative rounded-lg overflow-hidden bg-hover border border-border">
            <div className="aspect-video relative">
              {values.tours.video.thumbnail ? (
                <img
                  src={values.tours.video.thumbnail}
                  alt="Video thumbnail"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-card">
                  <icon.PlayIcon className="w-12 h-12 text-secondary" />
                </div>
              )}
              <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                <icon.PlayIcon className="w-16 h-16 text-white" />
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                clearVideoTour();
                setVideoUrlInput('');
              }}
              className="absolute top-2 right-2 p-1 rounded-full bg-black/50 hover:bg-black/70 text-white transition-colors"
            >
              <icon.XMarkIcon className="w-5 h-5" />
            </button>
            <div className="p-3">
              <p className="text-sm text-secondary truncate">{values.tours.video.url}</p>
            </div>
          </div>
        ) : (
          <div className="flex gap-2">
            <input
              type="url"
              value={videoUrlInput}
              onChange={(e) => setVideoUrlInput(e.target.value)}
              placeholder="https://www.youtube.com/watch?v=..."
              className={inputClass(false)}
            />
            <button
              type="button"
              onClick={handleVideoUrlSubmit}
              disabled={!videoUrlInput || !YOUTUBE_URL_REGEX.test(videoUrlInput)}
              className="px-4 py-2 rounded-lg bg-accent text-white hover:bg-accent/90 disabled:opacity-50 disabled:cursor-not-allowed
              transition-colors"
            >
              Add
            </button>
          </div>
        )}

        {showVideoError && (
          <p className="mt-1 text-sm text-red-500">{errors['tours.video']}</p>
        )}
        <p className="text-xs text-secondary mt-2">
          Only YouTube video links are supported
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-heading mb-2">
          3D Virtual Tour
          <span className="text-secondary font-normal ml-1">(Optional)</span>
        </label>

        {values.tours?.virtual3D?.url ? (
          <div className="rounded-lg bg-hover border border-border p-3 flex items-center justify-between">
            <p className="text-sm text-text truncate flex-1 mr-3">
              {values.tours.virtual3D.url}
            </p>
            <button
              type="button"
              onClick={() => {
                clearVirtual3DTour();
                setVirtual3DInput('');
              }}
              className="p-1 rounded-full hover:bg-card text-secondary hover:text-text transition-colors"
            >
              <icon.XMarkIcon className="w-5 h-5" />
            </button>
          </div>
        ) : (
          <div className="flex gap-2">
            <input
              type="url"
              value={virtual3DInput}
              onChange={(e) => setVirtual3DInput(e.target.value)}
              placeholder="https://my.matterport.com/show/?m=..."
              className={inputClass(false)}
            />
            <button
              type="button"
              onClick={handleVirtual3DSubmit}
              disabled={!virtual3DInput}
              className="px-4 py-2 rounded-lg bg-accent text-white hover:bg-accent/90 disabled:opacity-50 disabled:cursor-not-allowed
              transition-colors"
            >
              Add
            </button>
          </div>
        )}

        {showVirtual3DError && (
          <p className="mt-1 text-sm text-red-500">{errors['tours.virtual3D']}</p>
        )}
        <p className="text-xs text-secondary mt-2">
          Add a link to a 3D virtual tour (Matterport, etc.)
        </p>
      </div>
    </div>
  );
}

interface ImageCardProps {
  image: PropertyImage;
  index: number;
  total: number;
  onRemove: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
}

function ImageCard({ image, index, total, onRemove, onMoveUp, onMoveDown }: ImageCardProps) {
  return (
    <div className="relative aspect-square rounded-lg overflow-hidden bg-hover border border-border group">
      {image.url && (
        <img
          src={image.url}
          alt={`Property image ${index + 1}`}
          className="w-full h-full object-cover"
        />
      )}

      {image.isUploading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50">
          <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {image.error && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-red-500/80 p-2">
          <p className="text-white text-xs text-center">{image.error}</p>
          <button
            type="button"
            onClick={onRemove}
            className="mt-2 text-xs text-white underline"
          >
            Remove
          </button>
        </div>
      )}

      <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/50 text-white text-xs">
        {index === 0 ? 'Main' : index + 1}
      </div>

      {!image.isUploading && !image.error && (
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors">
          <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            {index > 0 && (
              <button
                type="button"
                onClick={onMoveUp}
                className="p-1 rounded bg-white/90 hover:bg-white text-gray-700 transition-colors"
                title="Move left"
              >
                <icon.ArrowUpIcon className="w-4 h-4 -rotate-90" />
              </button>
            )}
            
            {index < total - 1 && (
              <button
                type="button"
                onClick={onMoveDown}
                className="p-1 rounded bg-white/90 hover:bg-white text-gray-700 transition-colors"
                title="Move right"
              >
                <icon.ArrowDownIcon className="w-4 h-4 -rotate-90" />
              </button>
            )}

            <button
              type="button"
              onClick={onRemove}
              className="p-1 rounded bg-red-500/90 hover:bg-red-500 text-white transition-colors"
              title="Remove"
            >
              <icon.XMarkIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default MediaSection;