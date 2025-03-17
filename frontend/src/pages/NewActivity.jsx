// Hooks
import React from 'react';

// Components
import Header from '../components/custom/Header';
import Navbar from '../components/custom/Navbar';
import { Link } from '@tanstack/react-router';
import CreateActivity from '../components/custom/modals/CreateActivity'

export default function NewActivity() {
  // Get user from local storage
  const user = localStorage.getItem('user');

  return (
    <div className='flex flex-col items-center mt-20'>
      <Header />
      <div className="flex min-h-full">
        <div className="flex-1 flex justify-center items-start gap-5 p-6">
          <Navbar className='mt-30' />
          <div className="max-w-3xl w-full bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-8 transition-all duration-300 hover:shadow-xl">
            <h2 className='font-madimi text-2xl md:text-3xl lg:text-4xl text-center mb-6 dark:text-gray-300'>
              New Activity
            </h2>

            {!user && (
              <p className='text-center font-madimi text-sm text-gray-500 dark:text-gray-400 mb-6'>
                Note: <Link to='/user/signup' className='text-orange3 hover:text-orange1 transition-colors duration-300'>
                  Sign up
                </Link> for the best experience
              </p>
            )}
            
            <div className="border-t border-b border-gray-200 dark:border-gray-700 py-6 my-4">
              <p className='font-monomaniac text-gray-600 dark:text-gray-400 text-lg md:text-xl leading-relaxed px-6'>
                You can create a new Activity and the app will record time spent on that activity separately.
                <br /><br />
                Typically, an activity would be a repeating activity. (Exercise, study, code, read).
                <br /><br />
                You can create multiple activities. But make sure they all have different names :)
              </p>
            </div>
            
            <div className='flex justify-center mt-8'>
              <CreateActivity />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
