import React, { useState } from 'react';
import Header from '../components/Header';
import Navbar from '../components/Navbar';
import { Button } from '../components/Button';

export default function Home() {
  return (
    <div className=''>
      <Header />
      <div className="relative flex items-center border mt-10 min-h-[900px]">
        <Navbar className=''/>
        <div className='absolute top-3 left-24'>
          <h2 className='font-monomaniac text-2xl ml-4 md:text-4xl'>Welcome to Timecraft!</h2>
          <p className='ml-3 mt-5 font-monomaniac text-gray-600 mx-5 max-w-[700px] md:text-2xl'>
            This app was made to help you keep track of your productive time. <br /><br />
            You can find out exactly how many hours you put into your tasks. <br /><br />

            You can get back daily, weekly and monthly reports of your time. This app also keeps track of things like
            “Total Productive Time”, “Total Wasted Time”, and “Total Time on Task” <br /><br />

            Did you put in the hours? let’s find out!
          </p>
        </div>
        <div className='flex justify-center absolute left-24 mt-48 md:mt-0 w-[73%] ml-1 max-w-[700px]'>
          <Button variant='default' 
            className='bg-yellow1 px-4 py-2 rounded-md shadow-lg font-monomaniac text-white md:text-3xl md:px-7 md:py-4 h-fit'>
            Get started
          </Button>
      </div>
      </div>
    </div>
  )
}
