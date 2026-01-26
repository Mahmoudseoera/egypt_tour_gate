import localFont from "next/font/local";

export const montserrat = localFont({
  src: [
    {
      path: "./fonts/montserrat/montserrat-v31-latin-300.woff2",
      weight: "300",
      style: "normal",
    },
    {
      path: "./fonts/montserrat/montserrat-v31-latin-regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "./fonts/montserrat/montserrat-v31-latin-italic.woff2",
      weight: "400",
      style: "italic",
    },
    {
      path: "./fonts/montserrat/montserrat-v31-latin-500.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "./fonts/montserrat/montserrat-v31-latin-600.woff2",
      weight: "600",
      style: "normal",
    },
    {
      path: "./fonts/montserrat/montserrat-v31-latin-700.woff2",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-montserrat",
  display: "swap",
});
