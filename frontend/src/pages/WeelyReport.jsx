// Hooks
import React, { useState } from 'react';

// Components
import Header from '../components/custom/Header';
import Navbar from '../components/custom/Navbar';
import GetWeeklyReport from '../components/custom/modals/GetWeeklyReport';
import { Link } from '@tanstack/react-router';


export default function WeeklyReport() {
  // Get user from localstorage
  const user = localStorage.getItem('user');
  return (
    <div className=''>
      <Header />
      <div className="relative flex items-center mt-10 min-h-[900px]">
        <Navbar className=''/>
        <div className='absolute top-3 left-24'>
          <h2 className='font-monomaniac text-2xl ml-4 md:text-4xl dark:text-gray-300'>Weekly Report</h2>
          {!user && (
            <p className='ml-4 mt-2 font-monomaniac text-sm text-gray-500'>
              Note: <Link to='/user/signup' className='hover:underline'>Sign up </Link>for the best experience
            </p>
          )}
          <p className='ml-3 mt-5 font-monomaniac text-gray-600 mx-5 max-w-[700px] md:text-2xl dark:text-gray-400'>
            You can get a weekly report of your productive and wasted time. <br /><br />
            You can get a report for “this week”, “last week” or you could provide a custom date.<br /><br />

            Your report will be divided by task (if you have more than one), and you can look at total productive and wasted time for the week.
          </p>
        </div>
        <div className='flex justify-center absolute left-24 md:mt-0 w-[73%] ml-1 max-w-[700px]'>
          <GetWeeklyReport />
        </div>
      </div>
    </div>
  )
}
