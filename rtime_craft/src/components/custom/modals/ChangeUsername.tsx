import { useState, useEffect } from 'react';
import { useMutation } from "@tanstack/react-query";
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
import SuccessAlert from '../SuccessAlert';
import ErrorAlert from '../ErrorAlert';
import { Skeleton } from '../../shadcn/Skeleton';
import { changeUsername } from '@/src/lib/functions';
import { changeUsernameFormData, MessageResponseData } from '@/src/lib/types';
import { changeUsernameSchema } from '@/src/lib/schemas';

function ChangeUsername() {
    const [ success, setSuccess ] = useState<boolean>(false);
    const [ message, setMessage ] = useState<string>("");
    const [ error, setError ] = useState<boolean>(false);
    const [ loading, setLoading ] = useState<boolean>(false);

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
      mutationFn: (formData: changeUsernameFormData) => changeUsername(formData, user),
      onSuccess: (data: MessageResponseData, formData) => {
        console.log("Here is your report:", data )
        localStorage.setItem('user', JSON.stringify({...user, username: formData?.username }))
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
        console.log('Data:', values)
        try {
            mutation.mutate(values);
        } catch(error) {
            console.error('Error submitting form:', error);
        }
    }

  return (
    <div>
      <Dialog>
        <DialogTrigger 
          className='ml-7 hover:underline text-gray-600 text-lg dark:text-gray-400 dark:hover:text-gray-300'
        >
          Change username
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className='font-monomaniac text-3xl text-center dark:text-gray-300'>Change username</DialogTitle>
          </DialogHeader>
            {success && (
              <>
                <SuccessAlert content={message} />
              </>
            )}
            {error && (
              <ErrorAlert content={message} />
            )}
            <p className='ml-10 font font-monomaniac'>Current username: {
              loading ? (
                <Skeleton />
              ) : (
              <span className='font-mono'>{user.username}</span>
              )
              }
            </p>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8 mx-5 mt-5'>
                    <FormField
                      control={form.control}
                      name="username"
                      render={({ field }) => (
                          <FormItem className='flex items-center gap-2'>
                              <FormLabel className='font-monomaniac text-lg dark:text-gray-300'>Username: </FormLabel>
                              <FormControl>
                                  <Input 
                                    id='user-id'
                                    placeholder='username123'
                                    className='text-lg' {...field}
                                  />
                              </FormControl>
                              <FormMessage className='text-xs text-red-500' />
                          </FormItem>
                      )}
                    />
                    <div className="flex justify-center w-full">
                        <Button type="submit" className='bg-yellow1 px-2 text-white md:w-36 md:h-14 text-lg md:text-xl font-madimi hover:bg-yellow-300'>
                            Save changes
                        </Button>
                    </div>
                </form>
            </Form>
          
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default ChangeUsername;