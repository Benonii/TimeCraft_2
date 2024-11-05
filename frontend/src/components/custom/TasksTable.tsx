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
import { changeTaskName, deleteTask, getTasks } from '../../lib/functions';


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
        onSuccess: (response: MessageResponseData) => {
            // console.log('Task deleted successfully', response);
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
        queryFn:  () => getTasks(userId),
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
                    <TableCell className='text-green-700 dark:text-green-500 text-lg'>{task.ttot.toFixed(2)} hours</TableCell>
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
