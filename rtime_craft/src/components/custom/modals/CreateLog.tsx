import { useMutation } from '@tanstack/react-query';
import { Button } from '../../shadcn/Button';
import { 
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from '../../shadcn/Form';
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod";
import { useForm } from "react-hook-form";
import { Input } from '../../shadcn/Input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../shadcn/Dialog"

import TaskPicker from '../TaskPicker';


export default function CreateLog() {
  const user = (() => {
    try {
      const storedUser = localStorage.getItem('user');
      return storedUser ? JSON.parse(storedUser) : null;
    } catch (error) {
      console.error("Failed to parse user data from localStorage:", error);
      return null;
    }
  })();
  
  const api = process.env.REACT_APP_API_URL;
    const newLogSchema = z.object({
      userId: user ? z.string().nullable() : z.string().length(36), // Allow null if logged in
      taskId: user ? z.string().nullable() : z.string().length(36),
      taskName: user ? z.string().min(2) : z.string().nullable(),
      timeOnTask: z.coerce.number().min(0.5).max(24),
      timeWasted: z.coerce.number().min(0.5).max(23),
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
      // data: {

      // }
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
        if (!response.ok) {
          throw new Error('Network Error');
      }

      return await response.json()
    },
    onSuccess: (response: ResponseData) => {
      console.log('New Log created successfully', response);
    },
    onError: (error: Error) => {
        console.error('Failed to create Log', error);
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


  return (
    <div>
      <Dialog>
        <DialogTrigger 
          className='ml-2 bg-yellow1 px-4 py-2 md:py-6 rounded-md shadow-lg font-madimi text-white md:text-4xl md:px-7 h-fit'
        >
          Make Log
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className='font-monomaniac text-3xl text-center'>Make a log</DialogTitle>
            <DialogDescription className='ml-10 text-lg font-monomaniac'>
              Create a new log. You need a user ID if you are not signed in.
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8 mx-10 mt-5'>
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
                              <FormLabel className='font font-monomaniac text-xl'>
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
                   
                    <FormField
                        control={form.control}
                        name="timeOnTask"
                        render={({ field }) => (
                            <FormItem>
                                  <FormLabel className='font font-monomaniac text-xl'>
                                      Time on task
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
                                  <FormLabel className='font font-monomaniac text-xl'>
                                      Time wasted
                                  </FormLabel>
                                  <FormControl>
                                    <Input id='daily-goal' type="number" className='text-lg' {...field} />
                                  </FormControl>
                                  <FormMessage className='text-xs text-red-600 '/>
                              </FormItem>
                        )}
                    />
                    <div className="flex justify-center w-full">
                        <Button type="submit" className='bg-yellow1 text-white md:w-36 md:h-14 text-xl md:text-2xl font-madimi hover:bg-yellow-300'>
                            Log
                        </Button>
                    </div>
                </form>
            </Form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
