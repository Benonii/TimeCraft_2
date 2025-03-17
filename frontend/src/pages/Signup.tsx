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
            full_name: "",
            username: "",
            weekly_work_hours_goal: 0,
            number_of_work_days: 0,
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
            console.error('Signup failed', errorResponse?.message);
            setMessage('An error occured. Please try again.');
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
            weekly_work_hours_goal: Number(values.weekly_work_hours_goal),
            number_of_work_days: Number(values.number_of_work_days),
        };
        // console.log('Data:', transformedValues)
        try {
            mutation.mutate(transformedValues);
        } catch(error) {
            console.error('Error submitting form:', error);
        }
    }

    return (
        <div className='flex flex-col items-center mt-20'>
            <div className="max-w-[500px] w-[90vw] min-w-[300px] bg-white dark:bg-gray-900 rounded-xl 
                shadow-lg border border-gray-200 dark:border-gray-700 p-8 transition-all duration-300 hover:shadow-xl"
            >
                <h2 className="font-madimi text-2xl md:text-3xl lg:text-4xl text-center mb-6 dark:text-gray-300">
                    Sign up
                </h2>

                <hr className='border-gray-200 dark:border-gray-700 mb-8' />

                <h3 className='text-center text-2xl mt-10 mb-5 font-monomaniac dark:text-gray-300'>
                    Create your account
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
                            name="username"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className='font-monomaniac text-xl dark:text-gray-300'>
                                        Username
                                    </FormLabel>
                                    <FormControl>
                                        <Input 
                                            placeholder='johndoe'
                                            className='text-lg'
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage className='text-xs text-red-600' />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className='font-monomaniac text-xl dark:text-gray-300'>
                                        Email
                                    </FormLabel>
                                    <FormControl>
                                        <Input 
                                            placeholder='username@123'
                                            className='text-lg'
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage className='text-xs text-red-600' />
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
                                        <Input 
                                            type='password'
                                            className='text-lg'
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
                                text="Sign up"
                            />
                        </div>
                    </form>
                </Form>

                <p className='text-center font-monomaniac text-xl mt-5 mb-24 dark:text-gray-300'>
                    Already have an account? <Link to='/user/login' className='text-yellow1 hover:underline'>
                        Log in!
                    </Link>
                </p>
            </div>
        </div>
    );
}

export default Signup;