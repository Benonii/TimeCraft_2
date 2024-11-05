// Hooks
import { useState  } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useDarkMode } from '../context/DarkModeContext';

// Components
import Header from '../components/custom/Header';
import Navbar from '../components/custom/Navbar';
import { Switch } from '../components/shadcn/Switch';
import ChangeUsername from '../components/custom/modals/ChangeUsername';
import DeleteUserAlert from '../components/custom/DeleteUserAlert';
import ManageTasks from '../components/custom/modals/ManageTasks';
import SuccessAlert from '../components/custom/SuccessAlert';
import ErrorAlert from '../components/custom/ErrorAlert';

// Types
import { DeleteTask, MessageResponseData } from '../lib/types';

// Others
import { deleteTask } from '../lib/functions';


export default function Settings() {
  const { isDarkMode, toggleDarkMode } = useDarkMode();
  const [ success, setSuccess ] = useState<boolean>(false);
  const [ message, setMessage ] = useState<string>("");
  const [ error, setError ] = useState<boolean>(false);

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

  const handleSuccess = () => {
    setSuccess(true);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    // navigate({ to: '/' }); // Redirect user before closing alert
    // setTimeout(() => setSuccess(false), 3000); // Reset alert state
}

  const handleError = () => {
      setError(true);

      setTimeout(() => {
        setError(false)
      }, 3000);
  }

  const mutation = useMutation({
    mutationFn: (formData: DeleteTask) => deleteTask(formData),
    onSuccess: (data: MessageResponseData) => {
      setMessage(data.message)
      handleSuccess();
    },
    onError: (errorResponse: MessageResponseData) => {
      setMessage(errorResponse.message);
      handleError();
    }
  })

  return (
    <div>
      <Header />
      {success && (
        <div className='flex justify-center items-center w-[70%] max-w-[400px] ml-20'>
          <SuccessAlert content={message} />
        </div>
      )}
      {error && (
        <div className='flex justify-center intems-center w-[70%] max-w-[400px] '>
          <ErrorAlert content={message} />
        </div>
      )}
      <div className="relative flex items-center mt-10 min-h-[900px]">
        <Navbar className=''/>
        <div className='absolute top-3 left-24 font-monomaniac'>
            <h2 className='font-monomaniac text-2xl ml-4 md:text-4xl dark:text-gray-300'>Settings</h2>
            <hr className='mt-2'/>
            <div className='ml-5 mt-5'>
                <h3 className='text-gray-600 text-xl font-semibold dark:text-gray-500'>Theme</h3>
                <div className="flex justify-center gap-2 items-center">
                    <h4 className='ml-5 text-gray-600 text-lg dark:text-gray-400'>Dark mode:</h4>
                    <Switch 
                      id="dark-mode"
                      checked={isDarkMode}
                      onCheckedChange={toggleDarkMode}
                    />
                </div>
                {user && (
                  <>
                    <h4 className='text-gray-600 text-xl font-semibold dark:text-gray-500'>Profile</h4>
                    <ChangeUsername />
                    <ManageTasks />
                    <DeleteUserAlert handleDelete={() => {mutation.mutate(user.id)}}/>
                  </>
                )}
            </div>
        </div>
      </div>
    </div>
  )
}