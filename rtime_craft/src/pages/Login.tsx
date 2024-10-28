import { useMutation } from '@tanstack/react-query';
import { useRouter } from '@tanstack/react-router'
import { Button } from '../components/shadcn/Button';
import { 
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from '../components/shadcn/Form';
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod";
import { useForm } from "react-hook-form";
import { Input } from '../components/shadcn/Input';

function Login () {
    const loginSchema = z.object({
        username: z.string().min(2, 'Username must be at least 2 characters'),
        password: z.string().min(8, 'Password must be at least 8 characters'),
    })

    const form = useForm<z.infer<typeof loginSchema>>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            username: "",
            password: "",
        }
    })

    type User = {
        name: string,
        id: string,
        email: string,
        weekly_work_hours_goal: number,
        number_of_work_days: number,
        total_wasted_time: number,
        total_productive_time:  number,
    }

    type FormData = {
        username: string,
        password: string,
    }

    type ResponseData = {
        message: string,
        data: {jwt: string, user: User};
    }

    const router = useRouter();

    const mutation = useMutation({
        mutationFn: async (formData: FormData) => {
            const response = await fetch(`/api/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'applciation/json'
                },
                body: JSON.stringify(formData)
            })

            if (!response.ok) {
                throw new Error('Network Error');
            }

            return await response.json()
        },
        onSuccess: (response: ResponseData) => {
            console.log('Login successful', response);
            localStorage.setItem('token', response.data.jwt);
            localStorage.setItem('user', JSON.stringify(response.data.user));
            router.navigate({ to: '/' })
        },
        onError: (error: Error) => {
            console.error('Login failed', error);
        }
    });

    async function onSubmit(values: z.infer<typeof loginSchema>) {
        try {
            mutation.mutate(values);
        } catch(error) {
            console.error('Error submitting form:', error);
        }
    }

    return (
        <div className="flex flex-col justify-center max-w-xl min-h-full mx-auto mt-48 rounded-md shadow-lg min-w-56">
            <h2 className="mt-10 text-center font-bold text-4xl">
                Log in
            </h2>

            <hr className='mt-5' />

            <h3 className='text-center text-2xl mt-10 mb-5 font-semibold'>
                Welcome back!
            </h3>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8 mx-10 mb-24 '>
                    <FormField
                        control={form.control}
                        name="username"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Username</FormLabel>
                                <FormControl>
                                    <Input id='username' placeholder='username@123' {...field} />
                                </FormControl>
                                <FormMessage className='text-xs text-redd-500' />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                            <FormItem>
                                  <FormLabel>
                                      Password
                                  </FormLabel>
                                  <FormControl>
                                    <Input id='password' type='password' {...field} />
                                  </FormControl>
                                  <FormMessage className='text-xs text-red-600 '/>
                              </FormItem>
                        )}
                    />
                    <Button type="submit" className='bg-yellow1 text-white'>Log in</Button>
                </form>
            </Form>
        </div>
    )
}

export default Login;