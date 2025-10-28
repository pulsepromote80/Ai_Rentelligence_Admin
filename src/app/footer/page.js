"use client";
import React from "react";

const Footer = () => {
  return (
    <footer className="w-full py-4 h-10 text-center text-black bg-white shadow-lg">
      © Copyright {new Date().getFullYear()} | All Rights Reserved
    </footer>
  );
};

export default Footer;