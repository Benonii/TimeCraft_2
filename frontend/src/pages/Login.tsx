// Hooks
import { useMutation } from '@tanstack/react-query';
import { useRouter, Link } from '@tanstack/react-router';
import { useForm } from "react-hook-form";

// Components
import { Button } from '../components/shadcn/Button';
import { 
    Form, FormControl, FormField,
    FormItem, FormLabel,FormMessage
  } from '../components/shadcn/Form';
import { Input } from '../components/shadcn/Input';
import ErrorAlert from '../components/custom/ErrorAlert';
import { useState } from 'react';

// Types
import { LoginFormData, User, MessageResponseData,
    LoginResponseData 
  } from '../lib/types';

// Others
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { login } from '../lib/functions';


function Login () {
    const [ error, setError ] = useState<boolean>(false);
    const [ message, setMessage ] = useState<string>("");
    const router = useRouter();

    const handleError = () => {
        setError(true);
    
        setTimeout(() => {
          setError(false)
        }, 3000);
    }

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

    const mutation = useMutation({
        mutationFn: (formData: LoginFormData) => login(formData),
        onSuccess: (response: LoginResponseData) => {
            console.log('Login successful', response);
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));
            router.navigate({ to: '/' })
        },
        onError: (errorResponse: MessageResponseData) => {
            console.error('Login failed', errorResponse);
            setMessage(errorResponse.message);
            handleError()
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
            <h2 className="mt-10 text-center font-madimi font-semibold text-4xl dark:text-gray-300">
                Log in
            </h2>
            <hr className='mt-5 dark:border-gray-300' />

            <h3 className='text-center text-2xl mt-10 mb-5  font-monomaniac dark:text-gray-300'>
                Welcome back!
            </h3>
            <div className='flex w-full justify-center items-center'>
                {error && (
                <ErrorAlert content={message} />
                )}
            </div>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8 mx-10'>
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className='font-monomaniac text-xl dark:text-gray-300'>Email</FormLabel>
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
                                  <FormLabel className='font font-monomaniac text-xl dark:text-gray-300'>
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
            <p className='text-center font-monomaniac text-xl mt-5 mb-24 dark:text-gray-300'>Don't have an account? <Link to='/user/signup' className='text-yellow1 hover:underline'>Sign up!</Link></p>
        </div>
    )
}

export default Login;