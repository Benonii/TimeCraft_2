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
    <div className='flex flex-col items-center mt-20'>
      <Header />
      <div className="flex min-h-full">
        <div className="flex-1 flex justify-center items-start gap-5 p-6">
          <Navbar className='mt-30' />
          <div className="max-w-3xl w-full bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-8 transition-all duration-300 hover:shadow-xl">
            <h2 className='font-monomaniac text-3xl md:text-4xl text-center mb-6 dark:text-gray-200'>
              Welcome to Timecraft!
            </h2>
            
            <div className=" ml-10 border-t border-b border-gray-200 dark:border-gray-700 py-6 my-4">
              <p className='font-monomaniac text-gray-600 dark:text-gray-400 text-lg md:text-xl leading-relaxed'>
                This app was made to help you keep track of your productive time.
                <br /><br />
                You can find out exactly how many hours you put into your tasks.
                <br /><br />
                You can get back daily, weekly and monthly reports of your time. This app also keeps track of things like
                "Total Productive Time", "Total Wasted Time", and "Total Time on Task"
                <br /><br />
                Did you put in the hours? Let's find out!
              </p>
            </div>
            
            <div className='flex justify-center mt-8'>
              <Link to={user ? '/new/activity' : '/new/user'}>
                <Button variant='default' 
                  className='bg-yellow1 px-8 py-4 rounded-md shadow-lg font-madimi text-white text-2xl md:text-3xl h-fit hover:bg-yellow-500 transition-colors duration-300'>
                  Get started
                </Button> 
              </Link>  
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
