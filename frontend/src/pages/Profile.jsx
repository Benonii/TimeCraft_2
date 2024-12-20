// Hooks
import React from 'react';

// Components
import Header from '../components/custom/Header';
import Navbar from '../components/custom/Navbar';
import { Button } from '../components/shadcn/Button';

function Profile() {
  // Get user from local storage
  const user = JSON.parse(localStorage.getItem('user'));
  // console.log("Username:", user)

  return (
    <div>
      <Header />
      <div className="relative flex items-center mt-10 min-h-[900px]">
        <Navbar className=''/>
        <div className='absolute top-3 left-24'>
          <h2 className='font-monomaniac text-2xl ml-4 md:text-4xl'>User profile</h2>
          <div className='flex flex-col items-center justify-top ml-3 mt-5 bg-orange3 text-white rounded-lg h-48 md:h-64 w-[60vw] max-w-[500px]'>
            <p className='mt-2 font-monomaniac font-light text-2xl md:text-4xl'><span className='font-bold mr-1'>Username:</span> {user?.username}</p>
            <p className='font-monomaniac font-light text-2xl md:text-4xl'><span className='font-bold mr-1'>TPT:</span> {user.tpt.toFixed(2)} hours</p>
            <p className='font-monomaniac font-light text-2xl md:text-4xl'><span className='font-bold' mr-1>TWT:</span> {user.twt.toFixed(2)}</p>
            <p className='font-monomaniac font-light text-2xl md:text-4xl'><span className='font-bold'>Efficiency:</span> {Number((user.tpt)/(Number(user.tpt) + Number(user.twt)) * 100).toFixed(2)|| 0}</p>
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
