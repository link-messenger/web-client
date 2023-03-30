/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
	darkMode: 'class',
	theme: {
		extend: {
			colors: {
				primary: '#7269ef',
				'primary-light': '#40446d',
				'dark-gray': '#262626',
				'dark-light-gray': '#2e2e2e',
				'dark-lighter-gray': '#3f3f40',
				'dark-content-gray': '#333333',
				'light-border-gray': '#eaeaf1',
				'light-light-gray': '#f2f2f2',
				'light-light-back-gray': '#f3f3f3',
				'light-lighter-gray': '#f6f6f9',
			},
		},
	},
};
