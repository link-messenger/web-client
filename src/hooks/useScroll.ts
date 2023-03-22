import {
	MutableRefObject,
	useCallback,
	useEffect,
	useRef,
	useState,
} from 'react';
export const useChatScroll = <T>(
	dep: T
): MutableRefObject<HTMLElement | null> => {
	const ref = useRef<HTMLElement>(null);
	useEffect(() => {
		if (!ref.current) return;
		const isScrolling = ref.current.scrollTop < -500;

		if (!isScrolling) {
			ref.current.scrollTo({
				top: 0,
				behavior: 'smooth',
			});
		}
	}, [dep]);
	return ref;
};

export const useScrollObserver = (
	observer: MutableRefObject<IntersectionObserver | undefined>,
	func: Function,
	isChatLoading: boolean,
	has: boolean
) => {
	const lastMessageElementRef = useCallback(
		(node: HTMLElement) => {
			if (isChatLoading) return;
			if (observer.current) observer.current.disconnect();
			observer.current = new IntersectionObserver((entries) => {
				if (entries[0].isIntersecting && has) {
					func();
				}
			});
			if (node) observer.current.observe(node);
		},
		[isChatLoading, has]
	);
	return lastMessageElementRef;
};
