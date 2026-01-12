/**
 * Draft storage utility for auto-saving form data to local storage.
 * Handles serialization/deserialization with expiration support.
 */

const DRAFT_PREFIX = 'cms_draft_';
const DEFAULT_EXPIRATION_MS = 24 * 60 * 60 * 1000; // 24 hours

/**
 * Interface for stored draft data
 */
export interface DraftData<T> {
  formId: string;
  data: T;
  savedAt: number;
  expiresAt: number;
}

/**
 * Generates a storage key for a draft.
 * 
 * @param contentType - The type of content (e.g., 'project', 'service')
 * @param id - The ID of the content, or 'new' for new items
 * @returns The storage key
 */
export function getDraftKey(contentType: string, id?: string): string {
  return `${DRAFT_PREFIX}${contentType}_${id || 'new'}`;
}

/**
 * Saves draft data to local storage with expiration.
 * 
 * @param contentType - The type of content
 * @param data - The form data to save
 * @param id - Optional ID for existing content
 * @param expirationMs - Optional custom expiration time in milliseconds
 * @returns true if save was successful, false otherwise
 */
export function saveDraft<T>(
  contentType: string,
  data: T,
  id?: string,
  expirationMs: number = DEFAULT_EXPIRATION_MS
): boolean {
  try {
    const key = getDraftKey(contentType, id);
    const now = Date.now();
    
    const draftData: DraftData<T> = {
      formId: key,
      data,
      savedAt: now,
      expiresAt: now + expirationMs,
    };
    
    localStorage.setItem(key, JSON.stringify(draftData));
    return true;
  } catch {
    // localStorage might be full or disabled
    return false;
  }
}

/**
 * Loads draft data from local storage.
 * Returns null if no draft exists, draft is expired, or data is invalid.
 * 
 * @param contentType - The type of content
 * @param id - Optional ID for existing content
 * @returns The draft data or null
 */
export function loadDraft<T>(contentType: string, id?: string): DraftData<T> | null {
  try {
    const key = getDraftKey(contentType, id);
    const stored = localStorage.getItem(key);
    
    if (!stored) {
      return null;
    }
    
    const draftData: DraftData<T> = JSON.parse(stored);
    
    // Check if draft has expired
    if (Date.now() > draftData.expiresAt) {
      clearDraft(contentType, id);
      return null;
    }
    
    return draftData;
  } catch {
    // Invalid JSON or other error
    return null;
  }
}

/**
 * Clears a draft from local storage.
 * 
 * @param contentType - The type of content
 * @param id - Optional ID for existing content
 * @returns true if clear was successful, false otherwise
 */
export function clearDraft(contentType: string, id?: string): boolean {
  try {
    const key = getDraftKey(contentType, id);
    localStorage.removeItem(key);
    return true;
  } catch {
    return false;
  }
}

/**
 * Checks if a draft exists and is not expired.
 * 
 * @param contentType - The type of content
 * @param id - Optional ID for existing content
 * @returns true if a valid draft exists
 */
export function hasDraft(contentType: string, id?: string): boolean {
  return loadDraft(contentType, id) !== null;
}

/**
 * Gets the saved timestamp of a draft.
 * 
 * @param contentType - The type of content
 * @param id - Optional ID for existing content
 * @returns Date object of when draft was saved, or null if no draft
 */
export function getDraftSavedAt(contentType: string, id?: string): Date | null {
  const draft = loadDraft(contentType, id);
  return draft ? new Date(draft.savedAt) : null;
}
