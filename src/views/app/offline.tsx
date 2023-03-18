import { useRegisterSW } from 'virtual:pwa-register/react';
// @ts-expect-error
import { pwaInfo } from 'virtual:pwa-info';
import { Button } from 'components';

// eslint-disable-next-line no-console
console.log(pwaInfo);

function ReloadPrompt() {
	// replaced dynamically
	const buildDate = '__DATE__';
	// replaced dyanmicaly
	const reloadSW = '__RELOAD_SW__';

	const {
		offlineReady: [offlineReady, setOfflineReady],
		needRefresh: [needRefresh, setNeedRefresh],
		updateServiceWorker,
	} = useRegisterSW({
		onRegisteredSW(swUrl, r) {
			// eslint-disable-next-line no-console
			console.log(`Service Worker at: ${swUrl}`);
			// @ts-expect-error just ignore
			if (reloadSW === 'true') {
				r &&
					setInterval(() => {
						// eslint-disable-next-line no-console
						console.log('Checking for sw update');
						r.update();
					}, 20000 /* 20s for testing purposes */);
			} else {
				// eslint-disable-next-line prefer-template,no-console
				console.log('SW Registered: ' + r);
			}
		},
		onRegisterError(error) {
			// eslint-disable-next-line no-console
			console.log('SW registration error', error);
		},
	});

	const close = () => {
		setOfflineReady(false);
		setNeedRefresh(false);
	};

	return (
		<div className="w-full h-full grid place-items-center bg-sky-50">
			{(offlineReady || needRefresh) && (
				<div className="flex flex-col justify-center items-center gap-3">
					<div className="font-medium text-center text-sky-500">
						{offlineReady ? (
							<span>App ready to work offline</span>
						) : (
							<span>
								New content available, click on reload button to update.
							</span>
						)}
					</div>
					{needRefresh && (
						<Button
							onClick={() => updateServiceWorker(true)}
						>
							Reload
						</Button>
					)}
					<Button onClick={() => close()}>
						Close
					</Button>
				</div>
			)}
		</div>
	);
}

export default ReloadPrompt;
