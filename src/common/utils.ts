export const stringToArray = (input: string) =>
  input
    .replace(/,\s+and\s+|\s+and\s+/g, ',')
    .split(',')
    .map((name) => name.trim());

export const toBoolean = (value: string | boolean) => {
  if (typeof value === 'boolean') return value;

  if (typeof value === 'number') return value !== 0;

  if (typeof value === 'string') {
    const normalized = value.trim().toLowerCase();
    if (['1', 'true', 'yes'].includes(normalized)) return true;
    if (['0', 'false', 'no'].includes(normalized)) return false;
  }

  return Boolean(value);
};

export const detectDelimiter = (line: string): string => {
  const possibleDelimiters = [',', ';', '\t', '|', ':'];
  const counts = possibleDelimiters.map((d) => ({
    delimiter: d,
    count: (line.match(new RegExp(`\\${d}`, 'g')) || []).length,
  }));

  const best = counts.reduce((a, b) => (a.count > b.count ? a : b));
  return best.delimiter;
};
