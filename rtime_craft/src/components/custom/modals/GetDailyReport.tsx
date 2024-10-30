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
import { DatePicker } from '../../shadcn/DatePicker';


function GetDailyReport() {
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

    const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

    
    const dailyReportSchema = z.object({
        userId: user ? z.string().nullable() : z.string().length(36),
        date: z.date(),
    })

    const form = useForm<z.infer<typeof dailyReportSchema>>({
        resolver: zodResolver(dailyReportSchema),
        defaultValues: {
            userId: user ? null : "",
            date: new Date()
        }
    })

    type FormData = {
        userId: string,
        date: Date,
    }

    type ResponseData = {
        message: string,
        data: {
            date: Date
            ttot_day: number,
            twt_day: number,
        }
    }

    const getReport = async (formData: FormData) => {
        const params = new URLSearchParams();
        params.append('userId', user ? user.id : formData.userId)
        const localDate = new Date(formData.date);
        const year = localDate.getFullYear();
        const month = String(localDate.getMonth() + 1).padStart(2, '0');
        const day = String(localDate.getDate()).padStart(2, '0');
        
        const formattedDate = `${year}-${month}-${day}`
        console.log(formattedDate);
        params.append('date', formattedDate)
        console.log("Params:", params.toString());

        const response = await fetch(`${api}/report/daily`, {
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
        onSuccess: (data) => {
            console.log("Here is your report:", data )
        },
        onError: (error) => {
            console.error("Error fetching report:", error)
        }
    })

    const onSubmit = async (values: z.infer<typeof dailyReportSchema>) => {
        const transformedValues = {
            ...values,
            userId: user ? user.id : values.userId, // Use userId from user object if logged in
            date: selectedDate || values.date,
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
            <DialogTitle className='font-monomaniac text-3xl text-center'>Daily Report</DialogTitle>
            <DialogDescription className='ml-10 text-lg font-monomaniac'>
                Get your daily report by picking a date. Needs User Id if not signed in.
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
                    <FormField
                        control={form.control}
                        name="date"
                        render={({ field }) => (
                            <FormItem>
                                  <FormLabel className='font font-monomaniac text-xl mr-1'>
                                      Date:
                                  </FormLabel>
                                  <FormControl>
                                    <DatePicker date={selectedDate} onDateChange={setSelectedDate} />
                                  </FormControl>
                                  <FormMessage className='text-xs text-red-600 '/>
                              </FormItem>
                        )}
                    />
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

export default GetDailyReport
