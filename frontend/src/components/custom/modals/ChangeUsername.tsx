// Hooks
import { useState, useEffect } from 'react';
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";

// Components
import { Button } from '../../shadcn/Button';
import { 
    Form, FormControl, FormField,
    FormItem, FormLabel, FormMessage 
  } from '../../shadcn/Form';
import { Input } from '../../shadcn/Input';
import {
    Dialog, DialogContent, DialogHeader,
    DialogTitle, DialogTrigger 
  } from "../../shadcn/Dialog";
import SuccessAlert from '../SuccessAlert';
import ErrorAlert from '../ErrorAlert';
import { Skeleton } from '../../shadcn/Skeleton';
import LoadingButton from '../LoadingButton'; 

// Others
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod"
import { changeUsernameSchema } from '../../../lib/schemas';
import { changeUsername } from '../../../lib/functions';

// Types
import { changeUsernameFormData, MessageResponseData } from '@/src/lib/types';


function ChangeUsername() {
    const [ success, setSuccess ] = useState<boolean>(false);
    const [ message, setMessage ] = useState<string>("");
    const [ error, setError ] = useState<boolean>(false);
    const [ loading, setLoading ] = useState<boolean>(false);

    // Get user from localstorage
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

    const form = useForm<z.infer<typeof changeUsernameSchema>>({
        resolver: zodResolver(changeUsernameSchema),
        defaultValues: {
            username: "",
        }
    })

    const mutation = useMutation({
      mutationFn: (username: string) => changeUsername(username),
      onSuccess: (data: MessageResponseData, username) => {
        localStorage.setItem('user', JSON.stringify({...user, username: username }))
        setMessage(data.message);
        handleSuccess();
      },
      onError: (errorResponse: MessageResponseData) => {
        console.error("Error fetching report:", errorResponse);
        setMessage(errorResponse.message);
        handleError();
      }
    })

    useEffect(() => {
        setLoading(mutation.isPending)
    }, [mutation])

    const onSubmit = async (values: z.infer<typeof changeUsernameSchema>) => {
        // console.log('Data:', values)
        try {
            mutation.mutate(values.username);
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
          }
        }}
      >
        <DialogTrigger 
          className='ml-7 hover:underline text-gray-600 text-base sm:text-lg dark:text-gray-400 dark:hover:text-gray-300 font-madimi'
        >
          Change username
        </DialogTrigger>
        <DialogContent className="bg-white dark:bg-gray-900 border dark:border-gray-700">
          <DialogHeader>
            <DialogTitle className='font-monomaniac text-xl sm:text-2xl md:text-3xl text-center dark:text-gray-300'>
              Change username
            </DialogTitle>
          </DialogHeader>
          {success && (
            <>
              <SuccessAlert content={message} />
            </>
          )}
          {error && (
            <ErrorAlert content={message} />
          )}
          <p className='ml-6 sm:ml-10 font-monomaniac text-sm sm:text-base'>
            Current username: {
              loading ? (
                <Skeleton />
              ) : (
                <span className='font-mono'>{user.username}</span>
              )
            }
          </p>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6 sm:space-y-8 mx-4 sm:mx-5 mt-4 sm:mt-5'>
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem className='flex items-center gap-2'>
                    <FormLabel className='font-monomaniac text-base sm:text-lg dark:text-gray-300'>
                      Username:
                    </FormLabel>
                    <FormControl>
                      <Input 
                        id='user-id'
                        placeholder='username123'
                        className='text-sm sm:text-lg'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className='text-xs text-red-500' />
                  </FormItem>
                )}
              />
              <div className="flex justify-center w-full">
                <LoadingButton
                  type="submit"
                  isLoading={loading}
                  text="Confirm"
                  className="bg-yellow1 px-4 sm:px-5 py-2 sm:py-3 text-sm sm:text-base rounded-md shadow-lg font-madimi 
                    text-white hover:bg-yellow-500 transition-colors duration-300"
                />
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default ChangeUsername;