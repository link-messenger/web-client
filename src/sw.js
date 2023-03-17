import {
	cleanupOutdatedCaches,
	createHandlerBoundToURL,
	precacheAndRoute,
} from 'workbox-precaching';
import { clientsClaim } from 'workbox-core';
import { NavigationRoute, registerRoute } from 'workbox-routing';


// self.__WB_MANIFEST is default injection point
precacheAndRoute(self.__WB_MANIFEST);

console.log(self);

// clean old assets
cleanupOutdatedCaches();

// testing 2

let allowlist;
if (import.meta.env.DEV) allowlist = [/^\/$/, /^\/index.html$/];

// to allow work offline
registerRoute(
	new NavigationRoute(createHandlerBoundToURL('index.html'), { allowlist })
	);

self.skipWaiting();
clientsClaim();
