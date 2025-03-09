// Hooks
import { useQuery } from '@tanstack/react-query';

// Components
import {
    Select, SelectContent,SelectItem,
    SelectTrigger, SelectValue,
  } from "../shadcn/Select";
import { Skeleton } from "../shadcn/Skeleton";
import { getActivities } from "../../lib/functions";


function ActivityPicker({ userId, onSelect }) {
  const { data, isLoading, isError} = useQuery({
    queryKey: ['tasks', userId],
    queryFn:  ({ queryKey }) => {
      const [, userId ] = queryKey;
      return getActivities(userId);
    },
    enabled: !!userId,
  });

  return (
    <div>
        <Select onValueChange={onSelect}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select an activity..."/>
            </SelectTrigger>
            <SelectContent className='dark:bg-black'>
              {isLoading ? (
                <SelectItem key="loading" value="loading" disabled>
                  <div className='flex flex-col gap-2 items-justify'>
                    <Skeleton className="w-[100px] h-[20px] rounded-full" />
                    <Skeleton className="w-[100px] h-[20px] rounded-full" />
                    <Skeleton className="w-[100px] h-[20px] rounded-full" />
                </div>
                </SelectItem>
              ) : isError ? (
                <SelectItem key="loading" value="error" disabled>Error fetching activities</SelectItem>
              ) : (
                data ? (
                  data.data?.map((activity) => (
                    <SelectItem key={activity.unique_id} value={activity.unique_id}>
                      {activity.name}
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

export default ActivityPicker
