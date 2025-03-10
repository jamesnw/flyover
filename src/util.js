export function getRawFileName(content, ext) {
  const currentDate = new Date(content.createdAt);
  const formattedDate = currentDate.toISOString().replace(/[:.]/g, "-"); // Formats to avoid invalid filename characters

  // Define the filename
  return `call_${formattedDate}.${ext}`;
}
