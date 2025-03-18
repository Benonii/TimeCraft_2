// Hooks
import { useState, useEffect } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useForm } from "react-hook-form";

// Components
import { 
    Form, FormControl, FormField,
    FormItem, FormLabel, FormMessage
  } from '../components/shadcn/Form';
import Timer from '../components/custom/Timer';
import Header from '../components/custom/Header';
import Navbar from '../components/custom/Navbar';
import StopWatch from "../components/custom/Stopwatch";
import ActivityPicker from '../components/custom/ActivityPicker';
import { Link } from '@tanstack/react-router';
import SuccessAlert from '../components/custom/SuccessAlert';
import ErrorAlert from '../components/custom/ErrorAlert';
import LoadingButton from '../components/custom/LoadingButton';

// Types
import { CreateReportFormData, MessageResponseData } from '../lib/types';

// Others
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod"
import { createReport } from '../lib/functions';


function Trackers() {
      const [ success, setSuccess ] = useState<boolean>(false);
      const [ message, setMessage ] = useState<string>("");
      const [ error, setError ] = useState<boolean>(false);
      const [ loading, setLoading ] = useState<boolean>(false);

      // Get user from localstorage
      const user = (() => {
          try {
            const storedUser = localStorage.getItem('user');
            return storedUser ? JSON.parse(storedUser) : null;
          } catch (error) {
            console.error("Failed to parse user data from localStorage:", error);
            return null;
          }
      })();

      const handleSuccess = () => {
          setSuccess(true);
          setTimeout(() => {
            setSuccess(false)
          }, 5000);
      }

      const handleError = () => {
          setError(true);
      
          setTimeout(() => {
            setError(false)
          }, 3000);
      }

      const newLogSchema = z.object({
        activityId: z.string().length(8),
        date: z.date(),
        timeOnTask: z.coerce.number().gt(0),
        timeWasted: z.coerce.number().gt(0),
        comment: z.string().optional(),
      })
  
      const form = useForm<z.infer<typeof newLogSchema>>({
        resolver: zodResolver(newLogSchema),
        defaultValues: {
          activityId: "",
          date: new Date(),
          timeOnTask: 0,
          timeWasted: 0,
          comment: "",
        }
      })

    const mutation = useMutation({
      mutationFn: (formData: CreateReportFormData) => createReport(formData),
      onSuccess: (response: MessageResponseData) => {
        setMessage(response.message);
        handleSuccess();
      },
      onError: (error: MessageResponseData) => {
        console.error('Failed to create Log', error);
        setMessage(error.message);
        handleError();
      }
    });

    useEffect(() => {
      setLoading(mutation.isPending);
    }, [mutation])

    async function onSubmit(values: z.infer<typeof newLogSchema>) {
      const transformedValues = {
        ...values,
        activity_id: values.activityId,
        time_on_task: Number(values.timeOnTask),
        time_wasted: Number(values.timeWasted),
    };
      try {
          mutation.mutate(transformedValues);
      } catch(error) {
          console.error('Error submitting form:', error);
      }
    }

    return (
        <div className='flex flex-col items-center mt-20'>
            <Header />
            <div className="flex min-h-full">
                <div className="flex-1 flex justify-center items-start gap-5 p-6">
                    <Navbar className='mt-30' />
                    <div className="max-w-4xl w-full bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-8 transition-all duration-300 hover:shadow-xl">
                        <h2 className='font-madimi text-2xl md:text-3xl lg:text-4xl text-center mb-6 dark:text-gray-300'>
                            Timers
                        </h2>

                        <div className="border-t border-b border-gray-200 dark:border-gray-700 py-6 my-4">
                            <p className='font-monomaniac text-gray-600 dark:text-gray-400 text-lg md:text-xl leading-relaxed px-6'>
                                You can use the built in timers below to track productive and wasted time.
                                <br /><br />
                                The "worked" timer is a countdown timer. Set it to how long you would like to work.
                                <br /><br />
                                The "wasted" timer is a stopwatch. Start it when you've stopped working or you're being unproductive.
                            </p>
                        </div>

                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8 mt-8'>
                                <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg dark:shadow-yellow1/50">
                                    <FormField
                                        control={form.control}
                                        name="activityId"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className='font-madimi text-xl text-gray-700 dark:text-gray-300'>
                                                    Task name
                                                </FormLabel>
                                                <FormControl>
                                                    <ActivityPicker 
                                                        userId={user?.id}
                                                        onSelect={(value: string) => form.setValue('activityId', value)}
                                                    />
                                                </FormControl>
                                                <FormMessage className='text-xs text-red-600' />
                                            </FormItem>
                                        )}
                                    />

                                    <div className='grid md:grid-cols-2 gap-10 mt-8'>
                                        <FormField
                                            control={form.control}
                                            name="timeOnTask"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className='font-madimi text-2xl text-green-600 dark:text-green-500'>
                                                        Worked:
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Timer handleChange={(value: number) => form.setValue('timeOnTask', value)} />
                                                    </FormControl>
                                                    <FormMessage className='text-xs text-red-600' />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="timeWasted"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className='font-madimi text-2xl text-red-600 dark:text-red-500'>
                                                        Wasted:
                                                    </FormLabel>
                                                    <FormControl>
                                                        <StopWatch handleChange={(value: number) => form.setValue('timeWasted', value)} />
                                                    </FormControl>
                                                    <FormMessage className='text-xs text-red-600' />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                </div>

                                {success && <SuccessAlert content={message} />}
                                {error && <ErrorAlert content={message} />}

                                <div className="flex justify-center">
                                    <LoadingButton
                                        type="submit"
                                        isLoading={loading}
                                        text="Log"
                                        className="bg-yellow1 px-5 py-3 rounded-md shadow-lg font-madimi 
                                            text-white hover:bg-yellow-500 transition-colors duration-300"
                                    />
                                </div>
                            </form>
                        </Form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Trackers
