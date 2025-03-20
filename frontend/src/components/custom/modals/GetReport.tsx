import { useState, useEffect } from 'react';
import { useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { format, startOfDay, endOfDay } from "date-fns";

// Components
import { Button } from '../../shadcn/Button';
import { 
    Form, FormControl, FormField, FormItem, FormLabel, FormMessage
} from '../../shadcn/Form';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../../shadcn/Select";
import { DateRangePicker } from '../../shadcn/DateRangePicker';
import {
    Dialog, DialogContent, DialogDescription,
    DialogHeader, DialogTitle, DialogTrigger,
} from "../../shadcn/Dialog";
import ErrorAlert from '../ErrorAlert';
import { Skeleton } from "../../shadcn/Skeleton";
import LoadingButton from '../LoadingButton';

// Types & Utils
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod"
import { getReport } from '../../../lib/functions';
import { getDateRange } from '../../../utils/dateRanges';

const reportSchema = z.object({
    reportType: z.enum(['today', 'this_week', 'this_month', 'custom']),
    dateRange: z.object({
        from: z.date(),
        to: z.date(),
    }).optional(),
})

type ReportFormValues = z.infer<typeof reportSchema>;

function GetReport() {
    const [success, setSuccess] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(false);

    const form = useForm<ReportFormValues>({
        resolver: zodResolver(reportSchema),
        defaultValues: {
            reportType: 'today',
        }
    });

    const reportType = form.watch('reportType');
    const dateRange = form.watch('dateRange');

    const { data, isLoading, error: queryError, refetch } = useQuery({
        queryKey: ['report', reportType, dateRange],
        queryFn: () => {
            let startDate: Date;
            let endDate: Date;
            
            if (reportType === 'custom' && dateRange?.from && dateRange?.to) {
                startDate = startOfDay(dateRange.from);
                endDate = endOfDay(dateRange.to);
            } else {
                const range = getDateRange(reportType);
                startDate = range.startDate;
                endDate = range.endDate;
            }
            
            return getReport({ startDate, endDate });
        },
        enabled: false,
    });

    // Add useEffect hooks for loading and data handling
    useEffect(() => {
        setLoading(isLoading);
    }, [isLoading]);

    useEffect(() => {
        if (data) {
            setSuccess(true);
        }
    }, [data]);

    useEffect(() => {
        if (queryError) {
            console.error("Error fetching report:", queryError);
            setMessage("An error occurred. Please try again!");
            handleError();
        }
    }, [queryError]);

    const handleError = () => {
        setError(true);
        setTimeout(() => setError(false), 3000);
    };

    const onSubmit = async (values: ReportFormValues) => {
        try {
            await refetch();
        } catch(error) {
            console.error('Error submitting form:', error);
            handleError();
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    return (
        <Dialog>
            <DialogTrigger 
                className="bg-yellow1 px-4 sm:px-6 py-2 sm:py-3 rounded-md shadow-lg font-madimi 
                    text-white text-lg sm:text-xl md:text-2xl h-fit hover:bg-yellow-500 transition-colors duration-300"
            >
                Get Report
            </DialogTrigger>
            <DialogContent className="bg-white dark:bg-gray-900 border dark:border-gray-700">
                <DialogHeader>
                    <DialogTitle className="font-madimi text-2xl md:text-3xl text-center text-gray-900 dark:text-gray-300">
                        Get Report
                    </DialogTitle>
                    <DialogDescription className="text-center font-madimi text-gray-600 dark:text-gray-400">
                        Select a report type or custom date range
                    </DialogDescription>
                </DialogHeader>

                {error && <ErrorAlert content={message} />}
                
                {success ? (
                    <div className='flex flex-col font-madimi border rounded-lg border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 mb-6 shadow-lg dark:shadow-yellow1/40'>
                        <h2 className='text-2xl text-gray-800 dark:text-gray-200 mb-4'>
                            {form.getValues('reportType') === 'custom' ? 'Custom Report' : 
                             form.getValues('reportType') === 'today' ? 'Daily Report' :
                             form.getValues('reportType') === 'this_week' ? 'Weekly Report' :
                             'Monthly Report'}
                        </h2>
                        <hr className='my-4 border-2 border-gray-200 dark:border-gray-500' />
                        <h3 className='text-xl text-gray-700 dark:text-gray-300 mb-4'>
                            <span className='font-semibold'>Date Range:</span> {formatDate(data?.data?.start_date || '')} - {formatDate(data?.data?.end_date || '')}
                        </h3>
                        
                        {data?.data?.activities && Object.entries(data.data.activities).map(([taskName, taskData]: [string, any]) => (
                            <div key={taskName} className="mb-3">
                                <h4 className='text-gray-700 dark:text-gray-300 mb-1'>
                                    <span className='font-semibold'>Task:</span> {taskName}
                                </h4>
                                <h5 className='pl-4 text-gray-600 dark:text-gray-400'>
                                    Productive time: <span className='text-green-600 dark:text-green-500'>
                                        {taskData.total_time_on_task.toFixed(2)} Hours
                                    </span>
                                </h5>
                            </div>
                        ))}

                        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                            <h4 className='text-gray-700 dark:text-gray-400 mb-2'>
                                <span className='font-semibold'>Total productive time: </span>
                                <span className='text-green-600 dark:text-green-500'>
                                    {data?.data?.total_productive_time.toFixed(2)} hours
                                </span>
                            </h4>
                            <h4 className='text-gray-700 dark:text-gray-400'>
                                <span className='font-semibold'>Total wasted time: </span>
                                <span className='text-red-600 dark:text-red-500'>
                                    {data?.data?.total_wasted_time.toFixed(2)} hours
                                </span>
                            </h4>
                        </div>

                        <Button
                            variant='outline'
                            className='mt-6 px-5 py-3 font-madimi text-gray-700 hover:text-white hover:bg-yellow1 
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
                    <div className="flex flex-col gap-4 p-6">
                        <Skeleton className="w-[85%] h-[20px] rounded-lg dark:bg-gray-500" />
                        <Skeleton className="w-[250px] h-[20px] rounded-lg dark:bg-gray-500" />
                        <Skeleton className="w-[250px] h-[20px] rounded-lg dark:bg-gray-500" />
                        <hr className="my-4 border-gray-200 dark:border-gray-700 dark:bg-gray-500" />
                        <Skeleton className="w-[85%] h-[20px] rounded-lg dark:bg-gray-500" />
                        <Skeleton className="w-[250px] h-[20px] rounded-lg dark:bg-gray-500" />
                        <Skeleton className="w-[250px] h-[20px] rounded-lg dark:bg-gray-500" />
                    </div>
                ) : (
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 p-6">
                            <FormField
                                control={form.control}
                                name="reportType"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="font-monomaniac text-xl dark:text-gray-300">
                                            Report Type
                                        </FormLabel>
                                        <Select 
                                            onValueChange={field.onChange} 
                                            defaultValue={field.value}
                                        >
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select a report type" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="today">Today</SelectItem>
                                                <SelectItem value="this_week">This Week</SelectItem>
                                                <SelectItem value="this_month">This Month</SelectItem>
                                                <SelectItem value="custom">Custom Range</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </FormItem>
                                )}
                            />

                            {reportType === 'custom' && (
                                <FormField
                                    control={form.control}
                                    name="dateRange"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="font-monomaniac text-xl dark:text-gray-300">
                                                Date Range
                                            </FormLabel>
                                            <DateRangePicker 
                                                value={field.value}
                                                onChange={field.onChange}
                                            />
                                        </FormItem>
                                    )}
                                />
                            )}

                            <div className="flex justify-center mt-8">
                                <LoadingButton
                                    type="submit"
                                    isLoading={loading}
                                    text="Get Report"
                                    className="bg-yellow1 px-5 py-3 rounded-md shadow-lg font-madimi 
                                        text-white hover:bg-yellow-500 transition-colors duration-300"
                                />
                            </div>
                        </form>
                    </Form>
                )}
            </DialogContent>
        </Dialog>
    );
}

export default GetReport; 