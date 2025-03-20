// Hooks
import React from 'react';

// Components
import { Link } from '@tanstack/react-router';
import Header from '../components/custom/Header';
import Navbar from '../components/custom/Navbar';
import CreateLog from '../components/custom/modals/CreateLog';

export default function NewLog() {

  return (
    <div className='flex flex-col items-center mt-20'>
      <Header />
      <div className="flex min-h-full">
        <div className="flex-1 flex justify-center items-start gap-5 p-6">
          <Navbar className='mt-30' />
          <div className="max-w-3xl w-full bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-8 transition-all duration-300 hover:shadow-xl">
            <h2 className='font-madimi text-2xl md:text-3xl lg:text-4xl text-center mb-6 dark:text-gray-300'>
              New Log
            </h2>
            
            <div className="border-t border-b border-gray-200 dark:border-gray-700 py-6 my-4">
              <p className='font-monomaniac text-gray-600 dark:text-gray-400 text-lg md:text-xl leading-relaxed px-6'>
                This is where the fun begins. Every time you spent time on a task, you can log it here.
                <br /><br />
                All you need is the task name (and your user Id if you are not signed in).
                <br /><br />
                You can make multiple logs in a day. If you make more than one log for one task in a day, 
                the hours will just be added up.
              </p>
            </div>
            
            <div className='flex justify-center mt-8'>
              <CreateLog />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
