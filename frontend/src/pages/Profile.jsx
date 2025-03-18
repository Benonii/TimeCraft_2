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

function Profile() {
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
      <div className="flex min-h-full">
        <div className="flex-1 flex justify-center items-start gap-5 p-6 lg:gap-6">
          <Navbar className='mt-30' />
          <div className="max-w-3xl lg:max-w-4xl w-full bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-8 lg:p-10 transition-all duration-300 hover:shadow-xl">
            <h2 className='font-madimi text-2xl md:text-3xl lg:text-4xl text-center mb-6 lg:mb-8 dark:text-gray-300'>
              User Profile
            </h2>

            {success && <SuccessAlert content={message} />}
            {error && <ErrorAlert content={message} />}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6 mb-8 min-h-44 mt-5">
              {/* Productive Time Card */}
              <Card className="bg-white dark:bg-gray-800 shadow-md hover:shadow-lg transition-all duration-300">
                <CardHeader className="flex flex-row items-center space-x-4 pb-2">
                  <Clock className="w-6 h-6 md:w-8 md:h-8 text-green-500" />
                  <CardTitle className="text-lg md:text-xl font-madimi text-gray-600 dark:text-gray-300">Productive Time</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl mt-5 text-center md:text-3xl font-bold font-mono text-green-500">
                    {user.total_productive_time?.toFixed(2)}h
                  </div>
                </CardContent>
              </Card>

              {/* Wasted Time Card */}
              <Card className="bg-white dark:bg-gray-800 shadow-md hover:shadow-lg transition-all duration-300">
                <CardHeader className="flex flex-row items-center justify-center space-x-4 pb-2">
                  <Clock className="w-6 h-6 md:w-8 md:h-8 text-red-500" />
                  <CardTitle className="text-lg md:text-xl font-madimi text-gray-600 dark:text-gray-300">Wasted Time</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="mt-5 text-center text-2xl md:text-3xl font-bold font-mono text-red-500">
                    {user.total_wasted_time?.toFixed(2)}h
                  </div>
                </CardContent>
              </Card>

              {/* Efficiency Card */}
              <Card className="bg-white dark:bg-gray-800 shadow-md hover:shadow-lg transition-all duration-300">
                <CardHeader className="flex flex-row items-center space-x-4 pb-2">
                  <Zap className="w-6 h-6 md:w-8 md:h-8 text-yellow1" />
                  <CardTitle className="text-lg md:text-xl font-madimi text-gray-600 dark:text-gray-300">Efficiency</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl mt-5 text-center md:text-3xl font-bold font-mono text-yellow1">
                    {efficiency}%
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="flex flex-col md:flex-row justify-center gap-4 mt-24">
              {/* <Button 
                variant="default"
                className="bg-yellow1 opacity-100 px-5 py-3 md:px-6 md:py-3 rounded-md shadow-lg font-madimi text-white text-lg md:text-xl hover:bg-orange1 transition-colors duration-300 flex items-center gap-2 min-w-[180px] justify-center"
              >
                <Share2 className="w-4 h-4 md:w-5 md:h-5" />
                Share Profile
              </Button> */}
              <Button 
                variant="outline"
                className="px-5 py-3 md:px-6 md:py-3 rounded-md shadow-lg font-madimi text-gray-400 border-2 hover:bg-red-500 border-gray-600 dark:hover:bg-red-800 hover:border-none hover:text-white text-lg md:text-xl transition-colors duration-300 flex items-center gap-2 min-w-[180px] justify-center"
                onClick={handleResetStats}
                disabled={mutation.isPending}
              >
                {mutation.isPending ? (
                  <span className="flex items-center">
                    <svg className="animate-spin h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Resetting...
                  </span>
                ) : (
                  <>
                    <RotateCcw className="w-4 h-4 md:w-5 md:h-5" />
                    Reset Stats
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
