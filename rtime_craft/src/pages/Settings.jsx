import React from 'react';
import Header from '../components/custom/Header';
import Navbar from '../components/custom/Navbar';
import { Button } from '../components/shadcn/Button';
import { Switch } from '../components/shadcn/Switch';

export default function Settings() {
  return (
    <div>
      <Header />
      <div className="relative flex items-center mt-10 min-h-[900px]">
        <Navbar className=''/>
        <div className='absolute top-3 left-24 font-monomaniac'>
            <h2 className='font-monomaniac text-2xl ml-4 md:text-4xl'>Settings</h2>
            <hr />
            <div className='ml-5 mt-5'>
                <h3 className='text-gray-600 text-xl font-semibold'>Theme</h3>
                <div className="flex">
                    <h4 className='ml-7 text-gray-600 text-lg'>Dark mode:</h4>
                    <p className='ml-1 mt-1'>OFF</p>
                </div>
                    
                    {/* <Switch id="dark-mode" /> */}
                <h4 className='text-gray-600 text-xl font-semibold'>Profile</h4>
                    <p className='ml-7 hover:underline text-gray-600 text-lg'>Change name</p>
                    <p className='ml-7 hover:underline text-gray-600 text-lg'>Manage tasks</p>
                    <p className='ml-7 hover:underline text-red-500 text-lg'>Delete account</p>
                <h4 className='text-gray-600 text-xl font-semibold'>Timer</h4>
                    <p className='ml-7 text-gray-600 text-lg'>Worked Timer type: <span className='hover:underline text-black'>Timer</span></p>
                    <p className='ml-7 text-gray-600 text-lg'>Wasted Timer type: <span className='hover:underline text-black'>Stopwatch</span></p>
            </div>
            
        </div>
      </div>
    </div>
  )
}