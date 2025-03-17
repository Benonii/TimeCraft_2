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
import { Input } from '../../shadcn/Input';
import {
    Dialog, DialogContent, DialogDescription,
    DialogHeader, DialogTitle, DialogTrigger,
  } from "../../shadcn/Dialog";
import TaskPicker from '../ActivityPicker';
import ErrorAlert from '../ErrorAlert';
import { Skeleton } from "../../shadcn/Skeleton";
import LoadingButton from '../LoadingButton';

// Types
import { MessageResponseData, TtotFormData, TtotReport,
         TtotReportResponseData }
  from '@/src/lib/types';

// Others
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod"
import { getTtot } from '../../../lib/functions';



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
        userId: user ? z.string().nullable() : z.string().length(8),
        taskId: user ? z.string().nullable() : z.string().length(8),
        taskName: user ? z.string().min(2) : z.string().nullable(),
    })

    const form = useForm<z.infer<typeof ttotReportSchema>>({
        resolver: zodResolver(ttotReportSchema),
        defaultValues: {
            userId: user ? null : "",
            taskId: user ? null : "",
            taskName: user ? "" : null,
        }
    })
  
    const [ report, setReport ] = useState<TtotReport>();

    const mutation = useMutation({
        mutationFn: (formData: TtotFormData) => getTtot(formData, user),
        onSuccess: (data: TtotReportResponseData) => {
            // console.log("Here is your report:", data )
            setReport(data.report);
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
        // console.log('Data:', transformedValues)
        const transformedValues = {
            ...values,
            userId: user ? user.id : values.userId, // Use userId from user object if logged in
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
              {user ? (
                <FormField
                  control={form.control}
                  name="taskName"
                  render={({ field }) => (
                      <FormItem>
                          <FormLabel className='font font-monomaniac text-xl dark:text-gray-300'>
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
                              <FormLabel className='font-monomaniac text-xl dark:text-gray-300'>Task ID</FormLabel>
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
        <div className='flex flex-col font-madimi border rounded-lg border-gray-200 dark:border-gray-700 
            bg-white dark:bg-gray-800 p-6 mb-6 
            shadow-[0_4px_10px_0_rgba(0,0,0,0.1),0_0_10px_2px_rgba(250,204,21,0.3)]
            dark:shadow-[0_4px_10px_0_rgba(0,0,0,0.25),0_0_10px_2px_rgba(250,204,21,0.2)]'
        >
            <h4 className='text-gray-700 dark:text-gray-300 mb-2'>
                <span className='text-lg font-semibold'>Task:</span> {report?.taskName}
            </h4>
            <h3 className='text-gray-700 dark:text-gray-300 mb-4'>
                <span className='text-xl font-semibold'>Total time on task: </span> 
                <span className='text-yellow1'>{report?.ttot} hours</span>
            </h3>

            <Button
                variant='outline'
                className='mt-4 px-5 py-3 font-madimi text-gray-700 hover:text-white hover:bg-yellow1 
                    dark:text-gray-400 dark:hover:text-white border-gray-300 dark:border-gray-600
                    transition-colors duration-300'
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
                    className="bg-yellow1 px-5 py-3 md:px-6 md:py-3 rounded-md shadow-lg 
                        font-madimi text-white text-lg md:text-xl hover:bg-yellow-500 
                        transition-colors duration-300 flex items-center gap-2 min-w-[180px] justify-center"
                >
                    Get report
                </DialogTrigger>
                <DialogContent className="bg-white dark:bg-gray-900 border dark:border-gray-700">
                    <DialogHeader>
                        <DialogTitle className="font-madimi text-2xl md:text-3xl text-center text-gray-900 dark:text-gray-300">
                            Total Time on Task
                        </DialogTitle>
                        <DialogDescription className="text-center font-madimi text-gray-600 dark:text-gray-400">
                            Get total productive time on one task
                        </DialogDescription>
                    </DialogHeader>

                    {error && <ErrorAlert content={message} />}
                    
                    {success ? reportContent : loading ? (
                        <div className="flex flex-col gap-4 p-6">
                            <Skeleton className="w-full h-[250px] rounded-lg" />
                        </div>
                    ) : formContent}
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default GetTotalTimeOnTask;
