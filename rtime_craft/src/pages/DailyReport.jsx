import React, { useState } from 'react';
import Header from '../components/custom/Header';
import Navbar from '../components/custom/Navbar';
import GetDailyReport from '../components/custom/modals/GetDailyReport';
import { Link } from '@tanstack/react-router';

export default function DailyReport() {
  const user = localStorage.getItem('user');
  return (
    <div className=''>
      <Header />
      <div className="relative flex items-center mt-10 min-h-[900px]">
        <Navbar className=''/>
        <div className='absolute top-3 left-24'>
          <h2 className='font-monomaniac text-2xl ml-4 md:text-4xl dark:text-gray-200'>Daily Report</h2>
          {!user && (
            <p className='ml-4 mt-2 font-monomaniac text-sm text-gray-500'>
              Note: <Link to='/user/signup' className='hover:underline'>Sign up </Link>for the best experience
            </p>
          )}
          <p className='ml-3 mt-5 font-monomaniac text-gray-600 mx-5 max-w-[700px] md:text-2xl dark:text-gray-400'>
            If you want to find out how you spent your hours in a day, you can get a daily report. <br /><br />
            All you need to do is pick the date(and your user Id if you are not signed in). <br /><br />

            You’ll report will be divided by task(if you have more than one), and you can look at total productive and wasted time for the day.
          </p>
        </div>
        <div className='flex justify-center absolute left-24 md:mt-0 w-[73%] ml-1 max-w-[700px]'>
          {/* <Button variant='outline' 
            className=' px-4 py-2 md:py-6 rounded-md shadow-lg font-madimi border border-gray-500 text-gray-500 hover:text-black hover:border-black md:text-3xl md:px-7 h-fit'>
            Create task
          </Button> */}
          <GetDailyReport />
      </div>
      </div>
    </div>
  )
}
