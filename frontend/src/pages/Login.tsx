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
import { useEffect, useState } from 'react';
import LoadingButton from '../components/custom/LoadingButton';

// Types
import { LoginFormData, MessageResponseData,
    LoginResponseData 
  } from '../lib/types';

// Others
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { login } from '../lib/functions';


function Login () {
    const [ error, setError ] = useState<boolean>(false);
    const [ message, setMessage ] = useState<string>("");
    const [ loading, setLoading ] = useState<boolean>(false);
    const router = useRouter();

    const handleError = () => {
        setError(true);
    
        setTimeout(() => {
          setError(false)
        }, 5000);
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
            // console.log('Login successful', response);
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

    useEffect(() => {
        setLoading(mutation.isPending);
    }, [mutation]);

    async function onSubmit(values: z.infer<typeof loginSchema>) {
        // console.log(values);
        try {
            mutation.mutate(values);
        } catch(error) {
            console.error('Error submitting form:', error);
        }
    }

    return (
        <div className='flex flex-col items-center mt-20'>
            <div className="max-w-[500px] w-[90vw] min-w-[300px] bg-white dark:bg-gray-900 rounded-xl 
                shadow-lg dark:shadow-yellow1/60 border border-gray-200 dark:border-gray-700 p-8 sm:p-8 p-6 transition-all duration-300 hover:shadow-xl"
            >
                <h2 className="font-madimi text-xl sm:text-2xl md:text-3xl lg:text-4xl text-center mb-6 dark:text-gray-300">
                    Log in
                </h2>

                <hr className='border-gray-200 dark:border-gray-700 mb-6 sm:mb-8' />

                <h3 className='text-center text-lg sm:text-2xl mt-8 mb-4 sm:mt-10 sm:mb-5 font-monomaniac dark:text-gray-300'>
                    Welcome back!
                </h3>

                <div className='flex w-full justify-center items-center'>
                    {error && <ErrorAlert content={message} />}
                </div>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6 sm:space-y-8 mx-4 sm:mx-10'>
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className='font-monomaniac text-base sm:text-xl dark:text-gray-300'>
                                        Email
                                    </FormLabel>
                                    <FormControl>
                                        <Input 
                                            id='username' 
                                            placeholder='username@123' 
                                            className='text-base sm:text-lg' 
                                            {...field} 
                                        />
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
                                    <FormLabel className='font-monomaniac text-base sm:text-xl dark:text-gray-300'>
                                        Password
                                    </FormLabel>
                                    <FormControl>
                                        <Input 
                                            id='password' 
                                            type='password' 
                                            className='text-base sm:text-lg' 
                                            {...field} 
                                        />
                                    </FormControl>
                                    <FormMessage className='text-xs text-red-600' />
                                </FormItem>
                            )}
                        />
                        <div className="flex justify-center w-full">
                            <LoadingButton
                                type="submit"
                                isLoading={loading}
                                text="Login"
                                className="bg-yellow1 px-4 sm:px-5 py-2 sm:py-3 text-sm sm:text-base rounded-md shadow-lg font-madimi 
                                    text-white hover:bg-yellow-500 transition-colors duration-300"
                            />
                        </div>
                    </form>
                </Form>
                <p className='text-center font-monomaniac text-base sm:text-xl mt-4 sm:mt-5 mb-16 sm:mb-24 dark:text-gray-300'>
                    Don't have an account? <Link to='/user/signup' className='text-yellow1 hover:underline'>Sign up!</Link>
                </p>
            </div>
        </div>
    );
}

export default Login;