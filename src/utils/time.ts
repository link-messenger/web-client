export const formatDateTime = (time: string) => {
  const locale = navigator.language;
  return new Date(time).toLocaleString(locale, {
    minute: 'numeric',
    hour: '2-digit',
    hour12: false,
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  })
}

export const formatTime = (time: string) => {
  const locale = navigator.language;
	return new Date(time).toLocaleString(locale, {
		minute: 'numeric',
		hour: '2-digit',
		hour12: true,
	});
}