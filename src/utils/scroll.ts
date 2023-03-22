import { MutableRefObject } from 'react';

export const scrollToBottom = (
	ref: MutableRefObject<HTMLElement | null>
) => {
	if (ref.current) {
		ref.current.scrollTo({
			top: 0,
			behavior: 'smooth',
		});
	}
};
