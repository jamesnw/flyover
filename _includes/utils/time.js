export const formatSeconds = (seconds) => {
  const date = new Date(seconds * 1000);
  const mm = String(date.getMinutes()).padStart(2, '0');
  const ss = String(date.getSeconds()).padStart(2, '0');
  const mmm = String(date.getMilliseconds()).padStart(3, '0');
  return `${mm}:${ss}.${mmm}`;
}