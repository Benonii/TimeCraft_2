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
    Dialog, DialogContent, DialogDescription,
    DialogHeader, DialogTitle, DialogTrigger,
  } from "../../shadcn/Dialog";
import ErrorAlert from '../ErrorAlert';
import { Skeleton } from "../../shadcn/Skeleton";
import LoadingButton from "../LoadingButton";

// Types
import { TwtReport, TwtReportResponseData, TptFormData,
    MessageResponseData } 
  from '@/src/lib/types';

// Others
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { getTwt } from '../../../lib/functions';


function GetTotalWastedTime() {
    const [ success, setSuccess ] = useState<boolean>(false);
    const [ message, setMessage ] = useState<string>("");
    const [ error, setError ] = useState<boolean>(false);
    const [ loading, setLoading ] = useState<boolean>(false);

    // Get user from local storage
    const user = (() => {
        try {
          const storedUser = localStorage.getItem('user');
          return storedUser ? JSON.parse(storedUser) : null;
        } catch (error) {
          console.error("Failed to parse user data from localStorage:", error);
          return null;
        }
    })();

    const handleError = () => {
        setError(true);
    
        setTimeout(() => {
          setError(false)
        }, 3000);
    }
    
    const twtReportSchema = z.object({
        userId: user ? z.string().nullable() : z.string().length(36),
    })

    const form = useForm<z.infer<typeof twtReportSchema>>({
        resolver: zodResolver(twtReportSchema),
        defaultValues: {
            userId: user ? null : "",
        }
    })

    const [ report, setReport ] = useState<TwtReport>();

    const mutation = useMutation({
        mutationFn: (FormData: TptFormData) => getTwt(FormData, user),
        onSuccess: (data: TwtReportResponseData) => {
            console.log("Here is your report:", data )
            setReport(data.report);
            setSuccess(true);
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

    const onSubmit = async (values: z.infer<typeof twtReportSchema>) => {
        // console.log('Data:', transformedValues)
        const transformedValues = {
            ...values,
            userId: user ? user.id : values.userId, // Use userId from user object if logged in
        };
        // console.log('Data:', transformedValues)
        try {
            mutation.mutate(transformedValues);
        } catch(error) {
            console.error('Error submitting form:', error);
        }
    }

    const formContent = (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8 mx-10 mt-5'>
              {!user && (
                <FormField
                  control={form.control}
                  name="userId"
                  render={({ field }) => (
                      <FormItem>
                          <FormLabel className='font-monomaniac text-xl dark:text-gray-300'>User ID</FormLabel>
                          <FormControl>
                              <Input 
                                id='user-id'
                                placeholder='7d9f39b1-3a64-4dd8-b9f1-a0d28b1abc98'
                                className='text-lg' {...field}
                                value={field.value ?? undefined} />
                          </FormControl>
                          <FormMessage className='text-xs text-red-500' />
                      </FormItem>
                  )}
                />
              )}
                <div className="flex justify-center w-full">
                  <LoadingButton
                    type="submit"
                    isLoading={loading}
                    text="Create"
                  />
                </div>
            </form>
        </Form>
    )

    const reportContent = (
        <div className='flex flex-col ml-5 font-monomaniac border rounded-lg shadow-lg shadow-yellow1 p-4 mb-10'>
            <h3 className='ml-5 text-xl dark:text-gray-300'><span className='text-2xl'>Total wasted time:</span> <span className='text-red-500'>{report?.twt.toFixed(2)} hours</span></h3>
            <Button
              variant='outline'
              className='w-20 h-10 mt-2 text-lg font-madimi text-black hover:text-white hover:bg-yellow1 dark:text-gray-300 dark:border-gray-400'
              onClick={() => {
                setSuccess(false)
                setLoading(false)
              }}
            >
              Back
            </Button>
      </div>
    )
  return (
    <div>
      <Dialog>
        <DialogTrigger 
          className='ml-2 bg-yellow1 px-4 py-2 md:py-6 rounded-md shadow-lg font-madimi text-white md:text-4xl md:px-7 h-fit hover:bg-yellow-300'
        >
          Get report
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className='font-monomaniac text-3xl text-center'>Total Wasted time</DialogTitle>
            <DialogDescription className='ml-10 text-lg font-monomaniac'>
                Get your total wasted time. Needs User Id if not signed in.
            </DialogDescription>
          </DialogHeader>
          {error && (
            <ErrorAlert content={message} />
          )}
          {success ? (
            reportContent
            ) : loading ? (
                <div className='flex flex-col gap-2 items-justify'>
                  <Skeleton className="w-[150px] h-[25px] rounded-full ml-20" />
                  <Skeleton className="w-[250px] h-[20px] rounded-full ml-20" />
                  <Skeleton className="w-[250px] h-[20px] rounded-full ml-20" />
                  <Skeleton className="w-[250px] h-[20px] rounded-full ml-20" />

                </div>
              ) : (
                formContent
            ) 
          }
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default GetTotalWastedTime
