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
import IdDisplay from '../IdDisplay';
import { Label } from '../../shadcn/Label';
import { createActivity } from '../../../lib/functions';
import LoadingButton from '../LoadingButton';

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

  // console.log("User ID:", user.id)
  
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
          className='ml-2 bg-yellow1 px-4 py-2 md:py-6 rounded-md shadow-lg font-madimi text-white md:text-4xl md:px-7 h-fit hover:bg-yellow-300'
        >
          Create Activity
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className='font-monomaniac text-3xl text-center dark:text-gray-300'>Create an Activity</DialogTitle>
            <DialogDescription className='ml-10 text-lg font-monomaniac dark:text-gray-400'>
              Create a new Activity. You need a unique ID if you are not signed in.
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
          {id.length > 0 && (
            <div className=''>
              <Label htmlFor="id" className='ml-10 font-monomaniac text-gray-700 h-fit dark:text-gray-300'>Activity Id</Label>
              <IdDisplay id={id} />
            </div>
          )}
          <Form {...form}>
                <form 
                    onSubmit={form.handleSubmit(onSubmit, (errors) => {
                        console.log('Form validation errors:', errors)
                    })} 
                    className='space-y-8 mx-10 mt-5'
                >
                  {!user && (
                    <FormField
                      control={form.control}
                      name="uniqueID"
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
                            <FormMessage className='text-xs text-redd-500' />
                          </FormItem>
                      )}
                    />
                  )}
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                              <FormLabel className='font font-monomaniac text-xl dark:text-gray-300'>
                                  Activity Name
                              </FormLabel>
                              <FormControl>
                                <Input id='task-name' className='text-lg' {...field} />
                              </FormControl>
                              <FormMessage className='text-xs text-red-600 '/>
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className='font-monomaniac text-xl dark:text-gray-300'>
                                    Description
                                </FormLabel>
                                <FormControl>
                                    <Textarea 
                                        id='description' 
                                        placeholder='Optional description' 
                                        className='text-lg resize-none' 
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
                            <FormItem>
                              <FormLabel className='flex items-center gap-1 font font-monomaniac text-xl dark:text-gray-300'>
                                  Daily goal
                                  <CustomTooltip content="How many hours per day would you like to spend on this task?">
                                    <HelpCircle className='w-4 h-4 mt-1 text-gray-600 dark:text-gray-300'/>
                                  </CustomTooltip>
                              </FormLabel>
                              <FormControl>
                                <Input type="number" id='daily-goal' className='text-lg' {...field} />
                              </FormControl>
                              <FormMessage className='text-xs text-red-600 '/>
                            </FormItem>
                        )}
                    />
                    <div className="flex justify-center w-full">
                      <LoadingButton
                          type="submit"
                          isLoading={loading}
                          text="Create"
                      />
                    </div>
                </form>
            </Form>
        </DialogContent>
      </Dialog>
    </div>
  )
}

