/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		extend: {
			colors: {
				primary: {
					light: '#2196f3',
					DEFAULT: '#1e88e5',
					dark: '#1976d2'
				},
				secondary: {
					light: '#f44336',
					DEFAULT: '#e53935',
					dark: '#d32f2f'
				}
			}
		}
	},
	plugins: []
};
