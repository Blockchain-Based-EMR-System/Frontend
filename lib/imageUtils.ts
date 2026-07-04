export const DEFAULT_MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024;
export const DEFAULT_MAX_IMAGE_COUNT = 5;

export const ALLOWED_IMAGE_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
] as const;

export type ImageValidationError =
  | "invalid-type"
  | "file-too-large"
  | "too-many-files";

export interface ImageValidationIssue {
  file: File;
  error: ImageValidationError;
}

export function validateImageFile(
  file: File,
  {
    maxSizeBytes = DEFAULT_MAX_IMAGE_SIZE_BYTES,
    allowedMimeTypes = ALLOWED_IMAGE_MIME_TYPES,
  }: {
    maxSizeBytes?: number;
    allowedMimeTypes?: readonly string[];
  } = {},
): ImageValidationError | null {
  if (!allowedMimeTypes.includes(file.type)) {
    return "invalid-type";
  }

  if (file.size > maxSizeBytes) {
    return "file-too-large";
  }

  return null;
}

export function validateImageBatch(
  files: File[],
  {
    currentCount = 0,
    maxCount = DEFAULT_MAX_IMAGE_COUNT,
    maxSizeBytes = DEFAULT_MAX_IMAGE_SIZE_BYTES,
    allowedMimeTypes = ALLOWED_IMAGE_MIME_TYPES,
  }: {
    currentCount?: number;
    maxCount?: number;
    maxSizeBytes?: number;
    allowedMimeTypes?: readonly string[];
  } = {},
): { acceptedFiles: File[]; issues: ImageValidationIssue[] } {
  const acceptedFiles: File[] = [];
  const issues: ImageValidationIssue[] = [];

  files.forEach((file) => {
    if (currentCount + acceptedFiles.length >= maxCount) {
      issues.push({ file, error: "too-many-files" });
      return;
    }

    const error = validateImageFile(file, {
      maxSizeBytes,
      allowedMimeTypes,
    });

    if (error) {
      issues.push({ file, error });
      return;
    }

    acceptedFiles.push(file);
  });

  return { acceptedFiles, issues };
}

export function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      const result = reader.result;
      if (typeof result !== "string") {
        reject(new Error("Failed to read file as data URL"));
        return;
      }
      resolve(result);
    };

    reader.onerror = () => {
      reject(new Error("Failed to read file as data URL"));
    };

    reader.readAsDataURL(file);
  });
}
