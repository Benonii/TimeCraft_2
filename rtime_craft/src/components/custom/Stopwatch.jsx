import React, { useState, useEffect } from 'react';
import { Button } from '../shadcn/Button';
import { Card, CardContent } from '../shadcn/Card';

export default function StopWatch() {
    const [ time, setTime ] = useState({
        hours: 0,
        minutes: 0,
        seconds: 0,
        milliseconds: 0
    });
    const [ isRunning, setIsRunning ] = useState(false);

    useEffect(() => {
        let interval;
        
        if (isRunning) {
            interval = setInterval(() => {
                setTime((prevTime) => {
                    const { hours, minutes, seconds, milliseconds } = prevTime;

                    if (milliseconds < 990) {
                        return { ...prevTime, milliseconds: milliseconds + 10 };
                    } else if (seconds < 59) {
                        return { ...prevTime, seconds: seconds + 1, milliseconds: 0 };
                    } else if (minutes < 59) {
                        return { ...prevTime, minutes: minutes + 1, seconds: 0, milliseconds: 0 };
                    } else {
                        return { hours: hours + 1, minutes: 0, seconds: 0, milliseconds: 0 };
                    }
                });
            }, 10);
        }

        return () => clearInterval(interval);
    }, [isRunning]);

    const handleTimeChange = (field) => (e) => {
        if (isRunning) {
            return;
        }
        const value = parseInt(e.target.value, 10);
        setTime((prevTime) => ({
            ...prevTime,
            [field]: isNaN(value) ? prevTime[field]: value,
        }))
    }

    const handleClear = () => {
        setTime({ hours: 0, minutes: 0, seconds: 0, milliseconds: 0 });
        setIsRunning(false);
    }
    return (
        <div className="flex flex-col items-center">
            <Card className='border p-8'>
                <CardContent className='text-center'>
                    <div className="flex items-center justify-center gap-1 text-gray-500">
                    <div className="flex items-center justify-center gap-1 text-gray-500">
                    <p className="text-2xl text-center font-bold bg-transparent">
                            {time.hours.toString().padStart(2, '0')}
                        </p>
                        <span className="text-2xl font-bold">:</span>
                        <p className="text-2xl text-center font-bold bg-transparent">
                            {time.minutes.toString().padStart(2, '0')}
                        </p>
                        <span className="text-2xl font-bold">:</span>
                        <p className="text-2xl text-center font-bold bg-transparent">
                            {time.seconds.toString().padStart(2, '0')}
                        </p>
                        <span className="text-2xl font-bold">.</span>
                        <p className="text-xl text-center font-bold bg-transparent">
                            {Math.floor(time.milliseconds / 10).toString().padStart(2, '0')}
                        </p>
                </div>
                    </div>
                    <div className="flex justify-center gap-4 mt-4">
                        <Button
                            variant='outline'
                            className='hover:bg-yellow1 hover:text-white font-madimi'
                            onClick={() => setIsRunning(!isRunning)}
                        >
                            {isRunning ? 'Stop': 'Start'}
                        </Button>
                        <Button variant='outline'
                            className='font-madimi hover:bg-red-500 hover:text-white'
                            onClick={handleClear}
                        > 
                            Clear
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}