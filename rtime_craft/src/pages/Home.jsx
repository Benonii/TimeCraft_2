// Hoojs
import React, { useState } from 'react';

// Components
import Header from '../components/custom/Header';
import Navbar from '../components/custom/Navbar';
import { Button } from '../components/shadcn/Button';
import { Link } from '@tanstack/react-router';

export default function Home() {
  // Get user from local storage
  const user = localStorage.getItem('user');
  return (
    <div className=''>
      <Header />
      <div className="relative flex items-center mt-10 min-h-[900px]">
        <Navbar className=''/>
        <div className='absolute top-3 left-24'>
          <h2 className='font-monomaniac text-2xl ml-4 md:text-4xl dark:text-gary-200'>Welcome to Timecraft!</h2>
          <p className='ml-3 mt-5 font-monomaniac text-gray-600 mx-5 max-w-[700px] md:text-2xl dark:text-gray-400'>
            This app was made to help you keep track of your productive time. <br /><br />
            You can find out exactly how many hours you put into your tasks. <br /><br />

            You can get back daily, weekly and monthly reports of your time. This app also keeps track of things like
            “Total Productive Time”, “Total Wasted Time”, and “Total Time on Task” <br /><br />

            Did you put in the hours? let’s find out!
          </p>
        </div>
        <div className='flex justify-center absolute left-24 mt-48 md:mt-0 w-[73%] ml-1 max-w-[700px]'>
          <Link to={user ? '/new/task' : '/new/user'}>
            <Button variant='default' 
              className='bg-yellow1 px-4 py-2 rounded-md shadow-lg font-madimi text-white md:text-3xl md:px-7 md:py-6 h-fit hover:bg-yellow-300'>
              Get started
            </Button> 
          </Link>  
        </div>
      </div>
    </div>
  )
}
