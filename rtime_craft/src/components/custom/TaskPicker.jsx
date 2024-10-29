import React, { useState, useEffect } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "../shadcn/Select";
  

function TaskPicker({ userId }) {
  const api = process.env.REACT_APP_API_URL;
  const [tasks, setTasks ] = useState([]);

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

  console.log("Tasks:", data )

  return (
    <div>
        <Select>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select a task..."/>
            </SelectTrigger>
            <SelectContent>
              {isLoading ? (
                <SelectItem value="loading" disabled>Loading tasks...</SelectItem>
              ) : isError ? (
                <SelectItem value="error" disabled>Error fetching tasks</SelectItem>
              ) : (
                data?.tasks.map((task) => (
                  <SelectItem key={task.id} value={task.name}>
                    {task.name}
                  </SelectItem>
                ))
              )}
            </SelectContent>
        </Select>

    </div>
  )
}

export default TaskPicker
