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
} from "../../shadcn/Dialog";


export default function CreateTask() {
  const user = (() => {
    try {
      const storedUser = localStorage.getItem('user');
      return storedUser ? JSON.parse(storedUser) : null;
    } catch (error) {
      console.error("Failed to parse user data from localStorage:", error);
      return null;
    }
  })();

  // console.log("User ID:", user.id)
  
  const api = process.env.REACT_APP_API_URL;
    const newTaskSchema = z.object({
      userId: user ? z.string().nullable() : z.string().length(36), // Allow null if logged in
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

    type FormData = {
      userId: string,
      taskName: string,
      dailyGoal: number,
    }

    type ResponseData = {
      message: string,
      // data: {

      // }
    }

    const mutation = useMutation({
      mutationFn: async (formData: FormData) => {
        const params = new URLSearchParams();
        params.append('userId', formData.userId);
        params.append('taskName', formData.taskName);
	      params.append('dailyGoal', String(formData.dailyGoal));

        const response = await fetch(`${api}/tasks/create`, {
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
      console.log('New task created successfully', response);
    },
    onError: (error: Error) => {
        console.error('Failed to create task', error);
    }
  });

  async function onSubmit(values: z.infer<typeof newTaskSchema>) {
    // console.log('Form submitted with values:', values); // Add this line
    const transformedValues = {
        ...values,
        userId: user ? user.id : values.userId, // Use userId from user object if logged in
        dailyGoal: Number(values.dailyGoal),
    };
    // console.log('Data:', transformedValues)
    try {
        mutation.mutate(transformedValues);
    } catch(error) {
        console.error('Error submitting form:', error);
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>, values: z.infer<typeof newTaskSchema>) {
    e.preventDefault();
    console.log('Form submitted with values:', values);
  }

  return (
    <div>
      <Dialog>
        <DialogTrigger 
          className='ml-2 bg-yellow1 px-4 py-2 md:py-6 rounded-md shadow-lg font-madimi text-white md:text-4xl md:px-7 h-fit'
        >
          Create task
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className='font-monomaniac text-3xl text-center'>Create a task</DialogTitle>
            <DialogDescription className='ml-10 text-lg font-monomaniac'>
              Create a new task. You need a user ID if you are not signed in.
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
                                  <FormLabel className='font font-monomaniac text-xl'>
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
                                  <FormLabel className='font font-monomaniac text-xl'>
                                      Daily goal
                                  </FormLabel>
                                  <FormControl>
                                    <Input id='daily-goal' className='text-lg' {...field} />
                                  </FormControl>
                                  <FormMessage className='text-xs text-red-600 '/>
                              </FormItem>
                        )}
                    />
                    <div className="flex justify-center w-full">
                        <Button type="submit" className='bg-yellow1 text-white md:w-36 md:h-14 text-xl md:text-2xl font-madimi hover:bg-yellow-300'>
                            Create
                        </Button>
                    </div>
                </form>
            </Form>
        </DialogContent>
      </Dialog>
    </div>
  )
}

