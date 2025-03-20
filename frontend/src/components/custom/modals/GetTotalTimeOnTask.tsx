// Hooks
import { useState, useEffect } from 'react';
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { format, parseISO, formatDistance } from 'date-fns';

// Components
import { Button } from '../../shadcn/Button';
import { 
    Form, FormControl, FormField,
    FormItem, FormLabel, FormMessage
} from '../../shadcn/Form';
import { Input } from '../../shadcn/Input';
import {
    Dialog, DialogContent, DialogDescription,
    DialogHeader, DialogTitle, DialogTrigger,
  } from "../../shadcn/Dialog";
import TaskPicker from '../ActivityPicker';
import ErrorAlert from '../ErrorAlert';
import { Skeleton } from "../../shadcn/Skeleton";
import LoadingButton from '../LoadingButton';
import { Progress } from '../../shadcn/Progress';

// Types
import { MessageResponseData, TtotReportResponseData } from '@/src/lib/types';

// Others
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod"
import { getTotalTimeOnTask } from '../../../lib/functions';



function GetTotalTimeOnTask() {
    const [ success, setSuccess ] = useState<boolean>(false);
    const [ message, setMessage ] = useState<string>("");
    const [ error, setError ] = useState<boolean>(false);
    const [ loading, setLoading ] = useState<boolean>(false);

    // Get user from local storage
    const user = (() => {
        try {
          const storedUser = localStorage.getItem('user');
          return storedUser ? JSON.parse(storedUser) : null;
        } catch (error) {
          console.error("Failed to parse user data from localStorage:", error);
          return null;
        }
    })();

    const handleError = () => {
        setError(true);
    
        setTimeout(() => {
          setError(false)
        }, 3000);
    }

    const ttotReportSchema = z.object({
        taskId: z.string().length(8),
    })

    const form = useForm<z.infer<typeof ttotReportSchema>>({
        resolver: zodResolver(ttotReportSchema),
        defaultValues: {
            taskId: "",
        }
    })
  
    const [ report, setReport ] = useState<TtotReportResponseData['data']>();

    const mutation = useMutation({
        mutationFn: (taskID: string) => getTotalTimeOnTask(taskID),
        onSuccess: (data: TtotReportResponseData) => {
            console.log("Here is your report:", data.data )
            setReport(data.data);
            setSuccess(true);
        },
        onError: (errorResponse: MessageResponseData) => {
            console.error("Error fetching report:", errorResponse);
            setMessage(errorResponse.message);
            handleError();
        }
    })

    useEffect(() => {
        setLoading(mutation.isPending)
    }, [mutation])

    const onSubmit = async (values: z.infer<typeof ttotReportSchema>) => {
        try {
            mutation.mutate(values.taskId);
        } catch(error) {
            console.error('Error submitting form:', error);
        }
    }

    const formatDateSafely = (dateString: string | undefined) => {
        if (!dateString) return 'N/A';
        try {
            return format(new Date(dateString), 'MMMM d, yyyy');
        } catch (error) {
            console.error('Error formatting date:', error);
            return 'N/A';
        }
    };

    const getTimeDifference = (dateString: string | undefined) => {
        if (!dateString) return 'N/A';
        try {
            return formatDistance(new Date(dateString), new Date(), { addSuffix: true });
        } catch (error) {
            console.error('Error calculating time difference:', error);
            return 'N/A';
        }
    };

    return (
        <div>
            <Dialog>
                <DialogTrigger 
                    className="bg-yellow1 px-4 sm:px-6 py-2 sm:py-3 rounded-md shadow-lg font-madimi 
                        text-white text-lg sm:text-xl md:text-2xl h-fit hover:bg-yellow-500 transition-colors duration-300"
                >
                    Get report
                </DialogTrigger>
                <DialogContent className="bg-white dark:bg-gray-900 border dark:border-gray-700">
                    <DialogHeader>
                        <DialogTitle className="font-madimi text-xl sm:text-2xl md:text-3xl text-center text-gray-900 dark:text-gray-300">
                            Total Time on Task
                        </DialogTitle>
                        <DialogDescription className="text-center font-madimi text-sm sm:text-base text-gray-600 dark:text-gray-400">
                            Get total time spent on a task
                        </DialogDescription>
                    </DialogHeader>

                    {error && <ErrorAlert content={message} />}
                    
                    {success ? (
                        <div className='flex flex-col font-madimi border rounded-lg border-gray-200 dark:border-gray-700 
                            bg-white dark:bg-gray-800 p-4 sm:p-6 mb-4 sm:mb-6 shadow-lg dark:shadow-yellow1/40'
                        >
                            <h4 className='text-sm sm:text-base text-gray-700 dark:text-gray-300 mb-2'>
                                <span className='font-semibold'>Task:</span> {report?.name}
                            </h4>

                            <div className="space-y-4 sm:space-y-6 mt-3 sm:mt-4">
                                <div className="space-y-2">
                                    <h3 className='text-sm sm:text-base text-gray-700 dark:text-gray-300'>
                                        <span className='text-lg sm:text-xl font-semibold'>Total time logged: </span> 
                                        <span className='text-green-600 dark:text-green-400'>{report?.total_time_on_task.toFixed(2)} hours</span>
                                    </h3>
                                    
                                    <p className='text-sm sm:text-base text-gray-600 dark:text-gray-400'>
                                        <span className='font-semibold'>Daily goal:</span> {report?.daily_goal} hours
                                    </p>
                                </div>

                                <div className="space-y-2">
                                    <div className="flex justify-between items-center">
                                        <span className='text-sm sm:text-base text-gray-700 dark:text-gray-300 font-semibold'>
                                            Weekly Progress
                                        </span>
                                        <span className='text-sm sm:text-base text-gray-600 dark:text-gray-400'>
                                            {report?.total_time_on_task}/{report?.weekly_goal} hours
                                        </span>
                                    </div>
                                    <Progress 
                                        value={Math.min((report?.total_time_on_task! / report?.weekly_goal!) * 100, 100)} 
                                        className="h-2 bg-gray-200 dark:bg-gray-700"
                                        indicatorClassName={report?.total_time_on_task! >= report?.weekly_goal! ? 
                                            "bg-green-600 dark:bg-green-400" : "bg-yellow1"}
                                    />
                                </div>

                                <div className="pt-3 sm:pt-4 border-t border-gray-200 dark:border-gray-700">
                                    <p className='text-xs sm:text-sm text-gray-600 dark:text-gray-400'>
                                        Created on {formatDateSafely(report?.created_at)}
                                    </p>
                                    <p className='text-xs sm:text-sm text-gray-600 dark:text-gray-400'>
                                        Last updated {getTimeDifference(report?.updated_at)}
                                    </p>
                                </div>
                            </div>

                            <Button
                                variant='outline'
                                className='mt-4 sm:mt-6 px-4 sm:px-5 py-2 sm:py-3 font-madimi text-sm sm:text-base text-gray-700 hover:text-white hover:bg-yellow1 
                                    dark:text-gray-400 dark:hover:text-white border-gray-300 dark:border-gray-600
                                    transition-colors duration-300'
                                onClick={() => {
                                    setSuccess(false);
                                    setLoading(false);
                                    form.reset();
                                }}
                            >
                                Back
                            </Button>
                        </div>
                    ) : loading ? (
                        <div className="flex flex-col gap-3 sm:gap-4 p-4 sm:p-6">
                            <Skeleton className="w-full h-[18px] sm:h-[20px] rounded-lg" />
                        </div>
                    ) : (
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4 sm:space-y-6 p-4 sm:p-6'>
                                <FormField
                                    control={form.control}
                                    name="taskId"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className='font-monomaniac text-base sm:text-xl dark:text-gray-300'>
                                                Task name
                                            </FormLabel>
                                            <FormControl>
                                                <TaskPicker
                                                    userId={user?.id}
                                                    onSelect={(value: string) => form.setValue('taskId', value)}
                                                />
                                            </FormControl>
                                            <FormMessage className='text-xs text-red-600' />
                                        </FormItem>
                                    )}
                                />

                                <div className="flex justify-center">
                                    <LoadingButton
                                        type="submit"
                                        isLoading={loading}
                                        text="Get report"
                                        className="bg-yellow1 px-4 sm:px-5 py-2 sm:py-3 text-sm sm:text-base rounded-md shadow-lg font-madimi 
                                            text-white hover:bg-yellow-500 transition-colors duration-300"
                                    />
                                </div>
                            </form>
                        </Form>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default GetTotalTimeOnTask;
