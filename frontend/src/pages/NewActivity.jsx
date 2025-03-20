// Hooks
import React from 'react';

// Components
import Header from '../components/custom/Header';
import Navbar from '../components/custom/Navbar';
import CreateActivity from '../components/custom/modals/CreateActivity'

export default function NewActivity() {
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
                  New Activity
                </h2>
                
                <div className="border-t border-b border-gray-200 dark:border-gray-700 py-4 sm:py-6 my-4">
                  <p className='font-monomaniac text-gray-600 dark:text-gray-400 text-base sm:text-lg md:text-xl leading-relaxed px-2 sm:px-8'>
                    You can create a new Activity and the app will record time spent on that activity separately.
                    <br /><br />
                    Typically, an activity would be something you plan to do repeatedly. (Exercise, study, code, read).
                    <br /><br />
                    You can create multiple activities. But make sure they all have different names :)
                  </p>
                </div>
                
                <div className='flex justify-center mt-6 sm:mt-8'>
                  <CreateActivity />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
