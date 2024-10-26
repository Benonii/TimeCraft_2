import React from 'react';
import logo from "../images/logo.png";

export default function Header() {
  return (
    <div className='flex items-center ml-5 mt-5'>
      <img src={logo} alt="Logo" className='w-20' />
      <h1 className='text-5xl ml-2 font-jacquard text-orange1'>TimeCraft</h1>
    </div>
  )
}
