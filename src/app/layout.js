import { ToastContainer } from "react-toastify";
import "./globals.css";
import { Providers } from "./redux/provider";
import React from "react";

export const metadata = {
  title: "Zaddy",
  description: "Developed By Pulse Promote",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <ToastContainer />
          {children}
        </Providers>
      </body>
    </html>
  );
};


