// Hooks
import { useState, useEffect } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useForm } from "react-hook-form";

// Components
import { 
    Form, FormControl, FormField,
    FormItem, FormLabel, FormMessage
} from '../../shadcn/Form';
import { Input } from '../../shadcn/Input';
import { Textarea } from '../../shadcn/Textarea';
import {
  Dialog, DialogContent, DialogDescription,
  DialogHeader, DialogTitle, DialogTrigger,
} from "../../shadcn/Dialog";
import CustomTooltip from '../CustomTooltip';
import { HelpCircle } from 'lucide-react';
import SuccessAlert from '../SuccessAlert';
import ErrorAlert from '../ErrorAlert';
import { Label } from '../../shadcn/Label';
import { createActivity } from '../../../lib/functions';
import LoadingButton from '../LoadingButton';
import { Button } from '../../shadcn/Button';

// Types
import { NewActivityFormData, NewActivityResponseData, MessageResponseData } from '@/src/lib/types';

// Others
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod";

export default function CreateActivity() {
    const [ success, setSuccess ] = useState<boolean>(false);
    const [ error, setError ] = useState<boolean>(false);
    const [ message, setMessage ] = useState<string>("");
    const [ loading, setLoading ] = useState<boolean>(false);
    const [ id, setId ] = useState<string>("");

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
  
    const newActivitySchema = z.object({
      uniqueID: z.string().optional(),
      name: z.string().min(2, "Task name should be longer than 2 characters"),
      description: z.string().optional(),
      dailyGoal: z.coerce.number().min(1).max(23)
    })

    const form = useForm<z.infer<typeof  newActivitySchema>>({
      resolver: zodResolver(newActivitySchema),
      defaultValues: {
        uniqueID: "",
        name: "",
        description: "",
        dailyGoal: 0,
      }
    })

    const mutation = useMutation({
      mutationFn: (formData: NewActivityFormData) => createActivity(formData),
      onSuccess: (response: NewActivityResponseData) => {
        // console.log('New task created successfully', response);
        setMessage(response.message);
        setId(response.data.id);
        handleSuccess();
      },
      onError: (errorResponse: MessageResponseData) => {
        console.error('Failed to create activity', errorResponse?.message);
        setMessage("Error creating an activity. Please try again");
        handleError();
      }
    });

    useEffect(() => {
      setLoading(mutation.isPending);
    }, [mutation])

  async function onSubmit(values: z.infer<typeof newActivitySchema>) {
    console.log("Form is being submitted!!!", values)
    const transformedValues = {
        ...values,
        unique_id: values.uniqueID,
        daily_goal: Number(values.dailyGoal),
    };

    try {
        mutation.mutate(transformedValues);
        setId("")
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
            setId("");
          }
        }}
      > 
        <DialogTrigger 
          className="bg-yellow1 px-4 sm:px-6 py-2 sm:py-3 rounded-md shadow-lg font-madimi 
            text-white text-lg sm:text-xl md:text-2xl h-fit hover:bg-yellow-500 transition-colors duration-300"
        >
          Create Activity
        </DialogTrigger>
        <DialogContent className="bg-white dark:bg-gray-900 border dark:border-gray-700">
          <DialogHeader>
            <DialogTitle className="font-madimi text-xl sm:text-2xl md:text-3xl text-center text-gray-900 dark:text-gray-300">
              Create Activity
            </DialogTitle>
            <DialogDescription className="text-center font-madimi text-sm sm:text-base text-gray-600 dark:text-gray-400">
              Create a new activity to track
            </DialogDescription>
          </DialogHeader>

          {success && <SuccessAlert content={message} />}
          {error && <ErrorAlert content={message} />}

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4 sm:space-y-6 p-4 sm:p-6'>
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 sm:p-6 shadow-lg dark:shadow-gray-300/30">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className='flex items-center gap-2 font-madimi text-base sm:text-xl text-gray-700 dark:text-gray-300'>
                        Activity name
                        <CustomTooltip content="Name of the activity you want to track">
                          <HelpCircle className='w-3 h-3 sm:w-4 sm:h-4 text-gray-600 dark:text-gray-400'/>
                        </CustomTooltip>
                      </FormLabel>
                      <FormControl>
                        <Input className='text-sm sm:text-lg' {...field} />
                      </FormControl>
                      <FormMessage className='text-xs text-red-600' />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem className="mt-4 sm:mt-6">
                      <FormLabel className='flex items-center gap-2 font-madimi text-base sm:text-xl text-gray-700 dark:text-gray-300'>
                        Description
                        <CustomTooltip content="Optional: Add details about this activity">
                          <HelpCircle className='w-3 h-3 sm:w-4 sm:h-4 text-gray-600 dark:text-gray-400'/>
                        </CustomTooltip>
                      </FormLabel>
                      <FormControl>
                        <Input 
                          className='text-sm sm:text-lg'
                          placeholder="Optional description"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage className='text-xs text-red-600' />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="dailyGoal"
                  render={({ field }) => (
                    <FormItem className="mt-4 sm:mt-6">
                      <FormLabel className='flex items-center gap-2 font-madimi text-base sm:text-xl text-gray-700 dark:text-gray-300'>
                        Daily goal
                        <CustomTooltip content="How many hours you want to spend on this task daily">
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

