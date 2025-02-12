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
import { createTask } from '../../../lib/functions';
import LoadingButton from '../LoadingButton';

// Types
import { NewTaskFormData, NewTaskResponseData, MessageResponseData } from '@/src/lib/types';

// Others
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod";

export default function CreateTask() {
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
  
    const newTaskSchema = z.object({
      userId: user ? z.string().nullable() : z.string().length(8), // Allow null if logged in
      taskName: z.string().min(2, "Task name should be longer than 2 characters"),
      dailyGoal: z.coerce.number().min(1).max(23)
    })

    const form = useForm<z.infer<typeof newTaskSchema>>({
      resolver: zodResolver(newTaskSchema),
      defaultValues: {
        userId: user ? null : "", // Set to null if logged in
        taskName: "",
        dailyGoal: 0,
      }
    })

    const mutation = useMutation({
      mutationFn: (formData: NewTaskFormData) => createTask(formData),
      onSuccess: (response: NewTaskResponseData) => {
        // console.log('New task created successfully', response);
        setMessage(response.message);
        setId(response.data.task_id);
        handleSuccess();
      },
      onError: (errorResponse: MessageResponseData) => {
        console.error('Failed to create task', errorResponse);
        setMessage(errorResponse.message);
        handleError();
      }
    });

    useEffect(() => {
      setLoading(mutation.isPending);
    }, [mutation])

  async function onSubmit(values: z.infer<typeof newTaskSchema>) {
    const transformedValues = {
        ...values,
        userId: user ? user.id : values.userId, // Use userId from user object if logged in
        dailyGoal: Number(values.dailyGoal),
    };
    // console.log('Data:', transformedValues)
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
          Create task
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className='font-monomaniac text-3xl text-center dark:text-gray-300'>Create a task</DialogTitle>
            <DialogDescription className='ml-10 text-lg font-monomaniac dark:text-gray-400'>
              Create a new task. You need a user ID if you are not signed in.
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
              <Label htmlFor="id" className='ml-10 font-monomaniac text-gray-700 h-fit dark:text-gray-300'>Task Id</Label>
              <IdDisplay id={id} />
            </div>
          )}
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
                            <FormMessage className='text-xs text-redd-500' />
                          </FormItem>
                      )}
                    />
                  )}
                    <FormField
                        control={form.control}
                        name="taskName"
                        render={({ field }) => (
                            <FormItem>
                              <FormLabel className='font font-monomaniac text-xl dark:text-gray-300'>
                                  Task Name
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

