import { useState, useEffect } from 'react';
import Header from '../components/custom/Header';
import Navbar from '../components/custom/Navbar';
import { useDarkMode } from '../context/DarkModeContext';
import { Switch } from '../components/shadcn/Switch';

export default function Settings() {
  const api = process.env.REACT_APP_API_URL;
  const { isDarkMode, toggleDarkMode } = useDarkMode();

  const user = (() => {
    try {
      const storedUser = localStorage.getItem('user');
      return storedUser ? JSON.parse(storedUser) : null;
    } catch (error) {
      console.error("Failed to parse user data from localStorage:", error);
      return null;
    }
  })();

  return (
    <div>
      <Header />
      <div className="relative flex items-center mt-10 min-h-[900px]">
        <Navbar className=''/>
        <div className='absolute top-3 left-24 font-monomaniac'>
            <h2 className='font-monomaniac text-2xl ml-4 md:text-4xl dark:text-gray-300'>Settings</h2>
            <hr className='mt-2'/>
            <div className='ml-5 mt-5'>
                <h3 className='text-gray-600 text-xl font-semibold dark:text-gray-400'>Theme</h3>
                <div className="flex justify-center gap-2 items-center">
                    <h4 className='ml-5 text-gray-600 text-lg dark:text-gray-400'>Dark mode:</h4>
                    <Switch 
                      id="dark-mode"
                      checked={isDarkMode}
                      onCheckedChange={toggleDarkMode} />
                </div>
                {user && (
                  <>
                    <h4 className='text-gray-600 text-xl font-semibold dark:text-gray-400 mt-5'>Profile</h4>
                    <p className='ml-7 hover:underline text-gray-600 text-lg dark:text-gray-400'>Change name</p>
                    <p className='ml-7 hover:underline text-gray-600 text-lg dark:text-gray-400'>Manage tasks</p>
                    <p className='ml-7 hover:underline text-red-500 text-lg'>Delete account</p>
                  </>
                )}
                
                {/* <h4 className='text-gray-600 text-xl font-semibold'>Timer</h4>
                    <p className='ml-7 text-gray-600 text-lg'>Worked Timer type: <span className='hover:underline text-black'>Timer</span></p>
                    <p className='ml-7 text-gray-600 text-lg'>Wasted Timer type: <span className='hover:underline text-black'>Stopwatch</span></p> */}
            </div>
            
        </div>
      </div>
    </div>
  )
}