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
import ErrorAlert from '../components/custom/ErrorAlert';
import { useState } from 'react';

function Signup () {
    const api = process.env.REACT_APP_API_URL;
    const [ error, setError ] = useState<boolean>(false);
    const [ message, setMessage ] = useState<string>("");
    const signupSchema = z.object({
        email: z.string().email(),
        username: z.string().min(2, 'Username can not be empty'),
        weekly_hours: z.coerce.number().min(1, { message: "Weekly work hours goal is too low" }),
        work_days: z.coerce.number().min(1, { message: "Number of work days is too low" })
                                       .max(7, { message: "Number of work days is too high" }),
        password: z.string().regex(/[a-z]/, {message: "Password must contain at least one lowercase letter"})
        .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter" })
        .regex(/[0-9]/, { message: "Password must contain at least one number" })
        .regex(/[!@#$%^&*(),.?":{}|<>]/, { message: "Password must contain at least one special character" })
        .min(8, 'Password must be at least 8 characters long'),
        confirmPassword: z.string(),
    }).refine((data) => data.password === data.confirmPassword, {
        message: "Passwords do not match",
        path: ["confirmPassword"],
    });

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

    const handleError = () => {

        setError(true);
    
        setTimeout(() => {
          setError(false)
        }, 5000);
    }


    type User = {
        email: string,
        username: string,
        id: string,
        weekly_hours: string,
        work_days: string,
        total_wasted_time: number,
        total_productive_time:  number,
    }

    type FormData = {
        email: string,
        username: string,
        weekly_hours: number,
        work_days: number,
        password: string,
        confirmPassword: string,
    }

    type ResponseData = {
        message: string,
    }

    type ErrorReseponse = {
        message: string
    }

    const router = useRouter();

    const mutation = useMutation({
        mutationFn: async (formData: FormData) => {
            const params = new URLSearchParams();
            params.append('email', formData.email);
            params.append('username', formData.username);
            params.append('weekly_hours', String(formData.weekly_hours))
            params.append('work_days', String(formData.work_days))
            params.append('password', formData.password)
            const response = await fetch(`${api}/signup`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: params.toString()
            })

            const resJSON = await response.json();
            if (!response.ok) {
              // console.log(response)
              throw new Error(resJSON.message || 'An error occured');
            }

        return resJSON;
        },
        onSuccess: (response: ResponseData) => {
            console.log('Signup successful', response);
            router.navigate({ to: '/user/login' })
        },
        onError: (errorResponse: ErrorReseponse) => {
            console.error('Signup failed', error);
            setMessage(errorResponse.message);
            handleError();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            })
        }
    });

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
            <h2 className="mt-10 text-center font-madimi font-semibold text-4xl">
                Sign up
            </h2>

            <hr className='mt-5' />

            <h3 className='text-center text-2xl mt-10 mb-5  font-monomaniac'>
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
                                <FormLabel className='font-monomaniac text-xl' >Email</FormLabel>
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
                                <FormLabel className='font-monomaniac text-xl' >Username</FormLabel>
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
                                  <FormLabel className='font-monomaniac text-xl'>
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
                                  <FormLabel className='font-monomaniac text-xl' >
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
                                  <FormLabel className='font-monomaniac text-xl'>
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
                                  <FormLabel className='font-monomaniac text-xl' >
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
                        <Button type="submit" className='bg-yellow1 text-white md:w-36 md:h-14 text-xl md:text-2xl font-madimi hover:bg-yellow-300'>
                            Sign up
                        </Button>
                    </div>
                </form>
            </Form>
            <p className='text-center font-monomaniac text-xl mt-5 mb-24'>Already have an account? <Link to='/user/login' className='text-yellow1 hover:underline'>Login!</Link></p>
        </div>
    )
}

export default Signup;