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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../shadcn/Popover";


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
  
  const api = process.env.REACT_APP_API_URL;
    const newTaskSchema = z.object({
      userId: z.string().length(36),
      taskName: z.string().min(2, "Task name should be longer than 2 characters"),
      dailyGoal: z.coerce.number().min(1).max(23)
    })

    const form = useForm<z.infer<typeof newTaskSchema>>({
      resolver: zodResolver(newTaskSchema),
      defaultValues: {
        userId: "",
        taskName: "",
        dailyGoal: 0,
      }
    })

    type FormData = {
      userId: string | null,
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
        user
          ? params.append('userId', user.userId)
          : params.append('userId', formData.userId !);
        params.append('taskName', formData.taskName);
	      params.append('dailyGoal', String(formData.dailyGoal));

        const response = await fetch(`${api}/new_task`, {
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
    const transformedValues = {
        ...values,
        dailyGoal: Number(values.dailyGoal),
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
      <Popover>
        <PopoverTrigger
          className='ml-2 bg-yellow1 px-4 py-2 md:py-6 rounded-md shadow-lg font-madimi text-white md:text-3xl md:px-7 h-fit'
        >
          Create task
        </PopoverTrigger>
        <PopoverContent>
          <h2 className='font-monomaniac text-2xl text-center'>New Task</h2>
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
                                  <Input id='user-id' placeholder='7d9f39b1-3a64-4dd8-b9f1-a0d28b1abc98' className='text-lg' {...field} />
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
        </PopoverContent>
      </Popover>
    </div>
  )
}

