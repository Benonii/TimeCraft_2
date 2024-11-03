import React, { useState, useEffect } from 'react';
import { Button } from '../shadcn/Button';
import { Card, CardContent } from '../shadcn/Card';


export default function StopWatch({ handleChange }) {
    const [time, setTime] = useState({
        hours: 0,
        minutes: 0,
        seconds: 0,
        milliseconds: 0
    });
    const [isRunning, setIsRunning] = useState(false);

    useEffect(() => {
        let interval;

        if (isRunning) {
            interval = setInterval(() => {
                setTime((prevTime) => {
                    const { hours, minutes, seconds, milliseconds } = prevTime;

                    // Convert total time to hours and pass to parent component
                   setTimeout(() => {
                    const timeInHours = hours + minutes / 60 + seconds / 3600;
                    handleChange(timeInHours);
                   }, 1000);

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
    }, [isRunning, handleChange]);

    const handleClear = () => {
        setTime({ hours: 0, minutes: 0, seconds: 0, milliseconds: 0 });
        setIsRunning(false);
        handleChange(0); // Reset parent component's value on clear
    };

    return (
        <div className="flex flex-col items-center">
            <Card className="border p-8 w-60 dark:border-gray-400">
                <CardContent className="text-center">
                    <div className="flex items-center justify-center gap-1 text-gray-500 dark:text-gray-300">
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
                    <div className="flex justify-center gap-4 mt-4">
                        <Button
                            type="button"
                            variant="outline"
                            className="hover:bg-yellow1 hover:text-white font-madimi dark:border-gray-400"
                            onClick={() => setIsRunning(!isRunning)}
                        >
                            {isRunning ? 'Stop' : 'Start'}
                        </Button>
                        <Button
                            type="button"
                            variant="outline"
                            className="font-madimi hover:bg-red-500 hover:text-white dark:border-gray-400"
                            onClick={handleClear}
                        >
                            Clear
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
