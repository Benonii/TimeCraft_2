// Hooks
import { useEffect, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useRouter, Link } from '@tanstack/react-router';
import { useForm } from "react-hook-form";

// Components
import { 
    Form, FormControl, FormField,
    FormItem, FormLabel, FormMessage
} from '../components/shadcn/Form';
import { Input } from '../components/shadcn/Input';
import ErrorAlert from '../components/custom/ErrorAlert';
import LoadingButton from '../components/custom/LoadingButton';

// Types
import { SignupFormData, LoginResponseData, MessageResponseData } from '../lib/types';

// Others
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { signupSchema  } from '../lib/schemas';
import { signup } from '../lib/functions';


function Signup () {
    const [ error, setError ] = useState<boolean>(false);
    const [ message, setMessage ] = useState<string>("");
    const [ loading, setLoading ] = useState<boolean>(false);
    const [ password, setPassword ] = useState<string>("");

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
        onSuccess: (response: LoginResponseData) => {
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));
            router.navigate({ to: '/' })
        },
        onError: (errorResponse: MessageResponseData) => {
            console.error('Signup failed', errorResponse?.message);
            setMessage('An error occurred. Please try again.');
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

    // Extract password validation rules from the signupSchema
    const passwordSchema = signupSchema.innerType().shape.password;
    const passwordRequirements = [
        { label: "At least 8 characters", test: (pw: string) => pw.length >= 8 },
        { label: "At least one uppercase letter", test: (pw: string) => /[A-Z]/.test(pw) },
        { label: "At least one lowercase letter", test: (pw: string) => /[a-z]/.test(pw) },
        { label: "At least one number", test: (pw: string) => /\d/.test(pw) },
        { label: "At least one special character", test: (pw: string) => /[!@#$%^&*(),.?":{}|<>]/.test(pw) },
    ];

    const onPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value);
    };

    async function onSubmit(values: z.infer<typeof signupSchema>) {
        const transformedValues = {
            ...values,
            weekly_work_hours_goal: Number(values.weekly_work_hours_goal),
            number_of_work_days: Number(values.number_of_work_days),
        };
        try {
            mutation.mutate(transformedValues);
        } catch(error) {
            console.error('Error submitting form:', error);
        }
    }

    return (
        <div className='flex flex-col items-center mt-20'>
            <div className="max-w-[500px] w-[90vw] min-w-[300px] bg-white dark:bg-gray-900 rounded-xl 
                shadow-lg dark:shadow-yellow1/60 border border-gray-200 dark:border-gray-700 p-8 transition-all duration-300 hover:shadow-xl"
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
                    <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6 mx-10'>
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
                                            placeholder='example@email.com'
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
                            name="full_name"
                            render={({ field }) => (
                                <FormItem className="mt-4">
                                    <FormLabel className='font-monomaniac text-xl dark:text-gray-300'>
                                        Full Name
                                    </FormLabel>
                                    <FormControl>
                                        <Input 
                                            placeholder='John Doe'
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
                            name="username"
                            render={({ field }) => (
                                <FormItem className="mt-4">
                                    <FormLabel className='font-monomaniac text-xl dark:text-gray-300'>
                                        Username
                                    </FormLabel>
                                    <FormControl>
                                        <Input 
                                            placeholder='user1234'
                                            className='text-lg'
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage className='text-xs text-red-600' />
                                </FormItem>
                            )}
                        />

                        <div className="grid grid-cols-2 gap-4 mt-4">
                            <FormField
                                control={form.control}
                                name="weekly_work_hours_goal"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className='font-monomaniac text-xl dark:text-gray-300'>
                                            Weekly hours
                                        </FormLabel>
                                        <FormControl>
                                            <Input 
                                                type='number'
                                                placeholder='60'
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
                                name="number_of_work_days"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className='font-monomaniac text-xl dark:text-gray-300'>
                                            Work days
                                        </FormLabel>
                                        <FormControl>
                                            <Input 
                                                type='number'
                                                placeholder='5'
                                                className='text-lg'
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage className='text-xs text-red-600' />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem className="mt-4">
                                    <FormLabel className='font-monomaniac text-xl dark:text-gray-300'>
                                        Password
                                    </FormLabel>
                                    <FormControl>
                                        <Input 
                                            type='password'
                                            className='text-lg'
                                            {...field}
                                            onChange={(e) => {
                                                field.onChange(e);
                                                onPasswordChange(e);
                                            }}
                                        />
                                    </FormControl>
                                    <FormMessage className='text-xs text-red-600' />
                                    <ul className="mt-2 space-y-1">
                                        {passwordRequirements.map((req, index) => (
                                            <li key={index} className="flex items-center text-sm">
                                                <span className={`mr-2 ${req.test(password) ? 'text-green-500' : 'text-gray-500'}`}>
                                                    {req.test(password) ? '✔' : '✖'}
                                                </span>
                                                <span className={req.test(password) ? 'text-green-500' : 'text-gray-500'}>
                                                    {req.label}
                                                </span>
                                            </li>
                                        ))}
                                    </ul>
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="confirmPassword"
                            render={({ field }) => (
                                <FormItem className="mt-4">
                                    <FormLabel className='font-monomaniac text-xl dark:text-gray-300'>
                                        Confirm password
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
                                className="bg-yellow1 px-5 py-3 rounded-md shadow-lg font-madimi 
                                    text-white hover:bg-yellow-500 transition-colors duration-300"
                            />
                        </div>
                    </form>
                </Form>

                <p className='text-center font-monomaniac text-xl mt-5 mb-10 dark:text-gray-300'>
                    Already have an account? <Link to='/user/login' className='text-yellow1 hover:underline transition-colors duration-300'>
                        Log in!
                    </Link>
                </p>
            </div>
        </div>
    );
}

export default Signup;