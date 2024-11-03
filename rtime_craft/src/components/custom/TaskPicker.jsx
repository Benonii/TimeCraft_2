// Hooks
import { useQuery } from '@tanstack/react-query';

// Components
import {
    Select, SelectContent,SelectItem,
    SelectTrigger, SelectValue,
  } from "../shadcn/Select";
import { Skeleton } from "../shadcn/Skeleton";
import getTasks from "../../lib/functions;"


function TaskPicker({ userId, onSelect }) {
  const { data, isLoading, isError} = useQuery({
    queryKey: ['tasks', userId],
    queryFn:  (userId) => getTasks(userId),
    enabled: !!userId,
  });

  // console.log("Tasks:", data )
  return (
    <div>
        <Select onValueChange={onSelect}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select a task..."/>
            </SelectTrigger>
            <SelectContent className='dark:bg-black'>
              {isLoading ? (
                <SelectItem key="loading" value="loading" disabled>
                  <div className='flex flex-col gap-2 items-justify'>
                    <Skeleton className="w-[100px] h-[20px] rounded-full ml-20" />
                    <Skeleton className="w-[100px] h-[20px] rounded-full ml-20" />
                    <Skeleton className="w-[100px] h-[20px] rounded-full ml-20" />
                </div>
                </SelectItem>
              ) : isError ? (
                <SelectItem key="loading" value="error" disabled>Error fetching tasks</SelectItem>
              ) : (
                data?.length > 0 ? (
                  data.tasks_names.map((name, index) => (
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
