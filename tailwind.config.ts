import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./data/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "../../packages/ui/src/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Roboto', 'system-ui', 'sans-serif'],
      },

      colors: {
        heading: 'var(--heading-text)',
        text: 'var(--text)',
        secondary: 'var(--secondary-text)',
        disabled: 'var(--disabled-text)',

        border: 'var(--default-border)',
        separator: 'var(--separator)',

        layout: 'var(--layout-bg)',
        background: 'var(--background)',
        card: 'var(--card-bg)',
        hover: 'var(--hover-bg)',
        active: 'var(--active-bg)',
        muted: '#f3f4f6',

        btn: {
          primary: {
            DEFAULT: 'var(--btn-primary-bg)',
            hover: 'var(--btn-primary-hover)',
            active: 'var(--btn-primary-active)',
            text: 'var(--btn-primary-text)',
          },
          secondary: {
            DEFAULT: 'var(--btn-secondary-bg)',
            hover: 'var(--btn-secondary-hover)',
            active: 'var(--btn-secondary-active)',
            text: 'var(--btn-secondary-text)',
          },
        },

        status: {
          blue: 'var(--status-blue)',
          green: 'var(--status-green)',
          yellow: 'var(--status-yellow)',
          red: 'var(--status-red)',
        },
      },

      boxShadow: {
        sm: 'var(--shadow-sm)',
        md: 'var(--shadow-md)',
        lg: 'var(--shadow-lg)',
      },
    },
  },
  plugins: [],
};

export default config;
