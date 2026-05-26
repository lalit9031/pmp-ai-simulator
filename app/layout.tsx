import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import SiteNav from "./components/SiteNav";
import ToastContainer from "./components/Toast";
import { ThemeProvider } from "./lib/ThemeProvider";
import { LayoutTransition } from "./components/Animations";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ExamPro",
  description: "Timed exam simulator with AI-generated practice questions for PMP, PMI-ACP, CAPM, CSM, PSM I, and Six Sigma certifications.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        <ThemeProvider>
          <SiteNav />
          <LayoutTransition>{children}</LayoutTransition>
          <ToastContainer />
        </ThemeProvider>
      </body>
    </html>
  );
}
