// Hooks
import React, { useState } from 'react';

// Components
import Header from '../components/custom/Header';
import Navbar from '../components/custom/Navbar';
import GetTotalTimeOnTask from '../components/custom/modals/GetTotalTimeOnTask';
import { Link } from '@tanstack/react-router';


export default function TotalTimeOnTask() {
  // Get user from localstorage
  const user = localStorage.getItem('user');
  return (
    <div className=''>
      <Header />
      <div className="relative flex items-center mt-10 min-h-[900px]">
        <Navbar className=''/>
        <div className='absolute top-3 left-24'>
          <h2 className='font-monomaniac text-2xl ml-4 md:text-4xl dark:text-gray-300'>Total Time on Task</h2>
          {!user && (
            <p className='ml-4 mt-2 font-monomaniac text-sm text-gray-500'>
              Note: <Link to='/user/signup' className='hover:underline'>Sign up </Link>for the best experience
            </p>
          )}
          <p className='ml-3 mt-5 font-monomaniac text-gray-600 mx-5 max-w-[700px] md:text-2xl dark:text-gray-400'>
          You can get the total productive time you&#39;ve logged on a single task.
          </p>
        </div>
        <div className='flex justify-center absolute left-24 md:mt-0 w-[73%] ml-1 max-w-[700px]'>
          <GetTotalTimeOnTask />
        </div>
      </div>
    </div>
  )
}
