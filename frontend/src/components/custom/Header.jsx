import React from 'react';
import logo from "../../images/logo.png";


export default function Header() {
  return (
    <div className='flex items-center justify-center w-full px-4 py-2 md:py-4 lg:py-6'>
      <div className='flex items-center gap-2 md:gap-3'>
        <img 
          src={logo} 
          alt="Logo" 
          className='w-12 h-12 md:w-16 md:h-16 lg:w-20 lg:h-20 object-contain' 
        />
        <h1 className='text-3xl md:text-4xl lg:text-5xl font-jacquard text-orange1 dark:text-yellow1'>
          TimeCraft
        </h1>
      </div>
    </div>
  )
}
