export function formatTimeAgo(timestamp: number, referenceTime: number): string {
  const elapsedSeconds = Math.max(0, Math.floor((referenceTime - timestamp) / 1000));

  if (elapsedSeconds < 60) {
    return `${elapsedSeconds} ${elapsedSeconds === 1 ? 'second' : 'seconds'} ago`;
  }

  const elapsedMinutes = Math.floor(elapsedSeconds / 60);

  if (elapsedMinutes < 60) {
    return `${elapsedMinutes} ${elapsedMinutes === 1 ? 'minute' : 'minutes'} ago`;
  }

  const elapsedHours = Math.floor(elapsedMinutes / 60);

  return `${elapsedHours} ${elapsedHours === 1 ? 'hour' : 'hours'} ago`;
}
