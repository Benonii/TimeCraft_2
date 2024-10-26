import React, { useState } from 'react';
import Header from '../components/Header';
import Navbar from '../components/Navbar';
import { Button } from '../components/Button';

export default function DailyReport() {
  return (
    <div className=''>
      <Header />
      <div className="relative flex items-center mt-10 min-h-[900px]">
        <Navbar className=''/>
        <div className='absolute top-3 left-24'>
          <h2 className='font-monomaniac text-2xl ml-4 md:text-4xl'>Daily Report</h2>
          <p className='ml-3 mt-5 font-monomaniac text-gray-600 mx-5 max-w-[700px] md:text-2xl'>
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
          <Button variant='default' 
            className='ml-2 bg-yellow1 px-4 py-2 md:py-6 rounded-md shadow-lg font-madimi text-white md:text-3xl md:px-7 h-fit'>
            Get report
          </Button>
      </div>
      </div>
    </div>
  )
}
