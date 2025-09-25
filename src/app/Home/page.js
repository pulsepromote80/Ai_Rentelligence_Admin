"use client"

import React from "react"
import Link from "next/link"
import { FaRobot } from "react-icons/fa"

export default function Home() {
  return (
    <div className="flex items-center justify-center p-6 bg-gradient-to-b from-indigo-50 to-purple-50">

      {/* Card with hover animation */}
      <div className="flex flex-col items-center w-full max-w-3xl gap-6 p-8 text-center transition-all duration-500 transform bg-white shadow-2xl rounded-3xl hover:scale-105 hover:shadow-3xl animate-fadeIn ">
        
        {/* Robot Icon with bounce animation */}
        <div className="mb-4 text-6xl text-indigo-500 animate-bounce">
          <FaRobot />
        </div>

        {/* Heading with gradient text */}
        <h1 className="mb-2 text-3xl font-extrabold text-transparent md:text-3xl bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-500 to-pink-500 animate-textFade">
          The Marketplace of Intelligent Agents
        </h1>

        {/* Subheading */}
        <p className="mb-1 text-sm text-gray-700 md:text-base animate-fadeInDelay">
          Rentelligence is the world’s first decentralized AI/ML marketplace where intelligent
          agents can be purchased, leased, or rented — unlocking limitless possibilities across
          industries, metaverse, and Web3 ecosystems.
        </p>

        {/* Bottom Text */}
        <p className="text-xs font-semibold text-indigo-600 md:text-sm animate-fadeInDelay">
          Empowering the Future with AI Agents — Rent, Lease, Own, and Evolve
        </p>
         <Link href="/login">
        <button className="p-3 text-white bg-purple-500 rounded-md">Login Now</button></Link>
      </div>
      

      {/* Extra CSS Animations */}
      <style jsx>{`
        @keyframes fadeIn {
          0% { opacity: 0; transform: translateY(10px); }
          100% { opacity: 1; transform: translateY(0); }
        }

        @keyframes fadeInDelay {
          0% { opacity: 0; transform: translateY(10px); }
          100% { opacity: 1; transform: translateY(0); }
        }

        @keyframes textFade {
          0% { background-position: 0% 50%; }
          100% { background-position: 100% 50%; }
        }

        .animate-fadeIn { animation: fadeIn 0.8s ease forwards; }
        .animate-fadeInDelay { animation: fadeIn 1.2s ease forwards; }
        .animate-textFade { animation: textFade 3s ease infinite alternate; background-size: 200% auto; }
      `}</style>
    </div>
  )
}
