// Hooks
import { useState  } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useDarkMode } from '../context/DarkModeContext';
import { useNavigate } from '@tanstack/react-router';

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
import { deleteUser } from '../lib/functions';


export default function Settings() {
  const { isDarkMode, toggleDarkMode } = useDarkMode();
  const [ success, setSuccess ] = useState<boolean>(false);
  const [ message, setMessage ] = useState<string>("");
  const [ error, setError ] = useState<boolean>(false);
  const navigate = useNavigate();

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
    navigate({ to: '/' }); // Redirect user before closing alert
    setTimeout(() => setSuccess(false), 3000); // Reset alert state
}

  const handleError = () => {
      setError(true);

      setTimeout(() => {
        setError(false)
      }, 3000);
  }

  const mutation = useMutation({
    mutationFn: (formData: DeleteTask) => deleteUser(formData),
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
    <div className='flex flex-col items-center mt-20'>
      <Header />
      {success && (
        <div className='fixed top-24 left-1/2 transform -translate-x-1/2 z-50'>
          <SuccessAlert content={message} />
        </div>
      )}
      {error && (
        <div className='fixed top-24 left-1/2 transform -translate-x-1/2 z-50'>
          <ErrorAlert content={message} />
        </div>
      )}
      <div className="flex min-h-full">
        <div className="flex-1 flex justify-center items-start gap-5 p-6">
          <Navbar className='mt-30' />
          <div className="max-w-[700px] bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-8 transition-all duration-300 hover:shadow-xl w-[55vw] min-w-[250px]">
            <h2 className='font-madimi text-2xl md:text-3xl lg:text-4xl text-center mb-8 dark:text-gray-300'>
              Settings
            </h2>

            <div className="space-y-8">
              {/* Theme Section */}
              <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                <h3 className='font-madimi text-xl md:text-2xl text-gray-700 dark:text-gray-400 mb-4'>
                  Theme
                </h3>
                <div className="flex items-center gap-4 px-6">
                  <span className='font-monomaniac text-lg text-gray-600 dark:text-gray-400'>
                    Dark mode
                  </span>
                  <Switch 
                    id="dark-mode"
                    checked={isDarkMode}
                    onCheckedChange={toggleDarkMode}
                  />
                </div>
              </div>

              {/* Profile Section - Only shown when user is logged in */}
              {user && (
                <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                  <h3 className='font-madimi text-xl md:text-2xl text-gray-700 dark:text-gray-400 mb-4'>
                    Profile
                  </h3>
                  <div className="flex flex-col gap-4 px-6">
                    <div className="flex flex-col gap-6">
                      <ChangeUsername />
                      <ManageTasks />
                      <DeleteUserAlert handleDelete={() => {mutation.mutate({id: user.id})}} />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}