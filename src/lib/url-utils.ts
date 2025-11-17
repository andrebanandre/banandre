/**
 * Client-safe URL formatting utilities
 * These functions don't use Node.js APIs and can be imported in Client Components
 */

// Format tag for URL (lowercase, no special chars)
export function formatTagForUrl(tag: string): string {
  return tag.toLowerCase().replace(/[^a-z0-9]/g, "");
}

// Format category for URL (lowercase, spaces to dashes, no special chars)
export function formatCategoryForUrl(category: string): string {
  return category
    .toLowerCase()
    .replace(/\s+/g, "-") // Replace spaces with dashes
    .replace(/[^a-z0-9-]/g, ""); // Remove all non-alphanumeric except dashes
}

// Parse category from URL back to display format
export function parseCategoryFromUrl(urlCategory: string): string {
  // Convert dashes back to spaces and capitalize first letter of each word
  return urlCategory
    .replace(/-/g, " ") // Convert dashes back to spaces
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}
