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

    const formContent = (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 mx-10 mt-5">
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

                <div className="flex justify-center w-full">
                    <LoadingButton
                        type="submit"
                        isLoading={loading}
                        text="Get Report"
                    />
                </div>
            </form>
        </Form>
    );

    const reportContent = (
        <div className='flex flex-col ml-5 font-monomaniac border rounded-lg shadow-lg shadow-yellow1 p-4 mb-10'>
            <h3 className='text-xl text-gray-700 dark:text-gray-300'>
                <span className='text-2x'>Date Range:</span> {formatDate(data?.data?.start_date || '')} - {formatDate(data?.data?.end_date || '')}
            </h3>
            {data?.data?.activities && Object.entries(data.data.activities).map(([taskName, taskData]: [string, any]) => (
                <div key={taskName}>
                    <h4 className='ml-5 dark:text-gray-300'>
                        <span className='text-lg'>Task:</span> {taskName}
                    </h4>
                    <h5 className='ml-10 dark:text-gray-400'>
                        Productive time: <span className='text-green-700 dark:text-green-500'>
                            {taskData.total_time_on_task.toFixed(2)} Hours
                        </span>
                    </h5>
                </div>
            ))}

            <h4 className='ml-5 dark:text-gray-400'>
                <span className='text-lg'>Total productive time:</span> 
                <span className='text-green-700 dark:text-green-500'>
                    {data?.data?.total_productive_time.toFixed(2)} hours
                </span>
            </h4>
            <h4 className='ml-5 dark:text-gray-400'>
                <span className='text-lg'>Total wasted time:</span> 
                <span className='text-red-700 dark:text-red-500'>
                    {data?.data?.total_wasted_time.toFixed(2)} hours
                </span>
            </h4>

            <Button
                variant='outline'
                className='w-20 h-10 mt-2 text-lg font-madimi text-black hover:text-white hover:bg-yellow1 dark:text-gray-400 dark:hover:text-white dark:border-gray-400'
                onClick={() => {
                    setSuccess(false);
                    setLoading(false);
                }}
            >
                Back
            </Button>
        </div>
    );

    return (
        <Dialog>
            <DialogTrigger className="ml-2 bg-yellow1 px-4 py-2 md:py-6 rounded-md shadow-lg font-madimi text-white md:text-4xl md:px-7 h-fit hover:bg-yellow-300">
                Get Report
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle className="font-monomaniac text-3xl text-center dark:text-gray-300">
                        Get Report
                    </DialogTitle>
                    <DialogDescription className="text-left text-lg font-monomaniac dark:text-gray-400">
                        Select a report type or custom date range
                    </DialogDescription>
                </DialogHeader>
                {error && <ErrorAlert content={message} />}
                {success ? reportContent : loading ? (
                    <div className="flex flex-col gap-2 items-justify">
                        <Skeleton className="w-[400px] h-[200px] rounded-lg ml-10 mb-10" />
                    </div>
                ) : formContent}
            </DialogContent>
        </Dialog>
    );
}

export default GetReport; 