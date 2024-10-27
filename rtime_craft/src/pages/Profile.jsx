import React from 'react';
import Header from '../components/Header';
import Navbar from '../components/Navbar';
import { Button } from '../components/Button';

function Profile() {
  return (
    <div>
      <Header />
      <div className="relative flex items-center mt-10 min-h-[900px]">
        <Navbar className=''/>
        <div className='absolute top-3 left-24'>
          <h2 className='font-monomaniac text-2xl ml-4 md:text-4xl'>User profile</h2>
          <div className='flex flex-col items-center justify-top ml-3 mt-5 bg-orange3 text-white rounded-lg h-48 md:h-64 w-[60vw] max-w-[500px]'>
            <p className='mt-2 font-monomaniac font-light text-2xl md:text-4xl'><span className='font-bold'>Name:</span> John Doe</p>
            <p className='font-monomaniac font-light text-2xl md:text-4xl'><span className='font-bold'>TPT:</span> 100 hours</p>
            <p className='font-monomaniac font-light text-2xl md:text-4xl'><span className='font-bold'>TWT:</span> 47 hours</p>
            <p className='font-monomaniac font-light text-2xl md:text-4xl'><span className='font-bold'>Efficiency:</span> 63%</p>
          </div>
          <div className='grid grid-cols-1 md:grid-cols-2 place-items-center absolute md:mt-0 w-[62vw] max-w-[500px] ml-1'>
            <Button variant='default' 
              className='mt-2 bg-yellow1 px-4 py-2 md:py-6 rounded-md shadow-lg font-madimi text-white md:text-2xl md:px-10 h-fit max-w-48'>
              Share
            </Button>
            <Button variant='outline' 
              className='mt-2 px-4 py-2 md:py-6 rounded-md shadow-lg font-madimi border border-red-500 text-red-500 hover:text-white hover:bg-red-500 md:text-2xl md:px-10 h-fit'>
              Reset
            </Button>
          </div>

        </div>
    </div>
    </div>
  )
}

export default Profile
