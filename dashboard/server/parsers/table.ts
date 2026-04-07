export interface TableRow {
  [key: string]: string;
}

export function parseMarkdownTable(content: string): TableRow[] {
  const lines = content.split('\n').filter(l => l.trim().startsWith('|'));
  if (lines.length < 2) return [];

  const parseRow = (line: string): string[] =>
    line.split('|').slice(1, -1).map(cell => cell.trim());

  const headers = parseRow(lines[0]).map(h => h.toLowerCase().replace(/\s+/g, '_'));

  // Skip separator row (contains ---)
  const dataLines = lines.slice(1).filter(l => !l.includes('---'));

  return dataLines.map(line => {
    const cells = parseRow(line);
    const row: TableRow = {};
    headers.forEach((h, i) => {
      row[h] = cells[i] || '';
    });
    return row;
  }).filter(row => Object.values(row).some(v => v.length > 0));
}

export function writeMarkdownTable(title: string, headers: string[], rows: TableRow[]): string {
  const keys = headers.map(h => h.toLowerCase().replace(/\s+/g, '_'));
  const headerLine = '| ' + headers.join(' | ') + ' |';
  const separator = '| ' + headers.map(() => '------').join(' | ') + ' |';
  const dataLines = rows.map(row =>
    '| ' + keys.map(k => row[k] || '—').join(' | ') + ' |'
  );
  return [title, '', headerLine, separator, ...dataLines, ''].join('\n');
}
