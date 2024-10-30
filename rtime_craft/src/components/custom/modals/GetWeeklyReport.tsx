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
import ErrorAlert from '../ErrorAlert';
import { Skeleton } from "../../shadcn/Skeleton";


function GetWeeklyReport() {
    const api = process.env.REACT_APP_API_URL;
    const [ success, setSuccess ] = useState<boolean>(false);
    const [ message, setMessage ] = useState<string>("");
    const [ error, setError ] = useState<boolean>(false);
    const [ loading, setLoading ] = useState<boolean>(false);
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

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
    
    const weeklyReportSchema = z.object({
        userId: user ? z.string().nullable() : z.string().length(36),
        date: z.date(),
    })

    const form = useForm<z.infer<typeof weeklyReportSchema>>({
        resolver: zodResolver(weeklyReportSchema),
        defaultValues: {
            userId: user ? null : "",
            date: new Date()
        }
    })

    type FormData = {
        userId: string,
        date: Date,
    }

    type Report = {
      tasks: [
        task: {
          name: string
          ttot: number
        }
      ]
      ttot_week: number,
      twt_week: number,
      start_date: string,
      end_date: string,
    }

    type ResponseData = {
      report: Report
    }

    type ErrorResponse = {
      message: string
    }

    const [ report, setReport ] = useState<Report>();

    const getReport = async (formData: FormData) => {
        const params = new URLSearchParams();
        params.append('userId', user ? user.id : formData.userId)
        const localDate = new Date(formData.date);
        const year = localDate.getFullYear();
        const month = String(localDate.getMonth() + 1).padStart(2, '0');
        const day = String(localDate.getDate()).padStart(2, '0');
        
        const formattedDate = `${year}-${month}-${day}`
        // console.log(formattedDate);
        params.append('date', formattedDate)
        // console.log("Params:", params.toString());

        const response = await fetch(`${api}/report/weekly`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: params.toString(),
        })

        const resJSON = await response.json();
        if (!response.ok) {
          // console.log(response)
          throw new Error(resJSON.message || 'An error occured');
        }

        return resJSON;
    }

    const mutation = useMutation({
        mutationFn: getReport,
        onSuccess: (data: ResponseData) => {
            console.log("Here is your report:", data )
            setReport(data.report);
            setSuccess(true);
        },
        onError: (errorResponse: ErrorResponse) => {
            console.error("Error fetching report:", errorResponse)
            setMessage(errorResponse.message);
            handleError();
        }
    })

    useEffect(() => {
      setLoading(mutation.isPending);
    }, [mutation])

    const onSubmit = async (values: z.infer<typeof weeklyReportSchema>) => {
        // console.log('Data:', transformedValues)
        const transformedValues = {
            ...values,
            userId: user ? user.id : values.userId, // Use userId from user object if logged in
            date: selectedDate || values.date,
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
    );

    const reportContent = (
      <div className='flex flex-col ml-5 font-monomaniac border rounded-lg shadow-lg shadow-yellow1 p-4 mb-10'>
        <h3 className='text-xl text-gray-700'><span className='text-2x'>Date: </span>{report?.start_date} ~ {report?.end_date}</h3>
          {report?.tasks.map((task) => (
            <div key={task.name}>
              <h4 className='ml-5'><span className='text-lg'>Task:</span>{task.name}</h4>
              <h5 className='ml-10'>Productive time: <span className='text-green-700'>{task.ttot} Hours</span></h5>
            </div>
          ))}
        

        <h4 className='ml-5'><span className='text-lg'>Total productive time:</span> <span className='text-green-700'>{report?.ttot_week}</span></h4>
        <h4 className='ml-5'><span className='text-lg'>Total wasted time:</span> <span className='text-red-700'>{report?.twt_week}</span></h4>

        <Button
          variant='outline'
          className='w-20 h-10 mt-2 text-lg font-madimi text-black hover:text-white  hover:bg-yellow1'
          onClick={() => {
            setSuccess(false)
            setLoading(false)
          }}
        >
          Back
        </Button>
      </div>
    );
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
            <DialogTitle className='font-monomaniac text-3xl text-center'>Weekly Report</DialogTitle>
            <DialogDescription className='ml-10 text-lg font-monomaniac'>
                Get your weekly report by picking a date. Needs User Id if not signed in.
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

export default GetWeeklyReport
