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

export const formatDate = (date: string) => {
  const locale = navigator.language;
  const today = new Date();
	const yesterday = new Date(today);
	yesterday.setDate(yesterday.getDate() - 1);

	const dateToFormat = new Date(date); // Replace this with your desired date

	let formattedDate;
	if (dateToFormat.toDateString() === today.toDateString()) {
		formattedDate = 'Today';
	} else if (dateToFormat.toDateString() === yesterday.toDateString()) {
		formattedDate = 'Yesterday';
	} else {
    formattedDate = dateToFormat.toLocaleDateString(locale, {
      dateStyle:'medium'
    });
  }
  
  return formattedDate;
}
