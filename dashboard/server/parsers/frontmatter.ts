import matter from 'gray-matter';
import fs from 'fs';

// YAML interprets "Key: value" in arrays as objects instead of strings.
// This is common in Orbit notes (e.g. decisions like "Principio RAD: validar...").
// Sanitize by converting any object items back to "Key: value" strings.
function sanitizeArrays(data: Record<string, unknown>): Record<string, unknown> {
  for (const key of Object.keys(data)) {
    if (Array.isArray(data[key])) {
      data[key] = (data[key] as unknown[]).map(item => {
        if (item !== null && typeof item === 'object' && !Array.isArray(item)) {
          return Object.entries(item as Record<string, unknown>)
            .map(([k, v]) => `${k}: ${v}`)
            .join(', ');
        }
        return item;
      });
    }
  }
  return data;
}

export function parseFrontmatter<T = Record<string, unknown>>(filePath: string): { data: T; content: string } | null {
  try {
    const raw = fs.readFileSync(filePath, 'utf-8');
    const { data, content } = matter(raw);
    return { data: sanitizeArrays(data) as T, content };
  } catch {
    return null;
  }
}

export function parseAllInDir<T = Record<string, unknown>>(
  dirPath: string,
  ext = '.md'
): Array<{ slug: string; data: T; content: string }> {
  try {
    const files = fs.readdirSync(dirPath).filter(f => f.endsWith(ext)).sort().reverse();
    const results: Array<{ slug: string; data: T; content: string }> = [];
    for (const file of files) {
      const parsed = parseFrontmatter<T>(`${dirPath}/${file}`);
      if (parsed) {
        results.push({ slug: file.replace(ext, ''), ...parsed });
      }
    }
    return results;
  } catch {
    return [];
  }
}
