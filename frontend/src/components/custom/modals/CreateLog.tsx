// Hooks
import { useMutation } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { useForm } from "react-hook-form";

// Components
import { 
    Form, FormControl, FormField, FormItem,
    FormLabel, FormMessage 
  } from '../../shadcn/Form';
import { Input } from '../../shadcn/Input';
import {
    Dialog, DialogContent, DialogDescription,
    DialogHeader, DialogTitle, DialogTrigger, 
  } from "../../shadcn/Dialog"
import ActivityPicker from '../ActivityPicker';
import CustomTooltip from '../CustomTooltip';
import { HelpCircle } from 'lucide-react';
import SuccessAlert from '../SuccessAlert';
import ErrorAlert from '../ErrorAlert';
import LoadingButton from '../LoadingButton';

// Others
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod"
import { createReport } from '../../../lib/functions';

// Types
import { CreateReportFormData, MessageResponseData } from '@/src/lib/types';


export default function CreateLog() {
    const [ success, setSuccess ] = useState<boolean>(false);
    const [ error, setError ] = useState<boolean>(false);
    const [ loading, setLoading ] = useState<boolean>(false);
    const [ message, setMessage ] = useState<string>("");

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
      }, 3000);
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

  return (
    <div>
      <Dialog
        onOpenChange={(open) => {
          if (!open) {
            form.reset();     // Reset form when dialog closes
            setMessage("");   // Clear any existing messages
          }
        }}
      > 
        <DialogTrigger 
          className='ml-2 bg-yellow1 px-4 py-2 md:py-6 hover:bg-yellow-300 rounded-md shadow-lg font-madimi text-white md:text-4xl md:px-7 h-fit'
        >
          Make Log
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className='font-monomaniac text-3xl text-center dark:text-gray-300'>Make a log</DialogTitle>
            <DialogDescription className='ml-10 text-lg font-monomaniac'>
              Create a new log. You need a user ID if you are not signed in.
            </DialogDescription>
          </DialogHeader>
          {success && (
            <>
              <SuccessAlert content={message} />
            </>
          )}
          {error && (
            <ErrorAlert content={message} />
          )}
          <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8 mx-10 mt-5'>
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
                   
                    <FormField
                        control={form.control}
                        name="timeOnTask"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className='flex imtes-center gap-1 font font-monomaniac text-xl dark:text-gray-300'>
                                    Time on task
                                    <CustomTooltip content="The productive time spent on task">
                                      <HelpCircle className='w-4 h-4 mt-2 text-gray-600 dark:text-gray-300'/>
                                    </CustomTooltip>
                                </FormLabel>
                                <FormControl>
                                  <Input id='task-name' type='number' className='text-lg' {...field} />
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
                                  <FormLabel className='flex items-center gap-1 font font-monomaniac text-xl dark:text-gray-300'>
                                      Time wasted
                                      <CustomTooltip content="unproductive time">
                                        <HelpCircle className='w-4 h-4 mt-2 text-gray-600 dark:text-gray-300'/>
                                      </CustomTooltip>
                                  </FormLabel>
                                  <FormControl>
                                    <Input id='daily-goal' type="number" className='text-lg' {...field} />
                                  </FormControl>
                                  <FormMessage className='text-xs text-red-600 '/>
                              </FormItem>
                        )}
                    />
                    <div className="flex justify-center w-full">
                      <LoadingButton
                          type="submit"
                          isLoading={loading}
                          text="Log"
                      />
                    </div>
                </form>
            </Form>
        </DialogContent>
      </Dialog>
    </div>
  )
}

