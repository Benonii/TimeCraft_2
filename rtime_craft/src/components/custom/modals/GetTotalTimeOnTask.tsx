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
import TaskPicker from '../TaskPicker';



function GetTotalTimeOnTask() {
    const api = process.env.REACT_APP_API_URL;
    const user = (() => {
        try {
          const storedUser = localStorage.getItem('user');
          return storedUser ? JSON.parse(storedUser) : null;
        } catch (error) {
          console.error("Failed to parse user data from localStorage:", error);
          return null;
        }
    })();
    
    const ttotReportSchema = z.object({
        userId: user ? z.string().nullable() : z.string().length(36),
        taskId: user ? z.string().nullable() : z.string().length(36),
        taskName: user ? z.string().min(2) : z.string().nullable(),
    })

    const form = useForm<z.infer<typeof ttotReportSchema>>({
        resolver: zodResolver(ttotReportSchema),
        defaultValues: {
            userId: user ? null : "",
            taskId: user ? null : "",
            taskName: user ? "" : null,
        }
    })

    type FormData = {
        userId: string,
        taskId: string | null,
        taskName: string | null,
    }

    type ResponseData = {
        message: string,
        data: {
            ttot: number
        }
    }

    const getReport = async (formData: FormData) => {
        const params = new URLSearchParams();
        params.append('userId', user ? user.id : formData.userId)
        user ? params.append('taskName', formData.taskName !)
             : params.append('taskId', formData.taskId !) 
        console.log("Params:", params.toString());

        const response = await fetch(`${api}/tasks/total`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: params.toString(),
        })

        if (!response.ok) {
            throw new Error('Network Error');
        }

        return await response.json();
    }

    const mutation = useMutation({
        mutationFn: getReport,
        onSuccess: (data: ResponseData) => {
            console.log("Here is your report:", data )
        },
        onError: (error: Error) => {
            console.error("Error fetching report:", error)
        }
    })

    const onSubmit = async (values: z.infer<typeof ttotReportSchema>) => {
        // console.log('Data:', transformedValues)
        const transformedValues = {
            ...values,
            userId: user ? user.id : values.userId, // Use userId from user object if logged in
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
      <Dialog>
        <DialogTrigger 
          className='ml-2 bg-yellow1 px-4 py-2 md:py-6 rounded-md shadow-lg font-madimi text-white md:text-4xl md:px-7 h-fit'
        >
          Get report
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className='font-monomaniac text-3xl text-center'>Total Time on Task</DialogTitle>
            <DialogDescription className='ml-10 text-lg font-monomaniac'>
                Get total (productive) time on one task. Needs User Id if not signed in.
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8 mx-10 mt-5'>
                  {!user && (
                    <FormField
                      control={form.control}
                      name="userId"
                      render={({ field }) => (
                          <FormItem>
                              <FormLabel className='font-monomaniac text-xl'>User ID</FormLabel>
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
                  {user ? (
                    <FormField
                      control={form.control}
                      name="taskName"
                      render={({ field }) => (
                          <FormItem>
                              <FormLabel className='font font-monomaniac text-xl'>
                                 Task name
                              </FormLabel>
                              <FormControl aria-disabled={true}>
                                <TaskPicker
                                  userId={user?.id}
                                  onSelect={(value: string) => form.setValue('taskName', value)}
                                />
                              </FormControl>
                              <FormMessage className='text-xs text-red-600 '/>
                          </FormItem>
                      )}
                    />
                    ) : (
                        <FormField
                          control={form.control}
                          name="taskId"
                          render={({ field }) => (
                              <FormItem>
                                  <FormLabel className='font-monomaniac text-xl'>Task ID</FormLabel>
                                  <FormControl>
                                      <Input
                                        id='user-id'
                                        placeholder='7d9f39b1-3a64-4dd8-b9f1-a0d28b1abc98'
                                        className='text-lg' {...field}
                                        value={field.value ?? undefined} />
                                  </FormControl>
                                  <FormMessage className='text-xs text-redd-500' />
                              </FormItem>
                          )}
                        />
                    )}
                    <div className="flex justify-center w-full">
                        <Button type="submit" className='bg-yellow1 text-white md:w-36 md:h-14 text-xl md:text-2xl font-madimi hover:bg-yellow-300'>
                            Get report
                        </Button>
                    </div>
                </form>
            </Form>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default GetTotalTimeOnTask
