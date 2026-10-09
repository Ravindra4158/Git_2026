/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#4F46E5", // Indigo/violet for buttons, active stepper, links
          hover: "#4338CA",
          light: "#EEF2FF",
          lavender: "#F3F0FF",
          border: "#E0E7FF",
        },
        brand: {
          plum: "#491073",     // Deep plum from official logo
          magenta: "#BC197E",  // Vibrant magenta from official logo
          pink: "#ED3D87",     // Bright pink from logo gradient
          lightPlum: "#F7D9E9",// Light plum tint
          cream: "#FFF0E4",    // Soft cream tint
        },
        success: {
          DEFAULT: "#10B981",  // Emerald green for verified badges & checks
          light: "#ECFDF5",
          border: "#A7F3D0",
          text: "#047857",
        },
        warning: {
          DEFAULT: "#F97316",  // Orange for missing items & warnings
          light: "#FFF7ED",
          border: "#FFEDD5",
          text: "#C2410C",
        },
        slate: {
          subtle: "#F8FAFC",
          cardBorder: "#F1F5F9",
          muted: "#64748B",
          heading: "#1E1B4B", // Deep dark indigo for primary headings
        },
      },
      borderRadius: {
        'xl': '12px',
        '2xl': '16px',
        '3xl': '24px',
        '4xl': '32px',
      },
      boxShadow: {
        'card': '0 10px 30px -5px rgba(79, 70, 229, 0.05), 0 20px 40px -15px rgba(15, 23, 42, 0.03)',
        'card-hover': '0 15px 35px -5px rgba(79, 70, 229, 0.09), 0 25px 45px -15px rgba(15, 23, 42, 0.06)',
        'soft': '0 4px 20px -2px rgba(15, 23, 42, 0.04)',
        'modal': '0 25px 50px -12px rgba(79, 70, 229, 0.15)',
        'phone': '0 25px 60px -15px rgba(15, 23, 42, 0.25)',
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'pastel-canvas': 'linear-gradient(135deg, #FFF5EE 0%, #FAF5FF 45%, #F0F7FF 100%)',
        'brand-gradient': 'linear-gradient(135deg, #491073 0%, #BC197E 55%, #ED3D87 100%)',
        'hero-pill': 'linear-gradient(135deg, #4F46E5 0%, #6366F1 100%)',
      },
    },
  },
  plugins: [],
};
