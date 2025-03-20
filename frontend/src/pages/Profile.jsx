// Hooks
import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';

// Components
import Header from '../components/custom/Header';
import Navbar from '../components/custom/Navbar';
import { Button } from '../components/shadcn/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/shadcn/Card';
import { Clock, Share2, RotateCcw, Zap } from 'lucide-react';
import { resetStats } from '../lib/functions';
import SuccessAlert from '../components/custom/SuccessAlert';
import ErrorAlert from '../components/custom/ErrorAlert';
import ChangeUsername from '../components/custom/ChangeUsername';
import ManageTasks from '../components/custom/ManageTasks';
import DeleteUserAlert from '../components/custom/DeleteUserAlert';

export default function Profile() {
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const [message, setMessage] = useState("");
  
  // Get user from local storage
  const user = JSON.parse(localStorage.getItem('user'));
  
  let efficiency = 0;
  if (user?.total_productive_time > 0 || user?.total_wasted_time > 0) {
    efficiency = Number((user?.total_productive_time)/(Number(user?.total_productive_time) + Number(user?.total_wasted_time)) * 100).toFixed(2) || 0;
  }

  const handleSuccess = () => {
    setSuccess(true);
    setTimeout(() => {
      setSuccess(false);
    }, 3000);
  };

  const handleError = () => {
    setError(true);
    setTimeout(() => {
      setError(false);
    }, 3000);
  };

  const mutation = useMutation({
    mutationFn: () => resetStats(),
    onSuccess: (response) => {
      // Update the user in localStorage with reset stats
      const updatedUser = {
        ...user,
        total_productive_time: 0,
        total_wasted_time: 0
      };
      
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      setMessage("Stats reset successfully!");
      handleSuccess();
      
      // Force a re-render after the success message is shown
      // setTimeout(() => {
      //   window.location.reload();
      // }, 1500);
    },
    onError: (error) => {
      console.error("Error resetting stats:", error);
      setMessage("Failed to reset stats. Please try again.");
      handleError();
    }
  });

  const handleResetStats = () => {
    if (window.confirm("Are you sure you want to reset your stats? This cannot be undone.")) {
      mutation.mutate();
    }
  };

  return (
    <div className='flex flex-col items-center mt-20'>
      <Header />
      {success && (
        <div className='fixed top-24 left-1/2 transform -translate-x-1/2 z-50'>
          <SuccessAlert content={message} />
        </div>
      )}
      {error && (
        <div className='fixed top-24 left-1/2 transform -translate-x-1/2 z-50'>
          <ErrorAlert content={message} />
        </div>
      )}
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
                  Profile
                </h2>

                <div className="border-t border-b border-gray-200 dark:border-gray-700 py-4 sm:py-6 my-4">
                  <div className="space-y-4 sm:space-y-6 px-2 sm:px-8">
                    <div className="flex flex-col gap-2">
                      <h3 className='font-madimi text-xl sm:text-2xl text-gray-700 dark:text-gray-400'>
                        Account Details
                      </h3>
                      <p className='font-monomaniac text-base sm:text-lg text-gray-600 dark:text-gray-400'>
                        <span className="font-semibold">Username:</span> {user?.username}
                      </p>
                      <p className='font-monomaniac text-base sm:text-lg text-gray-600 dark:text-gray-400'>
                        <span className="font-semibold">Email:</span> {user?.email}
                      </p>
                    </div>

                    <div className="flex flex-col gap-2">
                      <h3 className='font-madimi text-xl sm:text-2xl text-gray-700 dark:text-gray-400'>
                        Settings
                      </h3>
                      <div className="flex flex-col gap-3">
                        <ChangeUsername />
                        <ManageTasks />
                        <DeleteUserAlert handleDelete={() => {mutation.mutate()}} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
