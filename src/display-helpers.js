export function humanizeDataSourceString(str) {
  let i, frags = str.split('_');
  for (i=0; i<frags.length; i++) {
    frags[i] = frags[i].charAt(0).toUpperCase() + frags[i].slice(1);
  }
  return frags.join(' ');
}

export function formatDate(date) {
  if (!date) return null

  const [year, month, day] = date.split('-')
  return `${month.padStart(2, '0')}/${day.padStart(2, '0')}/${year}`
}
