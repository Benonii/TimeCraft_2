// Hooks

// Components
import {
    Dialog, DialogContent, DialogDescription,
    DialogHeader, DialogTitle, DialogTrigger,
  } from "../../shadcn/Dialog";
import TasksTable from '../TasksTable';

// Types

// Others


function ManageTasks() {
    // Get user from local storage
    const user = (() => {
        try {
          const storedUser = localStorage.getItem('user');
          return storedUser ? JSON.parse(storedUser) : null;
        } catch (error) {
          console.error("Failed to parse user data from localStorage:", error);
          return null;
        }
    })();

  return (
    <div>
      <Dialog>
        <DialogTrigger 
          className='ml-7 hover:underline text-gray-600 text-base sm:text-lg dark:text-gray-400 dark:hover:text-gray-300 font-madimi'
        >
          Manage tasks
        </DialogTrigger>
        <DialogContent className="bg-white dark:bg-gray-900 border dark:border-gray-700">
          <DialogHeader>
            <DialogTitle className='font-monomaniac text-xl sm:text-2xl md:text-3xl text-center dark:text-gray-300'>
              Manage tasks
            </DialogTitle>
            <DialogDescription className='font-monomaniac text-sm sm:text-base md:text-lg text-center dark:text-gray-400'>
              View, edit and delete your tasks
            </DialogDescription>
          </DialogHeader>
          <div className="p-2 sm:p-4">
            <TasksTable userId={user.id}/>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default ManageTasks;