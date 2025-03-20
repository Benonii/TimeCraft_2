// Hooks
import { useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useRef } from 'react';

// Components
import {
    Table, TableBody, TableCaption,
    TableCell, TableHead, TableHeader,
    TableRow,
  } from "../shadcn/Table";
import { Skeleton } from "../shadcn/Skeleton";
import { Pencil, Trash2, Save } from 'lucide-react';
import { Input } from '../shadcn/Input';
import SuccessAlert from './SuccessAlert';
import ErrorAlert from './ErrorAlert';
import { Link } from '@tanstack/react-router';

// Types
import { ChangeTaskNameFormData, DeleteTask, MessageResponseData } from '@/src/lib/types';

// Others
import { changeTaskName, deleteTask, getActivities } from '../../lib/functions';


function TasksTable({ userId }) {
    const [ edit, setEdit ] = useState(false);
    const [ success, setSuccess ] = useState<boolean>(false);
    const [ error, setError ] = useState<boolean>(false);
    const [ message, setMessage ] = useState<string>("");
    const inputRef = useRef<HTMLInputElement>(null);

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
    
    const handleSave = (id: string) => {
      console.log("ID:", id)
      const inputValue = inputRef.current?.value || "";
      inputValue?.length > 0 && changeTaskMutation.mutate({id: id, newName: inputValue})
    }

    const changeTaskMutation = useMutation({
        mutationFn: (formData: ChangeTaskNameFormData) => changeTaskName(formData),
        onSuccess: (response: MessageResponseData) => {
            // console.log('Task updated successfully', response);
            setMessage(response.message);
            handleSuccess();
        },
        onError: (error: MessageResponseData) => {
          console.error('Failed to update task', error);
          setMessage(error.message);
          handleError();
        }
    })

    const delteTaskMutation = useMutation({
        mutationFn: (data: DeleteTask) => deleteTask(data),
        networkMode: 'offlineFirst',
        onSuccess: (response: MessageResponseData) => {
            setMessage(response.message);
            handleSuccess();
        },
        onError: (error: Error) => {
          console.error('Failed to delete task', error);
          setMessage(error.message);
          handleError();
        }
    })

    const { data, isLoading, isError } = useQuery({
        queryKey: ['tasks', userId],
        queryFn:  () => getActivities(userId),
        enabled: !!userId,
    });

  return (
    <div className="overflow-x-auto">
        {success && <SuccessAlert content={message} />}
        {error && <ErrorAlert content={message} />}
        
        <Table className='font-monomanic w-full min-w-[500px]'>
            <TableCaption className='text-sm sm:text-base text-gray-300 font-monomaniac'>
                A list of your tasks.
            </TableCaption>
            <TableHeader className='text-base sm:text-lg font-madimi'>
                <TableRow>
                    <TableHead className="w-[100px] dark:text-gray-300">Task name</TableHead>
                    <TableHead className='dark:text-gray-300 hidden sm:table-cell'>Id</TableHead>
                    <TableHead className='dark:text-gray-300'>Total time</TableHead>
                    <TableHead className='w-10'></TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {isLoading ? (
                    <TableRow>
                        <TableCell colSpan={4}>
                            <Skeleton className="ml-2 sm:ml-5 mt-3 sm:mt-5 w-[90%] h-[16px] sm:h-[20px] rounded-full" />
                            <Skeleton className="ml-2 sm:ml-5 mt-3 sm:mt-5 w-[90%] h-[16px] sm:h-[20px] rounded-full" />
                            <Skeleton className="ml-2 sm:ml-5 mt-3 sm:mt-5 w-[90%] h-[16px] sm:h-[20px] rounded-full" />
                        </TableCell>
                    </TableRow>
                ) : isError ? (
                    <TableRow>
                        <TableCell colSpan={4}>
                            <p className='font-monomaniac text-base sm:text-lg text-center dark:text-gray-400'>
                                Error fetching data
                            </p>
                        </TableCell>
                    </TableRow>
                ) : data?.data?.length > 0 ? (
                    data?.data?.map(task => (
                        <TableRow key={task}>
                            <TableCell className='flex gap-2 items-center'>
                                <Input
                                    id="task-name"
                                    defaultValue={task.name}
                                    readOnly={!edit}
                                    className='text-sm sm:text-lg'
                                    ref={inputRef}
                                />
                                {edit ? (
                                    <Save 
                                        className='w-4 h-4 sm:w-5 sm:h-5 hover:text-orange1' 
                                        onClick={() => handleSave(task.unique_id)}
                                    />
                                ) : (
                                    <Pencil 
                                        className='w-4 h-4 sm:w-5 sm:h-5 hover:text-orange1' 
                                        onClick={() => setEdit(prev => !prev)} 
                                    />
                                )}
                            </TableCell>
                            <TableCell className='hidden sm:table-cell text-xs'>
                                {task.id}
                            </TableCell>
                            <TableCell className='text-green-700 dark:text-green-500 text-sm sm:text-lg'>
                                {task.total_time_on_task.toFixed(2)} h
                            </TableCell>
                            <TableCell onClick={() => {delteTaskMutation.mutate({ id: task.unique_id })}}>
                                <Trash2 className='w-4 h-4 hover:text-red-700 dark:hover:text-red-500' />
                            </TableCell>
                        </TableRow>
                    ))
                ) : (
                    <TableRow>
                        <TableCell colSpan={4}>
                            <p className='font-monomaniac text-base sm:text-lg text-center dark:text-gray-400'>
                                You have no tasks. &nbsp;
                                <Link to='/new/activity' className='underline hover:text-yellow1'>
                                    Create one!
                                </Link>
                            </p>
                        </TableCell>
                    </TableRow>
                )}
            </TableBody>
        </Table>
    </div>
  )
}

export default TasksTable
