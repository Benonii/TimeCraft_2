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
import SuccessAlert from '../SuccessAlert';
import ErrorAlert from '../ErrorAlert';
import { Skeleton } from "../../shadcn/Skeleton";
import TasksTable from '../TasksTable';
import { ChangeTaskNameFormData, changeUsernameFormData, MessageResponseData } from '@/src/lib/types';
import { changeTaskName } from '@/src/lib/functions';

function ManageTasks() {
    const api = process.env.REACT_APP_API_URL;
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

    const mutation = useMutation({
        mutationFn: (formData: ChangeTaskNameFormData) => changeTaskName(formData),
        onSuccess: (data: MessageResponseData, user, formData: changeUsernameFormData) => {
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

  return (
    <div>
      <Dialog>
        <DialogTrigger 
          className='ml-7 hover:underline text-gray-600 text-lg dark:text-gray-400 dark:hover:text-gray-300'
        >
          Manage tasks
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className='font-monomaniac text-3xl text-center dark:text-gray-300'>Manage tasks</DialogTitle>
            <DialogDescription className='font font-monomaniac text-lg dark:text-gray-400'>
                View, edit and delete your tasks
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
            <TasksTable userId={user.id}/>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default ManageTasks;