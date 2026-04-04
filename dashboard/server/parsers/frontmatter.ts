import matter from 'gray-matter';
import fs from 'fs';

export function parseFrontmatter<T = Record<string, unknown>>(filePath: string): { data: T; content: string } | null {
  try {
    const raw = fs.readFileSync(filePath, 'utf-8');
    const { data, content } = matter(raw);
    return { data: data as T, content };
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
