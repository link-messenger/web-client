/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
	darkMode: 'class',
	theme: {
		extend: {
			colors: {
				'dark-blue': '#0a192f',
				'dark-gray': '#262626',
				'light-gray': '#2e2e2e',
				'lighter-gray': '#3f3f40',
				'content-gray': '#333333',
				primary: '#7269ef',
				'primary-light': '#40446d',
			},
		},
	},
};
