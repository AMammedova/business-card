// Utility function to create URL-friendly slugs
export function slugify(text: string): string {
  if (!text) return '';
  
  return text
    .toLowerCase()
    .replace(/[çç]/g, 'c')
    .replace(/[ğğ]/g, 'g') 
    .replace(/[ıı]/g, 'i')
    .replace(/[öö]/g, 'o')
    .replace(/[şş]/g, 's')
    .replace(/[üü]/g, 'u')
    .replace(/[^a-z0-9]+/g, '-') // Replace non-alphanumeric characters with dashes
    .replace(/^-+|-+$/g, '') // Remove leading/trailing dashes
    .replace(/-+/g, '-'); // Replace multiple consecutive dashes with single dash
}

// Generate full slug from company name and employee name
export function generateSlug(companyName: string, employeeName: string, employeeSurname: string): string {
  const companySlug = slugify(companyName);
  const employeeSlug = slugify(`${employeeName}-${employeeSurname}`);
  
  return `${companySlug}/${employeeSlug}`;
}

// Parse slug back to components
export function parseSlug(slug: string): { companySlug: string; employeeSlug: string } {
  const parts = slug.split('/');
  return {
    companySlug: parts[0] || '',
    employeeSlug: parts[1] || ''
  };
} 