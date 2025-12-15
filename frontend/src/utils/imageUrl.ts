/**
 * Converts relative or legacy localhost image URLs to production URLs
 * @param url - The image URL (can be relative, absolute, or localhost)
 * @returns The correctly formatted image URL for the current environment
 */
export const getImageUrl = (url?: string): string | undefined => {
    if (!url) return undefined;

    // Fix for legacy localhost URLs
    if (url.includes('localhost:3001')) {
        const relativePath = url.split('localhost:3001')[1];
        return `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}${relativePath}`;
    }

    // Handle relative paths
    if (url.startsWith('/')) {
        return `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}${url}`;
    }

    return url;
};
