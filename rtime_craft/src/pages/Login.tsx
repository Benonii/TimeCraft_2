import { useMutation } from '@tanstack/react-query';
import { useRouter, Link } from '@tanstack/react-router'
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
    const api = process.env.REACT_APP_API_URL;
    const loginSchema = z.object({
        email: z.string().email(),
        password: z.string().min(8, 'Password must be at least 8 characters'),
    })

    const form = useForm<z.infer<typeof loginSchema>>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "",
            password: "",
        }
    })

    type User = {
        username: string,
        id: string,
        email: string,
        weekly_work_hours_goal: number,
        number_of_work_days: number,
        total_wasted_time: number,
        total_productive_time:  number,
    }

    type FormData = {
        email: string,
        password: string,
    }

    type ResponseData = {
        message: string,
        data: {token: string, user: User};
    }

    const router = useRouter();

    const mutation = useMutation({
        mutationFn: async (formData: FormData) => {
            const params = new URLSearchParams();
            params.append('email', formData.email);
            params.append('password', formData.password);
            const response = await fetch(`${api}/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: params.toString(),
            })

            if (!response.ok) {
                throw new Error('Network Error');
            }

            return await response.json()
        },
        onSuccess: (response: ResponseData) => {
            console.log('Login successful', response);
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));
            router.navigate({ to: '/' })
        },
        onError: (error: Error) => {
            console.error('Login failed', error);
        }
    });

    async function onSubmit(values: z.infer<typeof loginSchema>) {
        console.log(values);
        try {
            mutation.mutate(values);
        } catch(error) {
            console.error('Error submitting form:', error);
        }
    }

    return (
        <div className="flex flex-col justify-center max-w-[600px] min-h-full mx-auto mt-48 rounded-md shadow-lg min-w-56">
            <h2 className="mt-10 text-center font-madimi font-semibold text-4xl">
                Log in
            </h2>

            <hr className='mt-5' />

            <h3 className='text-center text-2xl mt-10 mb-5  font-monomaniac'>
                Welcome back!
            </h3>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8 mx-10'>
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className='font-monomaniac text-xl'>Email</FormLabel>
                                <FormControl>
                                    <Input id='username' placeholder='username@123' className='text-lg' {...field} />
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
                                  <FormLabel className='font font-monomaniac text-xl'>
                                      Password
                                  </FormLabel>
                                  <FormControl>
                                    <Input id='password' type='password' className='text-lg' {...field} />
                                  </FormControl>
                                  <FormMessage className='text-xs text-red-600 '/>
                              </FormItem>
                        )}
                    />
                    <div className="flex justify-center w-full">
                        <Button type="submit" className='bg-yellow1 text-white md:w-36 md:h-14 text-xl md:text-2xl font-madimi hover:bg-yellow-300'>
                            Login
                        </Button>
                    </div>
                </form>
            </Form>
            <p className='text-center font-monomaniac text-xl mt-5 mb-24'>Don't have an account? <Link to='/user/signup' className='text-yellow1 hover:underline'>Sign up!</Link></p>
        </div>
    )
}

export default Login;