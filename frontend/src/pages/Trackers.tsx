// Hooks
import { useState, useEffect } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useForm } from "react-hook-form";

// Components
import { 
    Form, FormControl, FormField,
    FormItem, FormLabel, FormMessage
  } from '../components/shadcn/Form';
import { Input } from '../components/shadcn/Input';
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
        activityId: user ? z.string().nullable() : z.string().length(8),
        date: z.date(),
        timeOnTask: z.coerce.number().gt(0),
        timeWasted: z.coerce.number().gt(0),
        comment: z.string().optional(),
      })
  
      const form = useForm<z.infer<typeof newLogSchema>>({
        resolver: zodResolver(newLogSchema),
        defaultValues: {
          activityId: user ? null : "",
          date: new Date(),
          timeOnTask: 0,
          timeWasted: 0,
          comment: "",
        }
      })

    const mutation = useMutation({
      mutationFn: (formData: CreateReportFormData) => createReport(formData),
      onSuccess: (response: MessageResponseData) => {
        // console.log('New Log created successfully', response);
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
      // console.log('Data:', transformedValues)
      try {
          mutation.mutate(transformedValues);
      } catch(error) {
          console.error('Error submitting form:', error);
      }
    }

    // console.log("Productive time:", form.getValues('timeOnTask'))
    // console.log("Wasted time:", form.getValues('timeWasted'))
    return (
        <div className=''>
            <Header />
            <div className="relative flex items-center mt-5 min-h-[900px]">
                <Navbar className=''/>
                <div className='absolute top-3 left-24'>
                    <h2 className='font-monomaniac text-2xl ml-4 md:text-4xl dark:text-gray-300'>Timers</h2>
                    {!user && (
                        <p className='ml-4 mt-2 font-monomaniac text-sm text-gray-500'>
                          Note: <Link to='/user/signup' className='hover:underline'>Sign up </Link>for the best experience
                        </p>
                    )}
                    <p className='ml-5 mt-5 font-monomaniac text-gray-600 mx-5 max-w-[700px] md:text-2xl dark:text-gray-400'>
                        You can use the built in timers below to track productive nad wasted time. <br /><br />
                        The “worked” timer is a timer. That means you can set it to how ever long you would like to work and it counts down. <br /><br />
                        The “wasted” timer is actually a stopwatch. Start it when you’ve stopped working or you’re being unproductive.<br></br>
                        You can always change this behavior in setttings.
                    </p>
                    <div className='ml-5 mt-5'>
                      <div className='flex items-center text-gray-600 font-semibold'>
                        <Form {...form}>
                          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8 mt-5'>
                            <FormField
                              control={form.control}
                              name="activityId"
                              render={({ field }) => (
                                  <FormItem>
                                      <FormLabel className='flex items-center gap-1 font font-monomaniac text-xl dark:text-gray-300'>
                                         Task name
                                      </FormLabel>
                                      <FormControl aria-disabled={true}>
                                        <ActivityPicker 
                                          userId={user?.id}
                                          onSelect={(value: string) => form.setValue('activityId', value)}
                                        />
                                      </FormControl>
                                      <FormMessage className='text-xs text-red-600 '/>
                                  </FormItem>
                              )}
                            />                            
                            {success && (
                              <>
                                <SuccessAlert content={message} />
                              </>
                            )}
                              {error && (
                                <ErrorAlert content={message} />
                            )}
                            <div className='grid md:grid-cols-2 gap-10'>
                            <FormField
                              control={form.control}
                              name="timeOnTask"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className='font-madimi text-2xl text-green-600'>
                                      Worked:
                                  </FormLabel>
                                  <FormControl>
                                    <Timer handleChange={(value: number) => form.setValue('timeOnTask', value)} />
                                  </FormControl>
                                  <FormMessage className='text-xs text-red-600 '/>
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name="timeWasted"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className='font-madimi text-2xl text-red-600'>
                                      Wasted:
                                  </FormLabel>
                                  <FormControl>
                                    <StopWatch handleChange={(value: number) => form.setValue('timeWasted', value)} />
                                  </FormControl>
                                  <FormMessage className='text-xs text-red-600 '/>
                                </FormItem>
                              )}
                            />
                            </div>
                            <div className="flex justify-center w-full mt-[-5px]">
                              <LoadingButton
                                type="submit"
                                isLoading={loading}
                                text="Log"
                              />
                            </div>
                          </form>
                        </Form>
                        <div className='mt-10'>
                          <hr />
                        </div>
                      </div>  
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Trackers
