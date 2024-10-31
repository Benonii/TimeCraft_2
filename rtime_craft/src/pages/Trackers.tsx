import {useState} from 'react';
import { useMutation } from '@tanstack/react-query';
import { Button } from '../components/shadcn/Button';
import { 
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from '../components/shadcn/Form';
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod";
import { useForm } from "react-hook-form";
import { Input } from '../components/shadcn/Input';
import Timer from '../components/custom/Timer';
import Header from '../components/custom/Header';
import Navbar from '../components/custom/Navbar';
import StopWatch from "../components/custom/Stopwatch";
import TaskPicker from '../components/custom/TaskPicker';
import { Link } from '@tanstack/react-router';
import SuccessAlert from '../components/custom/SuccessAlert';
import ErrorAlert from '../components/custom/ErrorAlert';



function Trackers() {
      const api = process.env.REACT_APP_API_URL;
      const [ success, setSuccess ] = useState<boolean>(false);
      const [ message, setMessage ] = useState<string>("");
      const [ error, setError ] = useState<boolean>(false);
      const [ loading, setLoading ] = useState<boolean>(false);

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
          userId: user ? z.string().nullable() : z.string().length(36), // Allow null if logged in
          taskId: user ? z.string().nullable() : z.string().length(36),
          taskName: user ? z.string().min(2) : z.string().nullable(),
          timeOnTask: z.coerce.number().gt(0).max(24),
          timeWasted: z.coerce.number().gt(0).max(23),
      })

      const form = useForm<z.infer<typeof newLogSchema>>({
        resolver: zodResolver(newLogSchema),
        defaultValues: {
          userId: user ? null : "",
          taskId: user ? null : "",
          taskName: user ? "" : null,
          timeOnTask: 0,
          timeWasted: 0,
        }
      })

      type FormData = {
        userId: string | null,
        taskId: string | null,
        taskName: string | null,
        timeOnTask: number,
        timeWasted: number,
      }

      type ResponseData = {
        message: string,
      }

      const mutation = useMutation({
        mutationFn: async (formData: FormData) => {
          const params = new URLSearchParams();
          if (user) {
            params.append('userId', user.id);
            params.append('taskName', formData.taskName !)
          } else {
            params.append('userId', formData.userId !);
            params.append('taskId', formData.taskId !);
          }
          params.append('timeOnTask', String(formData.timeOnTask));
          params.append('timeWasted', String(formData.timeWasted));

          // console.log("Params", params.toString())
          const response = await fetch(`${api}/new_log`, {
            method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                  },
                body: params.toString(),
          })

          const resJSON = await response.json();
          if (!response.ok) {
            // console.log(response)
            throw new Error(resJSON.message || 'An error occured');
          }

        return resJSON;
      },
      onSuccess: (response: ResponseData) => {
        console.log('New Log created successfully', response);
        setMessage(response.message);
        handleSuccess();
      },
      onError: (error: Error) => {
        console.error('Failed to create Log', error);
        setMessage(error.message);
        handleError();
      }
    });

    async function onSubmit(values: z.infer<typeof newLogSchema>) {
      const transformedValues = {
          ...values,
          timeOnTask: Number(values.timeOnTask),
          timeWasted: Number(values.timeWasted),
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
                    <h2 className='font-monomaniac text-2xl ml-4 md:text-4xl'>Timers</h2>
                    {!user && (
                        <p className='ml-4 mt-2 font-monomaniac text-sm text-gray-500'>
                          Note: <Link to='/user/signup' className='hover:underline'>Sign up </Link>for the best experience
                        </p>
                    )}
                    <p className='ml-5 mt-5 font-monomaniac text-gray-600 mx-5 max-w-[700px] md:text-2xl'>
                        You can use the built in timers below to track productive nad wasted time. <br /><br />
                        The “worked” timer is a timer. That means you can set it to how ever long you would like to work and it counts down. <br /><br />
                        The “wasted” timer is actually a stopwatch. Start it when you’ve stopped working or you’re being unproductive.<br></br>
                        You can always change this behavior in setttings.
                    </p>
                    <div className='ml-5 mt-5'>
                      <div className='flex items-center text-gray-600 font-semibold'>
                        <Form {...form}>
                          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8 mt-5'>
                            {!user && (
                              <FormField
                                control={form.control}
                                name="userId"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel className='font-monomaniac text-xl'>User ID</FormLabel>
                                    <FormControl>
                                      <Input
                                        id='user-id'
                                        placeholder='7d9f39b1-3a64-4dd8-b9f1-a0d28b1abc98'
                                        className='text-lg' {...field}
                                        value={field.value ?? undefined}
                                      />
                                    </FormControl>
                                    <FormMessage className='text-xs text-redd-500' />
                                  </FormItem>
                                )}
                              />
                            )}
                            {user ? (
                              <FormField
                                control={form.control}
                                name="taskName"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel className='flex items-center gap-1 font font-monomaniac text-xl'>
                                       Task name
                                    </FormLabel>
                                    <FormControl aria-disabled={true}>
                                      <TaskPicker
                                        userId={user?.id}
                                        onSelect={(value: string) => form.setValue('taskName', value)}
                                      />
                                    </FormControl>
                                    <FormMessage className='text-xs text-red-600 '/>
                                  </FormItem>
                                )}
                              />
                            ) : (
                              <FormField
                                control={form.control}
                                name="taskId"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel className='font-monomaniac text-xl'>Task ID</FormLabel>
                                    <FormControl>
                                      <Input
                                        id='user-id'
                                        placeholder='7d9f39b1-3a64-4dd8-b9f1-a0d28b1abc98'
                                        className='text-lg' {...field}
                                        value={field.value ?? undefined} />
                                    </FormControl>
                                    <FormMessage className='text-xs text-redd-500' />
                                  </FormItem>
                                )}
                              />
                            )}
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
                            <div className="flex justify-center w-full border mt-[-5px]">
                              <Button type="submit" className='bg-yellow1 text-white md:w-36 md:h-14 text-xl md:text-2xl font-madimi hover:bg-yellow-300'>
                                  Log
                              </Button>
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
