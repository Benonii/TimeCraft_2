import React, { useState, useEffect } from 'react';
import { Button } from './Button';
import { Card, CardContent } from './Card';


function Timer() {
    const [ time, setTime ] = useState({ hours: 3, minutes: 0, seconds: 0});
    const [ isRunning, setIsRunning ] = useState(false);

    useEffect(() => {
        if (!isRunning) return;

        const interval = setInterval(() => {
            setTime((prevTime) => {
                const {hours, minutes, seconds } = prevTime;
                if (hours === 0 && minutes === 0 && seconds === 0) {
                    clearInterval(interval);
                    // Add logic to automatically log hours here
                } else if (minutes === 0 && seconds === 0) {
                    return { hours: hours - 1, minutes: 59, seconds: 59}
                } else if (seconds === 0) {
                    return { hours, minutes: minutes - 1, seconds: 59}
                } else {
                    return { hours, minutes, seconds: seconds - 1}
                }
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [isRunning]);

    const handleTimeChange = (field) => (e) => {
        const value = parseInt(e.target.value, 10);
        setTime((prevTime) => ({
            ...prevTime,
            [field]: isNaN(value) ? prevTime[field]: value,
        }))
    }

    const handleClear = () => {
        setTime({ hours: 0, minutes: 0, seconds: 0 })
        setIsRunning(false);
    }
  return (
    <div className='flex flex-col items-center'>
        <Card className='border p-8'>
            <CardContent className='text-center'>
                <div className="flex items-center justify-center gap-1 text-gray-500">
                    <input
                        disabled={isRunning}
                        type="number"
                        value={time.hours.toString().padStart(2, '0')}
                        onChange={handleTimeChange('hours')}
                        className="w-12 text-center text-2xl font-bold bg-transparent"
                        min="0"
                    />
                    <span className="text-2xl font-bold">:</span>
                    <input
                        disabled={isRunning}
                        type="number"
                        value={time.minutes.toString().padStart(2, '0')}
                        onChange={handleTimeChange('hours')}
                        className="w-12 text-center text-2xl font-bold bg-transparent"
                        min="0"
                    />
                    <span className="text-2xl font-bold">:</span>

                    <input
                        disabled={isRunning}
                        type="number"
                        value={time.seconds.toString().padStart(2, '0')}
                        onChange={handleTimeChange('hours')}
                        className="w-12 text-center text-2xl font-bold bg-transparent"
                        min="0"
                    />
                </div>
                <div className="flex justify-center gap-4 mt-4">
                    <Button
                        variant='outline'
                        disabled={(!time.hours && !time.minutes && !time.seconds)} onClick={() => setIsRunning(!isRunning)}
                        className='hover:bg-yellow1 hover:text-white font-madimi'>
                        {isRunning ? 'Stop' : 'Start'}
                    </Button>
                    <Button variant='outline'
                        // disabled={isRunning}
                        className='font-madimi hover:bg-red-500 hover:text-white'
                        onClick={handleClear}> 
                        Clear
                    </Button>
                </div>
            </CardContent>
        </Card>      
    </div>
  )
}

export default Timer;
