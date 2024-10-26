import React, { useState } from 'react';
import Header from '../components/Header';
import Navbar from '../components/Navbar';
import { Button } from '../components/Button';

export default function NewUser() {
  return (
    <div className=''>
      <Header />
      <div className="relative flex items-center mt-10 min-h-[900px]">
        <Navbar className=''/>
        <div className='absolute top-3 left-24'>
          <h2 className='font-monomaniac text-2xl ml-4 md:text-4xl'>New Task</h2>
          <p className='ml-3 mt-5 font-monomaniac text-gray-600 mx-5 max-w-[700px] md:text-2xl'>
            You can create a new Task and the app will record time spent on that task separately. <br /><br />
            Typically, a task would be a repeating activity. (Exercise, study, code, read). <br /><br />

            You can create multiple tasks. But make sure they all have different names :)
          </p>
        </div>
        <div className='flex justify-center absolute left-24 md:mt-0 w-[73%] ml-1 max-w-[700px]'>
          {/* <Button variant='outline' 
            className=' px-4 py-2 md:py-6 rounded-md shadow-lg font-madimi border border-gray-500 text-gray-500 hover:text-black hover:border-black md:text-3xl md:px-7 h-fit'>
            Create task
          </Button> */}
          <Button variant='default' 
            className='ml-2 bg-yellow1 px-4 py-2 md:py-6 rounded-md shadow-lg font-madimi text-white md:text-3xl md:px-7 h-fit'>
            Create task
          </Button>
      </div>
      </div>
    </div>
  )
}
