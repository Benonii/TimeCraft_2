// Hooks
import React from 'react';

// Components
import Header from '../components/custom/Header';
import Navbar from '../components/custom/Navbar';
import GetTotalTimeOnTask from '../components/custom/modals/GetTotalTimeOnTask';


export default function TotalTimeOnTask() {
  return (
    <div className='flex flex-col items-center mt-20'>
      <Header />
      <div className="flex min-h-full">
        <div className="flex-1 flex justify-center items-start gap-5 p-6">
          <Navbar className='mt-30' />
          <div className="max-w-3xl w-full bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-8 transition-all duration-300 hover:shadow-xl">
            <h2 className='font-madimi text-2xl md:text-3xl lg:text-4xl text-center mb-6 dark:text-gray-300'>
              Total Time on Task
            </h2>
            
            <div className="border-t border-b border-gray-200 dark:border-gray-700 py-6 my-4">
              <p className='font-monomaniac text-gray-600 dark:text-gray-400 text-lg md:text-xl leading-relaxed px-6'>
                You can get the total productive time you&#39;ve logged on a single task.
              </p>
            </div>
            
            <div className='flex justify-center mt-24'>
              <GetTotalTimeOnTask />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
