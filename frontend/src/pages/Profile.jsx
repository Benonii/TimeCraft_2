// Hooks
import React from 'react';

// Components
import Header from '../components/custom/Header';
import Navbar from '../components/custom/Navbar';
import { Button } from '../components/shadcn/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/shadcn/Card';
import { Clock, Share2, RotateCcw, Zap } from 'lucide-react';



function Profile() {
  // Get user from local storage
  const user = JSON.parse(localStorage.getItem('user'));
  console.log("User:", user)
  const efficiency = Number((user?.total_productive_time)/(Number(user?.total_productive_time) + Number(user?.total_wasted_time)) * 100).toFixed(2) || 0;


  return (
    <div>
      <Header />
      <div className="relative flex items-center mt-10 min-h-[900px]">
        <Navbar className=''/>
        <div className='absolute top-3 left-24'>
          <h2 className='font-monomaniac text-2xl ml-4 md:text-4xl'>User profile</h2>
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-10 mb-8 ml-5">
            {/* Productive Time Card */}
            <Card className="bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader className="flex flex-row items-center space-x-4 pb-2">
                <Clock className="w-8 h-8 text-green-500" />
                <CardTitle className="text-xl font-monomaniac">Productive Time</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold font-monomaniac text-green-500">
                  {user.total_productive_time?.toFixed(2)}h
                </div>
              </CardContent>
            </Card>

            {/* Wasted Time Card */}
            <Card className="bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader className="flex flex-row items-center space-x-4 pb-2">
                <Clock className="w-8 h-8 text-red-500" />
                <CardTitle className="text-xl font-monomaniac">Wasted Time</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold font-monomaniac text-red-500">
                  {user.total_wasted_time?.toFixed(2)}h
                </div>
              </CardContent>
            </Card>

            {/* Efficiency Card */}
            <Card className="bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader className="flex flex-row items-center space-x-4 pb-2">
                <Zap className="w-8 h-8 text-yellow1" />
                <CardTitle className="text-xl font-monomaniac">Efficiency</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold font-monomaniac text-yellow1">
                  {efficiency}%
                </div>
              </CardContent>
            </Card>
            </div>
          <div className='grid grid-cols-1 md:grid-cols-2 place-items-center absolute md:mt-0 w-[62vw] max-w-[500px] ml-1'>
            <Button variant='default' 
              className='mt-2 bg-yellow1 px-4 py-2 md:py-6 rounded-md shadow-lg font-madimi text-white md:text-2xl md:px-10 h-fit max-w-48'>
              <Share2 className='w-10 h-10 mr-2' size={10} />
              Share
            </Button>
            <Button variant='outline' 
              className='mt-2 px-4 py-2 md:py-6 rounded-md shadow-lg font-madimi border border-red-500 text-red-500 hover:text-white hover:bg-red-500 md:text-2xl md:px-10 h-fit'>
              <RotateCcw />
              Reset
            </Button>
          </div>

        </div>
    </div>
    </div>
  )
}

export default Profile
