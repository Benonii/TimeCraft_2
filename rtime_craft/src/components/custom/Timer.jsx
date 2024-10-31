import React, { useState, useEffect, useRef } from 'react';
import { Button } from '../shadcn/Button';
import { Card, CardContent } from '../shadcn/Card';

function Timer({ handleChange }) {
    const [time, setTime] = useState({ hours: 3, minutes: 0, seconds: 0 });
    const [isRunning, setIsRunning] = useState(false);
    const initialTimeinMinutes = useRef(0);

    useEffect(() => {
        if (!isRunning) return;

        // Set initial time in minutes once when the timer starts
        if (initialTimeinMinutes.current === 0) {
            initialTimeinMinutes.current = (time.hours || 0) * 60 + (time.minutes || 0) + (time.seconds || 0) / 60;
        }

        const interval = setInterval(() => {
            setTime((prevTime) => {
                const { hours, minutes, seconds } = prevTime;
                const currentTimeInMinutes = hours * 60 + minutes + seconds / 60;

                // Calculate elapsed time and handle change
                const elapsed = initialTimeinMinutes.current - currentTimeInMinutes;
                const timeLapsedInHours = initialTimeinMinutes.current > 0 ? (elapsed / 60) / initialTimeinMinutes.current : 0;

                // Use a setTimeout to prevent the warning
                setTimeout(() => {
                    // console.log('Time lapsed in hours:', timeLapsedInHours);
                    handleChange(Number(timeLapsedInHours));
                }, 0);

                if (hours === 0 && minutes === 0 && seconds === 0) {
                    clearInterval(interval);
                    handleClear();
                    return { hours: 0, minutes: 0, seconds: 0 };
                } else if (minutes === 0 && seconds === 0) {
                    return { hours: hours - 1, minutes: 59, seconds: 59 };
                } else if (seconds === 0) {
                    return { hours, minutes: minutes - 1, seconds: 59 };
                } else {
                    return { hours, minutes, seconds: seconds - 1 };
                }
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [isRunning]);

    const handleTimeChange = (field) => (e) => {
        const value = parseInt(e.target.value, 10);
        setTime((prevTime) => ({
            ...prevTime,
            [field]: isNaN(value) ? prevTime[field] : value,
        }));
    };

    const handleClear = () => {
        setTime({ hours: 0, minutes: 0, seconds: 0 });
        setIsRunning(false);
        initialTimeinMinutes.current = 0;
    };

    return (
        <div className='flex flex-col items-center'>
            <Card className='flex justify-center items-center p-8 w-60 dark:border-gray-400'>
                <CardContent className='grid place-items-center text-center'>
                    <div className="flex items-center justify-center gap-1 text-gray-500 dark:text-gray-300">
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
                            onChange={handleTimeChange('minutes')}
                            className="w-12 text-center text-2xl font-bold bg-transparent"
                            min="0"
                        />
                        <span className="text-2xl font-bold">:</span>
                        <input
                            disabled={isRunning}
                            type="number"
                            value={time.seconds.toString().padStart(2, '0')}
                            onChange={handleTimeChange('seconds')}
                            className="w-12 text-center text-2xl font-bold bg-transparent"
                            min="0"
                        />
                    </div>
                    <div className="flex justify-center gap-4 mt-4">
                        <Button
                            variant='outline'
                            type="button"
                            disabled={(!time.hours && !time.minutes && !time.seconds)} 
                            onClick={() => setIsRunning(!isRunning)}
                            className='hover:bg-yellow1 hover:text-white font-madimi dark:border-gray-400'>
                            {isRunning ? 'Stop' : 'Start'}
                        </Button>
                        <Button
                            variant='outline'
                            type="button"
                            className='font-madimi hover:bg-red-500 hover:text-white dark:border-gray-400'
                            onClick={handleClear}>
                            Clear
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

export default Timer;