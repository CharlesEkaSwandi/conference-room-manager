import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { App } from 'antd';

import "./globals.css";
import 'antd/dist/reset.css';
import Provider from "./provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Conference Room Manager",
  description: "Conference Room Manager",
};

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Provider>
          <App>
            {children}
          </App>
        </Provider>
      </body>
    </html>
  );
}

export default RootLayout;
