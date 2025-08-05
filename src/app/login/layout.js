"use client";

import React from "react";
import NavbarLogin from "./navbar/page";
import Footer from "./footer/page";

const layout = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen overflow-y-scroll" style={{ backgroundColor: "rgb(243, 244, 246)" }}>
      <NavbarLogin />
      <div className="flex justify-center flex-grow">
        {children}
      </div>
      <Footer />
    </div>
  );
};

export default layout;




