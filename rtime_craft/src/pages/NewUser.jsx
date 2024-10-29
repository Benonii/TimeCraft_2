import React, { useState } from 'react';
import { Link } from '@tanstack/react-router';
import Header from '../components/custom/Header';
import Navbar from '../components/custom/Navbar';
import { Button } from '../components/shadcn/Button';
import CreateUser from '../components/custom/popups/CreateUser';

export default function NewUser() {
  const user =localStorage.getItem('user');
  return (
    <div className=''>
      <Header />
      <div className="relative flex items-center mt-10 min-h-[900px]">
        <Navbar className=''/>
        <div className='absolute top-3 left-24'>
          <h2 className='font-monomaniac text-2xl ml-4 md:text-4xl'>New User</h2>
          {user && (
            <p className='ml-4 mt-2 font-monomaniac text-sm text-gray-500'>
              Note: Don't create a user if you already have an account
            </p>
          )}
          <p className='ml-3 mt-5 font-monomaniac text-gray-600 mx-5 max-w-[700px] md:text-2xl'>
            You can create a new user with just your name and your weekly targets. <br /><br />
            You will be provided with an Id. Use it to create tasks, make logs and get reports. <br /><br />

            Alternatively, you can sign up for a better experience(recommended).
          </p>
        </div>
        <div className='flex justify-center absolute left-24 md:mt-0 w-[73%] ml-1 max-w-[700px]'>
          <CreateUser />
          <Link to ='/user/signup'>
            <Button variant='default' 
              className='ml-2 bg-yellow1 px-4 py-4 md:py-6 rounded-md text-lg shadow-lg font-madimi text-white md:text-4xl md:px-7 h-fit hover:bg-yellow-400'
            >
              Sign up
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
