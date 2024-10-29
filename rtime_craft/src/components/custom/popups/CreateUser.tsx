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



export default function CreateUser() {
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
      username: z.string().min(2),
      weekly_hours_goal: z.coerce.number().min(1).max(100),
      work_days: z.coerce.number().min(1).max(7)
    })

    const form = useForm<z.infer<typeof newTaskSchema>>({
      resolver: zodResolver(newTaskSchema),
      defaultValues: {
        username: "",
        weekly_hours_goal: 0,
        work_days: 0,
      }
    })

    type FormData = {
      username: string,
      weekly_hours_goal: number,
      work_days: number,
    }

    type ResponseData = {
      message: string,
      data: {
        userId: string
      }
    }

    const mutation = useMutation({
      mutationFn: async (formData: FormData) => {
        const params = new URLSearchParams();
        params.append('username', formData.username)
	      params.append('weekly_hours', String(formData.weekly_hours_goal));
        params.append('work_days', String(formData.work_days));

        const response = await fetch(`${api}/user/create`, {
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
        weekly_hours_goal: Number(values.weekly_hours_goal),
        work_days: Number(values.work_days),
    };
    console.log('Data:', transformedValues)
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
          className='ml-2 bg-transparent border px-4 py-2 md:py-6 rounded-md shadow-lg font-madimi text-gray-600 md:text-3xl md:px-7 hover:border-black hover:text-black'
        >
          Create user
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className='font-monomaniac text-3xl text-center'>Create a user</DialogTitle>
            <DialogDescription className='ml-10 text-lg font-monomaniac'>
              Create a simple user without an email and a password.
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8 mx-10 mt-5'>
                  {!user && (
                    <FormField
                      control={form.control}
                      name="username"
                      render={({ field }) => (
                          <FormItem>
                              <FormLabel className='font-monomaniac text-xl'>Username</FormLabel>
                              <FormControl>
                                  <Input id='username' placeholder='username123' className='text-lg' {...field} />
                              </FormControl>
                              <FormMessage className='text-xs text-redd-500' />
                          </FormItem>
                      )}
                    />
                  )}
                    <FormField
                        control={form.control}
                        name="weekly_hours_goal"
                        render={({ field }) => (
                            <FormItem>
                                  <FormLabel className='font font-monomaniac text-xl'>
                                      Weekly goal
                                  </FormLabel>
                                  <FormControl>
                                    <Input id='weekly-goal' className='text-lg' {...field} />
                                  </FormControl>
                                  <FormMessage className='text-xs text-red-600 '/>
                              </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="work_days"
                        render={({ field }) => (
                            <FormItem>
                                  <FormLabel className='font font-monomaniac text-xl'>
                                      Numebr of work days
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

