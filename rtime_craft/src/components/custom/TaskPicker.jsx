import React from 'react';
import { useQuery } from '@tanstack/react-query';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "../shadcn/Select";
  

function TaskPicker({ userId, onSelect }) {
  const api = process.env.REACT_APP_API_URL;

  const params = new URLSearchParams();
  params.append('userId', userId);
  const getTasks = async () => {
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

  const { data, isLoading, isError} = useQuery({
    queryKey: ['tasks', userId],
    queryFn:  getTasks,
    enabled: !!userId,
  });

  // console.log("Tasks:", data )

  return (
    <div>
        <Select onValueChange={onSelect}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select a task..."/>
            </SelectTrigger>
            <SelectContent>
              {isLoading ? (
                <SelectItem key="loading" value="loading" disabled>
                  Loading tasks...
                </SelectItem>
              ) : isError ? (
                <SelectItem key="loading" value="error" disabled>Error fetching tasks</SelectItem>
              ) : (
                data?.length > 0 ? (
                  data.tasks.map((name, index) => (
                    <SelectItem key={index} value={name}>
                      {name}
                    </SelectItem>
                  ))
                ) : (
                  <p className='text-sm font-monomaniac text-gray-400 text-center'>No tasks to display</p>
                )
                )}
            </SelectContent>
        </Select>

    </div>
  )
}

export default TaskPicker
