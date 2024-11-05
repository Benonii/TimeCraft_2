// Hooks
import { useEffect, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useRouter, Link } from '@tanstack/react-router';
import { useForm } from "react-hook-form";

// Components
import { Button } from '../components/shadcn/Button';
import { 
    Form, FormControl, FormField,
    FormItem, FormLabel, FormMessage
} from '../components/shadcn/Form';
import { Input } from '../components/shadcn/Input';
import ErrorAlert from '../components/custom/ErrorAlert';
import LoadingButton from '../components/custom/LoadingButton';

// Types
import { SignupFormData, MessageResponseData } from '../lib/types';

// Others
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { signupSchema  } from '../lib/schemas';
import { signup } from '../lib/functions';


function Signup () {
    const [ error, setError ] = useState<boolean>(false);
    const [ message, setMessage ] = useState<string>("");
    const [ loading, setLoading ] = useState<boolean>(false);

    const handleError = () => {

        setError(true);
    
        setTimeout(() => {
          setError(false)
        }, 5000);
    }

    const form = useForm<z.infer<typeof signupSchema>>({
        resolver: zodResolver(signupSchema),
        defaultValues: {
            email: "",
            username: "",
            weekly_hours: 0,
            work_days: 0,
            password: "",
            confirmPassword: "",
        }
    })

    const router = useRouter();

    const mutation = useMutation({
        mutationFn: (FormData: SignupFormData) => signup(FormData),
        onSuccess: (response: MessageResponseData) => {
            // console.log('Signup successful', response);
            router.navigate({ to: '/user/login' })
        },
        onError: (errorResponse: MessageResponseData) => {
            console.error('Signup failed', error);
            setMessage(errorResponse.message);
            handleError();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            })
        }
    });

    useEffect(() => {
        setLoading(mutation.isPending);
    })

    async function onSubmit(values: z.infer<typeof signupSchema>) {
        const transformedValues = {
            ...values,
            weekly_hours: Number(values.weekly_hours),
            work_days: Number(values.work_days),
        };
        // console.log('Data:', transformedValues)
        try {
            mutation.mutate(transformedValues);
        } catch(error) {
            console.error('Error submitting form:', error);
        }
    }

    return (
        <div className="flex flex-col justify-center max-w-[600px] min-h-full mx-auto mt-48 rounded-md shadow-lg min-w-56">
            <h2 className="mt-10 text-center font-madimi font-semibold text-4xl dark:text-gray-300">
                Sign up
            </h2>

            <hr className='mt-5 dark:border-gray-300' />

            <h3 className='text-center text-2xl mt-10 mb-5  font-monomaniac dark:text-gray-300'>
                Welcome!
            </h3>
            <div className='flex w-full justify-center items-center'>
                {error && (
                <ErrorAlert content={message} />
                )}
            </div>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8 mx-10 mt-5'>
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className='font-monomaniac text-xl dark:text-gray-300' >Email</FormLabel>
                                <FormControl>
                                    <Input id='email' placeholder='example@email.com' className='text-lg' {...field} />
                                </FormControl>
                                <FormMessage className='text-xs text-redd-500' />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="username"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className='font-monomaniac text-xl dark:text-gray-300' >Username</FormLabel>
                                <FormControl>
                                    <Input id='username' placeholder='user1234' className='text-lg' {...field} />
                                </FormControl>
                                <FormMessage className='text-xs text-redd-500' />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="weekly_hours"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className='font-monomaniac text-xl dark:text-gray-300'>
                                  Weekly work hours goal
                                </FormLabel>
                                <FormControl>
                                    <Input id='weekly-hours' type='number' placeholder='60' className='text-lg' {...field} />
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
                                <FormLabel className='font-monomaniac text-xl dark:text-gray-300' >
                                    Number of work days
                                </FormLabel>
                                <FormControl>
                                  <Input id='work-days' type='number' placeholder='5' className='text-lg' {...field} />
                                </FormControl>
                                <FormMessage className='text-xs text-red-600 '/>
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className='font-monomaniac text-xl dark:text-gray-300'>
                                    Password
                                </FormLabel>
                                <FormControl>
                                  <Input id='password' type='password' className='text-lg' {...field} />
                                </FormControl>
                                <FormMessage className='text-xs text-red-600 '/>
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="confirmPassword"
                        render={({ field }) => (
                            <FormItem>
                                  <FormLabel className='font-monomaniac text-xl dark:text-gray-300' >
                                      Confirm password
                                  </FormLabel>
                                  <FormControl>
                                    <Input id='confirmPassword' type='password' className='text-lg' {...field} />
                                  </FormControl>
                                  <FormMessage className='text-xs text-red-600 ' />
                              </FormItem>
                        )}
                    />
                    <div className="flex justify-center w-full">
                      <LoadingButton
                        type="submit"
                        isLoading={loading}
                        text="Signup"
                      />
                    </div>
                </form>
            </Form>
            <p className='text-center font-monomaniac text-xl mt-5 mb-24 dark:text-gray-300'>Already have an account? <Link to='/user/login' className='text-yellow1 hover:underline'>Login!</Link></p>
        </div>
    )
}

export default Signup;