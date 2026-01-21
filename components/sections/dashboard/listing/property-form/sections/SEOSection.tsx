'use client';

import { useState } from 'react';
import { usePropertyFormContext } from '../PropertyFormContext';
import { ChevronDownIcon, ChevronUpIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { getCharacterCountText } from '../functions/validation';
import { VALIDATION_RULES } from '../pattern/constants';

export function SEOSection() {
  const { values, errors, touched, setFieldValue, setFieldTouched, } = usePropertyFormContext();

  const [isExpanded, setIsExpanded] = useState(false);

  const seoTitleCharCount = getCharacterCountText(
    values.seo_title || '',
    0,
    VALIDATION_RULES.seo_title.maxLength
  );

  const seoDescriptionCharCount = getCharacterCountText(
    values.seo_description || '',
    0,
    VALIDATION_RULES.seo_description.maxLength
  );

  const showSeoTitleError = touched.seo_title && errors.seo_title;
  const showSeoDescriptionError = touched.seo_description && errors.seo_description;

  const autoFillSeoTitle = () => {
    if (values.title && !values.seo_title) {
      const seoTitle = values.title.substring(0, VALIDATION_RULES.seo_title.maxLength);
      setFieldValue('seo_title', seoTitle);
    }
  };

  const autoFillSeoDescription = () => {
    if (values.description && !values.seo_description) {
      const seoDesc = values.description.substring(0, VALIDATION_RULES.seo_description.maxLength);
      setFieldValue('seo_description', seoDesc);
    }
  };

  return (
    <div className="space-y-4">
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between border-b border-border pb-4"
      >
        <div className="flex items-center gap-3">
          <MagnifyingGlassIcon className="w-5 h-5 text-secondary" />
          <div className="text-left">
            <h3 className="text-lg font-semibold text-heading">SEO Settings</h3>
            <p className="text-sm text-secondary mt-0.5">
              Optimize how this property appears in search engines
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-secondary bg-hover px-2 py-1 rounded">
            Optional
          </span>
          {isExpanded ? (
            <ChevronUpIcon className="w-5 h-5 text-secondary" />
          ) : (
            <ChevronDownIcon className="w-5 h-5 text-secondary" />
          )}
        </div>
      </button>

      {isExpanded && (
        <div className="space-y-6 pt-2">
          <div>
            <div className="flex items-center justify-between mb-1">
              <label htmlFor="seo_title" className="block text-sm font-medium text-heading">

                SEO Title
              </label>
              {values.title && !values.seo_title && (
                <button
                  type="button"
                  onClick={autoFillSeoTitle}
                  className="text-xs text-accent hover:text-accent/80 transition-colors"
                >
                  Auto-fill from title
                </button>
              )}
            </div>
            <input
              type="text"
              id="seo_title"
              name="seo_title"
              value={values.seo_title}
              onChange={(e) => setFieldValue('seo_title', e.target.value)}
              onBlur={() => setFieldTouched('seo_title')}
              placeholder="Enter SEO title for search engines"
              maxLength={VALIDATION_RULES.seo_title.maxLength + 5}
              className={`
                mt-1 block w-full rounded-lg border px-3 py-2 bg-card text-text placeholder-secondary transition-all duration-200
                focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent
                ${showSeoTitleError
                  ? 'border-red-500 focus:ring-red-500'
                  : 'border-border hover:border-secondary'
                }
              `}
            />
            <div className="mt-1 flex justify-between items-center">
              {showSeoTitleError ? (
                <p className="text-sm text-red-500">{errors.seo_title}</p>
              ) : (
                <p className={`text-xs ${seoTitleCharCount.isError ? 'text-red-500' : seoTitleCharCount.isWarning ? 'text-amber-500' : 'text-secondary'}`}>
                  {seoTitleCharCount.text}
                </p>
              )}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label htmlFor="seo_description" className="block text-sm font-medium text-heading">
                
                SEO Description
              </label>
              {values.description && !values.seo_description && (
                <button
                  type="button"
                  onClick={autoFillSeoDescription}
                  className="text-xs text-accent hover:text-accent/80 transition-colors"
                >
                  Auto-fill from description
                </button>
              )}
            </div>
            <textarea
              id="seo_description"
              name="seo_description"
              value={values.seo_description}
              onChange={(e) => setFieldValue('seo_description', e.target.value)}
              onBlur={() => setFieldTouched('seo_description')}
              placeholder="Enter SEO description for search engines"
              rows={3}
              maxLength={VALIDATION_RULES.seo_description.maxLength + 10}
              className={`
                mt-1 block w-full rounded-lg border px-3 py-2 bg-card text-text placeholder-secondary
                transition-all duration-200 resize-none focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent
                ${showSeoDescriptionError
                  ? 'border-red-500 focus:ring-red-500'
                  : 'border-border hover:border-secondary'
                }
              `}
            />
            <div className="mt-1 flex justify-between items-center">
              {showSeoDescriptionError ? (
                <p className="text-sm text-red-500">{errors.seo_description}</p>
              ) : (
                <p className={`text-xs ${seoDescriptionCharCount.isError ? 'text-red-500' : seoDescriptionCharCount.isWarning ? 'text-amber-500' : 'text-secondary'}`}>
                  {seoDescriptionCharCount.text}
                </p>
              )}
            </div>
          </div>

          <div className="bg-hover rounded-lg p-4 border border-border">
            <p className="text-xs font-medium text-secondary uppercase tracking-wider mb-3">
              Search Engine Preview
            </p>
            <div className="space-y-1">
              <p className="text-blue-600 dark:text-blue-400 text-lg font-medium truncate">
                {values.seo_title || values.title || 'Property Title'}
              </p>
              <p className="text-green-700 dark:text-green-500 text-sm">
                ariveasy.com/properties/{values.slug || 'property-slug'}
              </p>
              <p className="text-secondary text-sm line-clamp-2">
                {values.seo_description || values.description || 'Property description will appear here...'}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default SEOSection;