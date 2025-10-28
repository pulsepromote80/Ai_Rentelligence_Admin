
import NavbarLogin from "./navbar/page";
import Footer from "./footer/page";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./globals.css";
import { Providers } from "./redux/provider";
import React from "react";

export const metadata = {
  title: "RentIntelligence",
  description: "Developed By Pulse Promote",
};

  const RootLayout = ({ children}) => {
  return (
     <html lang="en">
      <body>
    <div className="flex flex-col overflow-y-scroll" style={{ backgroundColor: "rgb(243, 244, 246)" }}>
      <Providers>
        <ToastContainer />
      <NavbarLogin />
      <div className="flex justify-center flex-grow">
        {children}
      </div>
      <Footer />
      </Providers>
    </div>
    </body>
    </html>
  );
};

export default RootLayout







