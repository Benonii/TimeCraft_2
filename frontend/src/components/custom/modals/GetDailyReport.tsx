// Hooks
import { useState, useEffect } from 'react';
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";

// Components
import { Button } from '../../shadcn/Button';
import { 
    Form, FormControl, FormField,
    FormItem, FormLabel, FormMessage
  } from '../../shadcn/Form';
import LoadingButton from '../LoadingButton';

import { Input } from '../../shadcn/Input';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "../../shadcn/Dialog";
import { DatePicker } from '../../shadcn/DatePicker';
import ErrorAlert from '../ErrorAlert';
import { Skeleton } from "../../shadcn/Skeleton";

// Types
import { DailyReportFromData, MessageResponseData, DailyReportResponseData, DailyReport } from '@/src/lib/types';

// Others
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod"
import { getDailyReport } from '../../../lib/functions';


function GetDailyReport() {
    const [ success, setSuccess ] = useState<boolean>(false);
    const [ message, setMessage ] = useState<string>("");
    const [ error, setError ] = useState<boolean>(false);
    const [ selectedDate, setSelectedDate ] = useState<Date | undefined>(new Date());
    const [ loading, setLoading ] = useState<boolean>(false);
    const [ report, setReport ] = useState<DailyReport>();

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

    const dailyReportSchema = z.object({
        userId: user ? z.string().nullable() : z.string().length(8),
        date: z.date(),
    })

    const form = useForm<z.infer<typeof dailyReportSchema>>({
        resolver: zodResolver(dailyReportSchema),
        defaultValues: {
            userId: user ? null : "",
            date: new Date()
        }
    })

    const mutation = useMutation({
        mutationFn: (formData: DailyReportFromData) => getDailyReport(formData, user),
        onSuccess: (data: DailyReportResponseData) => {
            // console.log("Here is your report:", data )
            setReport(data.report);
            setSuccess(true);
        },
        onError: (errorResponse: MessageResponseData) => {
            console.error("Error fetching report:", errorResponse)
            setMessage(errorResponse.message);
            handleError();
        },
    })

    useEffect(() => {
      setLoading(mutation.isPending);
    }, [mutation])

    const onSubmit = async (values: z.infer<typeof dailyReportSchema>) => {
        const transformedValues = {
            ...values,
            userId: user ? user.id : values.userId, // Use userId from user object if logged in
            date: selectedDate || values.date,
        };
        // console.log('Data:', transformedValues)
        try {
            mutation.mutate(transformedValues);
        } catch(error) {
            console.error('Error submitting form:', error);
        }
    }

    const formContent = (
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8 mx-10 mt-5'>
          {!user && (
            <FormField
              control={form.control}
              name="userId"
              render={({ field }) => (
                  <FormItem>
                      <FormLabel className='font-monomaniac text-xl dark:text-gray-300'>User ID</FormLabel>
                      <FormControl>
                          <Input 
                            id='user-id'
                            placeholder='7d9f39b1-3a64-4dd8-b9f1-a0d28b1abc98'
                            className='text-lg' {...field}
                            value={field.value ?? undefined} />
                      </FormControl>
                      <FormMessage className='text-xs text-red-500' />
                  </FormItem>
              )}
            />
          )}
            <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                    <FormItem>
                          <FormLabel className='font font-monomaniac text-xl mr-1 dark:text-gray-300'>
                              Date:
                          </FormLabel>
                          <FormControl>
                            <DatePicker date={selectedDate} onDateChange={setSelectedDate} />
                          </FormControl>
                          <FormMessage className='text-xs text-red-600 '/>
                      </FormItem>
                )}
            />
            <div className="flex justify-center w-full">
              <LoadingButton
                type="submit"
                isLoading={loading}
                text="Get report"
              />
            </div>
        </form>
      </Form>
    )

    const reportContent = (
      <div className='flex flex-col ml-5 font-monomaniac border rounded-lg shadow-lg shadow-yellow1 p-4 mb-10'>
        <h3 className='text-xl text-gray-700 dark:text-gray-300'><span className='text-2x'>Date:</span> {report?.weekday}, {report?.date}</h3>
          {report?.tasks.map(task => (
            <div key={task.name}>
              <h4 className='ml-5 dark:text-gray-300'><span className='text-lg'>Task:</span> {task.name}</h4>
              <h5 className='ml-10 dark:text-gray-400'>Productive time: <span className='text-green-700 dark:text-green-500'>{task.ttot.toFixed(2)} Hours</span></h5>
            </div>
          ))}
        

        <h4 className='ml-5 dark:text-gray-400'><span className='text-lg'>Total productive time:</span> <span className='text-green-700 dark:text-green-500'>{report?.ttot_day.toFixed(2)} hours</span></h4>
        <h4 className='ml-5 dark:text-gray-400'><span className='text-lg'>Total wasted time:</span> <span className='text-red-700 dark:text-red-500'>{report?.twt_day.toFixed(2)} hours</span></h4>

        <Button
          variant='outline'
          className='w-20 h-10 mt-2 text-lg font-madimi text-black hover:text-white  hover:bg-yellow1 dark:text-gray-400 dark:hover:text-white dark:border-gray-400'
          onClick={() => {
            setSuccess(false)
            setLoading(false)
          }}
        >
          Back
        </Button>
      </div>
    )
  return (
    <div>
      <Dialog>
        <DialogTrigger 
          className='ml-2 bg-yellow1 px-4 py-2 md:py-6 rounded-md shadow-lg font-madimi text-white md:text-4xl md:px-7 h-fit hover:bg-yellow-300'
        >
          Get report
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className='font-monomaniac text-3xl text-center dark:text-gray-300'>Daily Report</DialogTitle>
            <DialogDescription className='text-left text-lg font-monomaniac dark:text-gray-400'>
                Get your daily report by picking a date. Needs User Id if not signed in.
            </DialogDescription>
          </DialogHeader>
          {error && (
            <ErrorAlert content={message} />
          )}
          {success ? (
            reportContent
            ) : loading ? (
                <div className='flex flex-col gap-2 items-justify'>
                  <Skeleton className="w-[400px] h-[200px] rounded-lg ml-10 mb-10" />
                </div>
              ) : (
                formContent
            ) 
          }
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default GetDailyReport
