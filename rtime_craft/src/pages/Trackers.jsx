import React from 'react';
import Timer from '../components/Timer';
import Header from '../components/Header';
import Navbar from '../components/Navbar';
import StopWatch from "../components/Stopwatch";
import TaskPicker from '../components/TaskPicker';


function Trackers() {
    return (
        <div className=''>
            <Header />
            <div className="relative flex items-center mt-10 min-h-[900px]">
                <Navbar className=''/>
                <div className='absolute top-3 left-24'>
                    <h2 className='font-monomaniac text-2xl ml-4 md:text-4xl'>Timers</h2>
                    <p className='ml-5 mt-5 font-monomaniac text-gray-600 mx-5 max-w-[700px] md:text-2xl'>
                        You can use the built in timers below to track productive nad wasted time. <br /><br />
                        The “worked” timer is a timer. That means you can set it to how ever long you would like to work and it counts down. <br /><br />
                        The “wasted” timer is actually a stopwatch. Start it when you’ve stopped working or you’re being unproductive.<br></br>
                        You can always change this behavior in setttings.
                    </p>
                    <div className='ml-5 mt-5'>
                        <div className='flex items-center text-gray-600 font-semibold'>
                            <h3 className='font-monomaniac text-2xl mr-2'>Task:</h3>
                            <TaskPicker />
                        </div>
                        <div className='grid grid-cols-1 md:grid-cols-2 gap-3 mt-20 md:mt-5'>
                            <div className='flex flex-col w-70s'>
                                <h3 className='font-madimi text-2xl text-green-600'>Worked</h3>
                                 <Timer className=''/>
                            </div>
                                
                            <div className='flex flex-col w-70s'>
                                 <h3 className='font-madimi text-2xl text-red-600'>Wasted</h3>
                                <StopWatch />
                            </div>
                        </div>
                        
                        
                    </div>
                    
                </div>
            </div>
        </div>
  )
}

export default Trackers
