"use client";
import React from "react";

const Footer = () => {
  return (
    <footer className="w-full p-6 flex justify-center items-center text-black bg-white shadow-lg ">
      © Copyright {new Date().getFullYear()} | All Rights Reserved
    </footer>
  );
};

export default Footer;