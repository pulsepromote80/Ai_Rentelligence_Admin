'use client'
import Image from 'next/image'
import React from 'react'
import Link from 'next/link'

const NavbarLogin = () => {
  return (
    <nav className="flex items-center justify-between w-full h-20 px-4 bg-white md:px-10">
      <div className="flex items-center justify-center w-full md:justify-start">
        <Link href="../../" className="flex items-center">
          <Image
            src="/Logo.png"
            alt="RentIntelligence Logo"
            width={180}
            height={50}
            className="object-contain p-4"
            priority
          />
        </Link>
      </div>
    </nav>
  )
}

export default NavbarLogin
