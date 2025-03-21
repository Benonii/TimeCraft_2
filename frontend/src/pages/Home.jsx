// Hooks
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
        <div className="flex-1 flex justify-center items-start p-4 sm:p-6">
          <div className="relative max-w-3xl w-full bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 sm:p-8 transition-all duration-300 hover:shadow-xl">
            <div className="flex">
              {/* Navbar section */}
              <div className="">
                <Navbar />
              </div>
              
              {/* Content section */}
              <div className="flex-1">
                <h2 className='font-monomaniac text-2xl sm:text-3xl md:text-4xl text-center mb-4 sm:mb-6 dark:text-gray-200'>
                  Welcome to Timecraft!
                </h2>
                
                <div className="border-t border-b border-gray-200 dark:border-gray-700 py-4 sm:py-6 my-4">
                  <p className='font-monomaniac text-gray-600 dark:text-gray-400 text-base sm:text-lg md:text-xl leading-relaxed px-2 sm:px-8'>
                    This tool was made to help you keep track of your productive time.
                    <br /><br />
                    You can find out exactly how many hours you put into your activities.
                    <br /><br />
                    And... How much time you are wasting.
                    <br /><br />
                    You can get back daily, weekly and monthly reports of your time. Timecraft also keeps track of things like
                    "Total Productive Time", "Total Wasted Time", and "Total Time on Task"
                    <br /><br />
                    Did you put in the hours? Let's find out!
                  </p>
                </div>
                
                <div className='flex justify-center mt-6 sm:mt-8'>
                  <Link to={user ? '/new/activity' : '/user/login'}>
                    <Button variant='default' 
                      className='bg-yellow1 px-4 sm:px-6 py-2 sm:py-3 rounded-md shadow-lg font-madimi 
                        text-white text-lg sm:text-xl md:text-2xl h-fit hover:bg-yellow-500 transition-colors duration-300'
                    >
                      Get started
                    </Button> 
                  </Link>  
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
