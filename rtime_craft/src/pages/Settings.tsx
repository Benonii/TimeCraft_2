import { useState, useEffect } from 'react';
import { useMutation } from '@tanstack/react-query';
import Header from '../components/custom/Header';
import Navbar from '../components/custom/Navbar';
import { useDarkMode } from '../context/DarkModeContext';
import { Switch } from '../components/shadcn/Switch';
import ChangeUsername from '../components/custom/modals/ChangeUsername';
import DeleteUserAlert from '../components/custom/DeleteUserAlert';
import ManageTasks from '../components/custom/modals/ManageTasks';
import SuccessAlert from '../components/custom/SuccessAlert';
import ErrorAlert from '../components/custom/ErrorAlert';

export default function Settings() {
  const api = process.env.REACT_APP_API_URL;
  const { isDarkMode, toggleDarkMode } = useDarkMode();
  const [ success, setSuccess ] = useState<boolean>(false);
  const [ message, setMessage ] = useState<string>("");
  const [ error, setError ] = useState<boolean>(false);

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

  type ResponseData = {
    message: string
  }

  const deleteTask = async () => {
    const params = new URLSearchParams();
    params.append('userId', user.id);

    const response = await fetch(`${api}/user/delete`, {
      method: 'POST',
      headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params.toString(),
  })

  const resJSON = await response.json();
  if (!response.ok) {
    // console.log(response)
    throw new Error(resJSON.message || 'An error occured');
  }

  return resJSON;
}

  const mutation = useMutation({
    mutationFn: deleteTask,
    onSuccess: (data: ResponseData) => {
      setMessage(data.message)
      handleSuccess();
    },
    onError: (errorResponse: ResponseData) => {
      setMessage(errorResponse.message);
      handleError();
    }
  })

  return (
    <div>
      <Header />
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
                      onCheckedChange={toggleDarkMode} />
                </div>
                {user && (
                  <>
                    <h4 className='text-gray-600 text-xl font-semibold dark:text-gray-500'>Profile</h4>
                    <ChangeUsername />
                    <ManageTasks />
                    <DeleteUserAlert />
                  </>
                )}
                
                {/* <h4 className='text-gray-600 text-xl font-semibold'>Timer</h4>
                    <p className='ml-7 text-gray-600 text-lg'>Worked Timer type: <span className='hover:underline text-black'>Timer</span></p>
                    <p className='ml-7 text-gray-600 text-lg'>Wasted Timer type: <span className='hover:underline text-black'>Stopwatch</span></p> */}
            </div>
            
        </div>
      </div>
    </div>
  )
}