import {  Inder, Inter } from "next/font/google";
import "./globals.css";
import "../../prism.css";
import { ClerkProvider } from "@clerk/nextjs";
import { AppContextProvider } from "../../context/AppContext";
import { Toaster } from "react-hot-toast";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});



export const metadata = {
  title: "DeepSeek - AI-Powered Search",
  description: "Full Stack Project",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <AppContextProvider>
    <html lang="en">
      <body
        className={`${inter.className}  antialiased`}
      >
        <Toaster  toastOptions = {
          {
            success: {style : {backgroundColor: "black", color: "white"}},
            error: {style : {backgroundColor: "black", color: "white"}}
          }
        }  />
        {children}
      </body>
    </html>
    </AppContextProvider></ClerkProvider>
  );
}
