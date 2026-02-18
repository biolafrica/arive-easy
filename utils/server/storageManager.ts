import { supabaseAdmin } from "../supabase/supabaseAdmin";


export interface UploadOptions {
  bucket?: string;
  folder?: string;
  upsert?: boolean;
  contentType?: string;
}

export interface UploadResult {
  path: string;
  publicUrl: string;
  fullPath: string;
}

export class SupabaseStorageManager {
  private defaultBucket: string;

  constructor(defaultBucket: string = 'media') {
    this.defaultBucket = defaultBucket;
  }

  async uploadFile(
    file: File | Buffer,
    options: UploadOptions = {}
  ): Promise<UploadResult> {
    try {
      const {
        bucket = this.defaultBucket,
        folder = 'uploads',
        upsert = false,
        contentType
      } = options;

      // Generate unique filename
      const fileExt = file instanceof File 
        ? file.name.split('.').pop() 
        : 'bin';
      const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `${folder}/${fileName}`;

      // Upload file
      const { data, error } = await supabaseAdmin.storage
        .from(bucket)
        .upload(filePath, file, {
          upsert,
          contentType: contentType || (file instanceof File ? file.type : undefined)
        });

      if (error) {
        throw new Error(error.message);
      }

      // Get public URL
      const { data: { publicUrl } } = supabaseAdmin.storage
        .from(bucket)
        .getPublicUrl(filePath);

      return {
        path: data.path,
        publicUrl,
        fullPath: `${bucket}/${filePath}`
      };
    } catch (error: any) {
      console.error('Storage upload error:', error);
      throw {
        code: 'UPLOAD_ERROR',
        message: error.message || 'Failed to upload file',
        details: error
      };
    }
  }


  getPublicUrl(
    filePath: string,
    bucket: string = this.defaultBucket
  ): string {
    const { data } = supabaseAdmin.storage
      .from(bucket)
      .getPublicUrl(filePath);

    return data.publicUrl;
  }

}

// Export factory function
export function createStorageManager(bucket?: string) {
  return new SupabaseStorageManager(bucket);
}

// Export default instance
export const storageManager = new SupabaseStorageManager();