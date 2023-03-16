if ('ser' in navigator) {
  console.log('testing');
  navigator.serviceWorker.register('/sw.js')
    .then(function(registration) {
      console.log('Service Worker Registered');
    })
}