import { useMutation, useQuery } from '@tanstack/react-query';
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "../shadcn/Table";
import { Skeleton } from "../shadcn/Skeleton";
import { Pencil, Trash2, Save, RotateCw } from 'lucide-react';
import { Input } from '../shadcn/Input';
import { useState } from 'react';
import { useRef } from 'react';
import SuccessAlert from './SuccessAlert';
import ErrorAlert from './ErrorAlert';
import { Link } from '@tanstack/react-router';
import queryClient from '@/src/queryClient';

function TasksTable({ userId }) {
    const api = process.env.REACT_APP_API_URL;
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
      const inputValue = inputRef.current?.value || "";
      inputValue?.length > 0 && changeTaskMutation.mutate({id: id, newName: inputValue})
    }

    type changeTaskName = {
        id: string,
        newName: string,
    }

    type DeleteTask = {
        id: string,
    }

    type ResponseData = {
        message: string,
    }

    const getTasks = async () => {
        const params = new URLSearchParams();
        params.append('userId', userId);
        const res = await fetch( `${api}/tasks`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          body: params.toString(),
        })
    
        if (!res.ok) {
          throw new Error('Network Error');
        }
        return await res.json();
    }

    const changeTaskMutation = useMutation({
        mutationFn: async (data: changeTaskName) => {
            const params = new URLSearchParams();
            params.append('taskId', data.id);
            params.append('newName', data.newName)
            
            console.log("Params:", params.toString());
            const res = await fetch( `${api}/tasks/update`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: params.toString(),
            })
          
            const resJSON = await res.json();
            if (!res.ok) {
              // console.log(response)
              throw new Error(resJSON.message || 'An error occured');
            }

            return resJSON;      
        },
        onSuccess: (response: ResponseData) => {
            console.log('Task updated successfully', response);
            setMessage(response.message);
            handleSuccess();
        },
        onError: (error: Error) => {
          console.error('Failed to update task', error);
          setMessage(error.message);
          handleError();
        }
    })

    const delteTaskMutation = useMutation({
        mutationFn: async (data: DeleteTask) => {
            // console.log("ID:", data.id)
            const params = new URLSearchParams();
            params.append("taskId", data.id);

            // console.log("Params", params.toString())
            const res = await fetch( `${api}/tasks/delete`, {
                method: 'DELETE',
                headers: {
                  'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: params.toString(),
            })
          
            const resJSON = await res.json();
            if (!res.ok) {
              // console.log(response)
              throw new Error(resJSON.message || 'An error occured');
            }

            return resJSON;      
        },
        onSuccess: (response: ResponseData) => {
            console.log('Task deleted successfully', response);
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
        queryFn:  getTasks,
        enabled: !!userId,
    });

  return (
    <div>
        {success && (
            <>
              <SuccessAlert content={message} />
            </>
        )}
          {error && (
            <ErrorAlert content={message} />
        )}
      <Table className='font-monomanic '>
        <TableCaption className='text-gray-300 font-monomaniac'>A list of your tasks.</TableCaption>
        <TableHeader className='text-lg font-madimi'>
          <TableRow className=''>
            <TableHead className="w-[100px] dark:text-gray-300">Task name</TableHead>
            <TableHead className='dark:text-gray-300'>Id</TableHead>
            <TableHead className='dark:text-gray-300 min-w-44'>Total time on task</TableHead>
            {/* <TableHead><RotateCw className='' onClick={handleRefetch}/></TableHead> */}
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
                <TableCell colSpan={3}>
                    <Skeleton className="ml-5 w-[90%] h-[20px] rounded-full" />
                </TableCell>
            </TableRow>
          ) : isError ? (
            <TableRow className='w-full border'>
                <TableCell colSpan={3}>
                    <p className='font-monomaniac text-lg text-center dark:text-gray-400'>Error fetching data</p>
                </TableCell>
            </TableRow>
          ) : data.tasks.length > 0 ? (
            data.tasks.map(task => (
                <TableRow key={task}>
                    <TableCell className='flex min-w-40 gap-2 items-center text-lg'>
                        <Input
                            id="task-name"
                            defaultValue={task.name}
                            readOnly={!edit}
                            className='text-lg'
                            ref={inputRef}
                        />
                        {edit ? (
                            <Save className='w-5 h-5 hover:text-orange1' onClick={() => handleSave(task.id)}/>

                        ) : (
                            <Pencil className='w-5 h-5 hover:text-orange1' onClick={() => setEdit(prev => !prev)} />
                        )}
                    </TableCell>
                    <TableCell className='max-w-52 text-xs'>{task.id}</TableCell>
                    <TableCell className='text-green-700 dark:text-green-500 text-lg'>{task.ttot} hours</TableCell>
                    <TableCell onClick={() => {delteTaskMutation.mutate({ id: task.id }) }}>
                        <Trash2 className='w-4 h-4 hover:text-red-700 dark:hover:text-red-500' />
                    </TableCell>

                </TableRow>
            ))
          ) : (
            <TableRow>
                <TableCell colSpan={3}>
                    <p className='font-monomaniac text-lg text-center dark:text-gray-400'>
                        You have no tasks. &nbsp;
                        <Link to='/new/task' className='underline hover:text-yellow1'>Create one!</Link>
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
