import { VALIDATION_RULES, YOUTUBE_URL_REGEX } from "../pattern/constants";
import { PropertyFormErrors, PropertyFormValues } from "../pattern/types";

export function validatePropertyForm(values: PropertyFormValues): PropertyFormErrors {
  const errors: PropertyFormErrors = {};

  if (!values.title?.trim()) {
    errors.title = 'Title is required';
  } else if (values.title.length < VALIDATION_RULES.title.minLength) {
    errors.title = `Title must be at least ${VALIDATION_RULES.title.minLength} characters`;
  } else if (values.title.length > VALIDATION_RULES.title.maxLength) {
    errors.title = `Title must be no more than ${VALIDATION_RULES.title.maxLength} characters`;
  }


  if (!values.description?.trim()) {
    errors.description = 'Description is required';
  } else if (values.description.length < VALIDATION_RULES.description.minLength) {
    errors.description = `Description must be at least ${VALIDATION_RULES.description.minLength} characters`;
  } else if (values.description.length > VALIDATION_RULES.description.maxLength) {
    errors.description = `Description must be no more than ${VALIDATION_RULES.description.maxLength} characters`;
  }


  if (!values.status) {
    errors.status = 'Status is required';
  }

  if (!values.state) {
    errors.state = 'State is required';
  }

  if (!values.city) {
    errors.city = 'City is required';
  }

  if (!values.price) {
    errors.price = 'Price is required';
  } else {
    const priceNum = parseFloat(values.price);
    if (isNaN(priceNum)) {
      errors.price = 'Price must be a valid number';
    } else if (priceNum < VALIDATION_RULES.price.min) {
      errors.price = `Price must be at least $${VALIDATION_RULES.price.min.toLocaleString()}`;
    } else if (priceNum > VALIDATION_RULES.price.max) {
      errors.price = `Price must be no more than $${VALIDATION_RULES.price.max.toLocaleString()}`;
    }
  }


  if (!values.property_type) {
    errors.property_type = 'Property type is required';
  }
  if (values.bedrooms === undefined || values.bedrooms === null) {
    errors.bedrooms = 'Bedrooms is required';
  } else if (values.bedrooms < VALIDATION_RULES.bedrooms.min) {
    errors.bedrooms = `Bedrooms must be at least ${VALIDATION_RULES.bedrooms.min}`;
  } else if (values.bedrooms > VALIDATION_RULES.bedrooms.max) {
    errors.bedrooms = `Bedrooms must be no more than ${VALIDATION_RULES.bedrooms.max}`;
  }

 
  if (values.bathrooms === undefined || values.bathrooms === null) {
    errors.bathrooms = 'Bathrooms is required';
  } else if (values.bathrooms < VALIDATION_RULES.bathrooms.min) {
    errors.bathrooms = `Bathrooms must be at least ${VALIDATION_RULES.bathrooms.min}`;
  } else if (values.bathrooms > VALIDATION_RULES.bathrooms.max) {
    errors.bathrooms = `Bathrooms must be no more than ${VALIDATION_RULES.bathrooms.max}`;
  }

 
  if (values.area_sqm) {
    const areaNum = parseFloat(values.area_sqm);
    if (isNaN(areaNum)) {
      errors.area_sqm = 'Area must be a valid number';
    } else if (areaNum < VALIDATION_RULES.area_sqm.min) {
      errors.area_sqm = `Area must be at least ${VALIDATION_RULES.area_sqm.min} sqm`;
    } else if (areaNum > VALIDATION_RULES.area_sqm.max) {
      errors.area_sqm = `Area must be no more than ${VALIDATION_RULES.area_sqm.max.toLocaleString()} sqm`;
    }
  }


  if (!values.images || values.images.length === 0) {
    errors.images = 'At least one image is required';
  } else if (values.images.length > VALIDATION_RULES.images.maxCount) {
    errors.images = `Maximum ${VALIDATION_RULES.images.maxCount} images allowed`;
  } else {
    
    const hasImageErrors = values.images.some(img => img.error);
    if (hasImageErrors) {
      errors.images = 'Please fix image errors before submitting';
    }
    
   
    const hasIncompleteImages = values.images.some(img => !img.file && !img.url);
    if (hasIncompleteImages) {
      errors.images = 'All images must be uploaded';
    }
  }

  
  if (values.tours?.video?.url) {
    if (!YOUTUBE_URL_REGEX.test(values.tours.video.url)) {
      errors['tours.video'] = 'Please enter a valid YouTube URL';
    }
  }

  
  if (values.tours?.virtual3D?.url) {
    try {
      new URL(values.tours.virtual3D.url);
    } catch {
      errors['tours.virtual3D'] = 'Please enter a valid URL';
    }
  }

  
  if (values.seo_title && values.seo_title.length > VALIDATION_RULES.seo_title.maxLength) {
    errors.seo_title = `SEO title must be no more than ${VALIDATION_RULES.seo_title.maxLength} characters`;
  }


  if (values.seo_description && values.seo_description.length > VALIDATION_RULES.seo_description.maxLength) {
    errors.seo_description = `SEO description must be no more than ${VALIDATION_RULES.seo_description.maxLength} characters`;
  }

  return errors;
}

export function validateField( name: keyof PropertyFormValues, value: any, allValues?: PropertyFormValues): string | undefined {
  const tempValues = {
    ...(allValues || {}),
    [name]: value,
  } as PropertyFormValues;
  
  const errors = validatePropertyForm(tempValues);
  return errors[name];
}

export function isFormValid(errors: PropertyFormErrors): boolean {
  return Object.keys(errors).length === 0;
}

export function getCharacterCountText
( value: string, minLength: number, maxLength: number): 
{text: string; isError: boolean; isWarning: boolean} {
  const length = value?.length || 0;
  const remaining = maxLength - length;
  
  if (length < minLength) {
    return {
      text: `${length}/${minLength} minimum characters`,
      isError: false,
      isWarning: true,
    };
  }
  
  if (remaining < 0) {
    return {
      text: `${Math.abs(remaining)} characters over limit`,
      isError: true,
      isWarning: false,
    };
  }
  
  if (remaining <= 10) {
    return {
      text: `${remaining} characters remaining`,
      isError: false,
      isWarning: true,
    };
  }
  
  return {
    text: `${length}/${maxLength} characters`,
    isError: false,
    isWarning: false,
  };
}