import { useState } from 'react';
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
import CustomTooltip from '../CustomTooltip';
import { HelpCircle } from 'lucide-react';
import SuccessAlert from '../SuccessAlert';
import ErrorAlert from '../ErrorAlert';
import IdDisplay from '../IdDisplay';
import { Label } from '../../shadcn/Label';
import { NewUserFormData, NewUserResponseData,
         MessageResponseData } from '@/src/lib/types';
import { createUser } from '@/src/lib/functions';

export default function CreateUser() {
    const [ success, setSuccess ] = useState<boolean>(false);
    const [ error, setError ] = useState<boolean>(false);
    const [ message, setMessage ] = useState<string>("");
    const [ id, setId ] = useState<string>("");

    const user = (() => {
      try {
        const storedUser = localStorage.getItem('user');
        return storedUser ? JSON.parse(storedUser) : null;
      } catch (error) {
        console.error("Failed to parse user data from localStorage:", error);
        return null;
      }
    })();

    const handleSuccess = () => {
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false)
      }, 3000);
    }

    const handleError = () => {
      setError(true);
      setTimeout(() => {
        setError(false)
      }, 3000);
    }
  
    const newUserSchema = z.object({
      username: z.string().min(2),
      weekly_hours_goal: z.coerce.number().min(1).max(100),
      work_days: z.coerce.number().min(1).max(7)
    })

    const form = useForm<z.infer<typeof newUserSchema>>({
      resolver: zodResolver(newUserSchema),
      defaultValues: {
        username: "",
        weekly_hours_goal: 0,
        work_days: 0,
      }
    })

    const mutation = useMutation({
      mutationFn: (formData: NewUserFormData ) => createUser(formData, user),
      onSuccess: (response: NewUserResponseData) => {
      console.log('New user created successfully', response);
      setMessage(response.message);
      setId(response.data.user_id);
      handleSuccess();
      },
      onError: ( error: MessageResponseData ) => {
        console.error('Failed to create task', error);
        setMessage(error.message);
        handleError();
      }
    });

  // console.log("Success", success)

  async function onSubmit(values: z.infer<typeof newUserSchema>) {
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
      <Dialog
        onOpenChange={(open) => {
          if (!open) {
            form.reset();     // Reset form when dialog closes
            setMessage("");   // Clear any existing messages
            setId("");
          }
        }}
      >       
       <DialogTrigger 
          className='ml-2 px-4 py-2 md:py-6 h-fit
                    bg-transparent border rounded-md shadow-lg hover:border-black hover:text-black dark:hover:bg-white dark:text-gray-200 dark:hover:text-gray-600
                    text-lg font-madimi text-gray-600 md:text-3xl md:px-7'
          >
          Create user
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className='font-monomaniac text-3xl text-center dark:text-gray-300'>Create a user</DialogTitle>
            <DialogDescription className='ml-10 text-lg font-monomaniac dark:text-gray-400'>
              Create a simple user without an email and a password.
              Copy the user Id. You will need it
            </DialogDescription>
          </DialogHeader>
          {success && (
            <>
              <SuccessAlert content={message} />
            </>
          )}
          {error && (
            <ErrorAlert content={message} />
          )}
          {id.length > 0 && (
            <div className=''>
              <Label htmlFor="id" className='ml-10 font-monomaniac text-gray-700 h-fit dark:text-gray-300'>User Id</Label>
              <IdDisplay id={id} />
            </div>
          )}
          <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8 mx-10 mt-5'>
                  {!user && (
                    <FormField
                      control={form.control}
                      name="username"
                      render={({ field }) => (
                          <FormItem>
                              <FormLabel className='font-monomaniac text-xl dark:text-gray-300'>Username</FormLabel>
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
                                  <FormLabel className=' flex items-center gap-1 font font-monomaniac text-xl dark:text-gray-300'>
                                      Weekly goal
                                      <CustomTooltip content="How many hours per week are you aiming to work?">
                                        <HelpCircle className='w-4 h-4 mt-1 text-gray-600 dark:text-gray-300'/>
                                      </CustomTooltip>
                                  </FormLabel>
                                  <FormControl>
                                    <Input id='weekly-goal' type='number' className='text-lg' {...field} />
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
                                  <FormLabel className='flex items-center gap-1 font font-monomaniac text-xl dark:text-gray-300'>
                                      Numebr of work days
                                      <CustomTooltip content="How many days per week are you aiming to work?">
                                        <HelpCircle className='w-4 h-4 mt-1 text-gray-600 dark:text-gray-300'/>
                                      </CustomTooltip>
                                  </FormLabel>
                                  <FormControl>
                                    <Input id='daily-goal' type='number' className='text-lg' {...field} />
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

