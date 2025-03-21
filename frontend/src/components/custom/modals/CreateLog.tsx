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
          className="bg-yellow1 px-4 sm:px-6 py-2 sm:py-3 rounded-md shadow-lg font-madimi 
            text-white text-lg sm:text-xl md:text-2xl h-fit hover:bg-yellow-500 transition-colors duration-300"
        >
          Create Log
        </DialogTrigger>
        <DialogContent className="bg-white dark:bg-gray-900 border dark:border-gray-700">
          <DialogHeader>
            <DialogTitle className="font-madimi text-xl sm:text-2xl md:text-3xl text-center text-gray-900 dark:text-gray-300">
              Create Log
            </DialogTitle>
            <DialogDescription className="text-center font-madimi text-sm sm:text-base text-gray-600 dark:text-gray-400">
              Log time spent on an activity
            </DialogDescription>
          </DialogHeader>

          {success && <SuccessAlert content={message} />}
          {error && <ErrorAlert content={message} />}

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4 sm:space-y-6 p-4 sm:p-6'>
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 sm:p-6 shadow-lg dark:shadow-gray-300/30">
                <FormField
                  control={form.control}
                  name="activityId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className='flex items-center gap-2 font-madimi text-base sm:text-xl text-gray-700 dark:text-gray-300'>
                        Activity name
                        <CustomTooltip content="Select the activity you want to log time for">
                          <HelpCircle className='w-3 h-3 sm:w-4 sm:h-4 text-gray-600 dark:text-gray-400'/>
                        </CustomTooltip>
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
                
                <FormField
                  control={form.control}
                  name="timeOnTask"
                  render={({ field }) => (
                    <FormItem className="mt-4 sm:mt-6">
                      <FormLabel className='flex items-center gap-2 font-madimi text-base sm:text-xl text-gray-700 dark:text-gray-300'>
                        Time spent (hours)
                        <CustomTooltip content="How many hours did you spend on this activity?">
                          <HelpCircle className='w-3 h-3 sm:w-4 sm:h-4 text-gray-600 dark:text-gray-400'/>
                        </CustomTooltip>
                      </FormLabel>
                      <FormControl>
                        <Input type="number" className='text-sm sm:text-lg' {...field} />
                      </FormControl>
                      <FormMessage className='text-xs text-red-600' />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="timeWasted"
                  render={({ field }) => (
                    <FormItem className="mt-4 sm:mt-6">
                      <FormLabel className='flex items-center gap-2 font-madimi text-base sm:text-xl text-gray-700 dark:text-gray-300'>
                        Time wasted (hours)
                        <CustomTooltip content="How many hours were wasted during this activity?">
                          <HelpCircle className='w-3 h-3 sm:w-4 sm:h-4 text-gray-600 dark:text-gray-400'/>
                        </CustomTooltip>
                      </FormLabel>
                      <FormControl>
                        <Input type="number" className='text-sm sm:text-lg' {...field} />
                      </FormControl>
                      <FormMessage className='text-xs text-red-600' />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="comment"
                  render={({ field }) => (
                    <FormItem className="mt-4 sm:mt-6">
                      <FormLabel className='flex items-center gap-2 font-madimi text-base sm:text-xl text-gray-700 dark:text-gray-300'>
                        Comment
                        <CustomTooltip content="Optional: Add any notes about this time log">
                          <HelpCircle className='w-3 h-3 sm:w-4 sm:h-4 text-gray-600 dark:text-gray-400'/>
                        </CustomTooltip>
                      </FormLabel>
                      <FormControl>
                        <Input 
                          className='text-sm sm:text-lg'
                          placeholder="Optional comment"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage className='text-xs text-red-600' />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex justify-center">
                <LoadingButton
                  type="submit"
                  isLoading={loading}
                  text="Create"
                  className="bg-yellow1 px-4 sm:px-5 py-2 sm:py-3 text-sm sm:text-base rounded-md shadow-lg font-madimi 
                    text-white hover:bg-yellow-500 transition-colors duration-300"
                />
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  )
}

