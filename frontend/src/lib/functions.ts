// Hooks

// Types
import { changeUsernameFormData, CreateReportFormData, DailyReportFromData,
         MonthlyReportFormData, NewActivityFormData, NewUserFormData, 
         User, TptFormData, TtotFormData, ChangeTaskNameFormData,
         DeleteTask, LoginFormData, SignupFormData } from "./types";
import { useNavigate } from "@tanstack/react-router";

// Other
import { getDateRange } from "../utils/dateRanges";
import { format } from 'date-fns';

// API URL
const api = process.env.REACT_APP_API_URL || 'http://127.0.0.1:5000/api';

// Add this helper function
const handle401Error = (response: Response) => {
  if (response.status === 401) {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/user/login';  // Force redirect to login
  }
};

// Create functions
export const createUser = async (formData: NewUserFormData, user: User) => {
  const params = new URLSearchParams();
  params.append('username', formData.username)
    params.append('weekly_hours', String(formData.weekly_hours_goal));
  params.append('work_days', String(formData.work_days));

  const response = await fetch(`${api}/user/create`, {
    method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          },
        body: params.toString(),
  })

  const resJSON = await response.json();
  if (!response.ok) {
    handle401Error(response);
    throw new Error(resJSON.message || 'An error occured');
  }

return resJSON;
}


export const createActivity = async (formData: NewActivityFormData) => {
  const token = localStorage.getItem('token');
  const response = await fetch(`${api}/activity`, {
    method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
        body: JSON.stringify(formData),
  })

  const resJSON = await response.json();
  if (!response.ok) {
    handle401Error(response);
    throw new Error(resJSON.message || 'An error occured');
}

return resJSON
};


export const createReport = async (formData: CreateReportFormData) => {
    const token = localStorage.getItem('token');
    
    const response = await fetch(`${api}/report`, {
      method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      }
    )

    const resJSON = await response.json();
        if (!response.ok) {
          handle401Error(response);
          throw new Error(resJSON.message || 'An error occured');
        }

      return resJSON;
}


// Get functions
export const getReport = async ({ startDate, endDate }: { startDate: Date, endDate: Date }) => {
    const token = localStorage.getItem('token');
    
    const params = new URLSearchParams();
    params.append('start_date', format(startDate, 'yyyy-MM-dd'));
    params.append('end_date', format(endDate, 'yyyy-MM-dd'));
    
    const response = await fetch(`${api}/report?${params.toString()}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
        }
    });

    const resJSON = await response.json();
    if (!response.ok) {
        handle401Error(response);
        console.log("Error:", resJSON.message)
        throw new Error('An error occurred. Please try again.');
    }

    return resJSON;
};


export const getTpt = async (formData: TptFormData, user: User) => {
    const params = new URLSearchParams();
    params.append('userId', user ? user.id : formData.userId)
    // console.log("Params:", params.toString());

    const response = await fetch(`${api}/report/productive`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: params.toString(),
    })

    const resJSON = await response.json();
    if (!response.ok) {
      handle401Error(response);
      console.log("Error:", resJSON.message)
      throw new Error(resJSON.message || 'An error occured');
    }

    return resJSON;
}


export const getTwt = async (formData: TptFormData, user: User) => {
    const params = new URLSearchParams();
    params.append('userId', user ? user.id : formData.userId)
    // console.log("Params:", params.toString());

    const response = await fetch(`${api}/report/wasted`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: params.toString(),
    })

    const resJSON = await response.json();
    if (!response.ok) {
      handle401Error(response);
      console.log("Error:", resJSON.message)
      throw new Error(resJSON.message || 'An error occured');
    }

    return resJSON;
}


export const getTotalTimeOnTask = async (taskID: string) => {
    const token = localStorage.getItem('token');

    const response = await fetch(`${api}/activity/${taskID}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
    })

    const resJSON = await response.json();
    if (!response.ok) {
      handle401Error(response);
      console.log("Error:", resJSON.message)
      throw new Error(resJSON.message || 'An error occured');
    }

    return resJSON;
}


export const getActivities = async (id: string) => {
  const token = localStorage.getItem('token');
  const res = await fetch( `${api}/activity`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': `Bearer ${token}`,
    },
  })

  if (!res.ok) {
    handle401Error(res);
    throw new Error('Network Error');
  }
  return await res.json();
}


// Update functions
export const changeUsername = async (username: string) => {
  const token = localStorage.getItem('token');

  const response = await fetch(`${api}/profile`, {
      method: 'PATCH',
      headers: {
          'Content-Type': 'application/application/json',
          'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        username
      }),
  })

  const resJSON = await response.json();
  if (!response.ok) {
    handle401Error(response);
    console.log("Error:", resJSON.message)
    throw new Error(resJSON.message || 'An error occured');
  }

  return resJSON;
}

export const changeTaskName = async (data: ChangeTaskNameFormData) => {
    const params = new URLSearchParams();
    params.append('taskId', data.id);
    params.append('newName', data.newName)
    
    console.log("Params:", params.toString());
    const res = await fetch( `${api}/tasks/update`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: params.toString(),
    })
  
    const resJSON = await res.json();
    if (!res.ok) {
      handle401Error(res);
      console.log("Error:", resJSON.message)
      throw new Error(resJSON.message || 'An error occured');
    }

    return resJSON;      
};


// Delete functions
export const deleteTask = async (data: DeleteTask) => {
    // console.log("ID:", data.id)
    const params = new URLSearchParams();
    params.append("taskId", data.id);

    // console.log("Params", params.toString())
    const res = await fetch( `${api}/tasks/delete`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: params.toString(),
    })
  
    const resJSON = await res.json();
    if (!res.ok) {
      handle401Error(res);
      console.log("Error:", resJSON.message)
      throw new Error(resJSON.message || 'An error occured');
    }

    return resJSON;      
}

export const deleteUser = async (data: DeleteTask) => {
  // console.log("ID:", data.id)
  const params = new URLSearchParams();
  params.append("userId", data.id);

  // console.log("Params", params.toString())
  const res = await fetch( `${api}/user/delete`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: params.toString(),
  })

  const resJSON = await res.json();
  if (!res.ok) {
    handle401Error(res);
    console.log("Error:", resJSON.message)
    throw new Error(resJSON.message || 'An error occured');
  }

  return resJSON;      
}

// Auth functions
export const login = async (formData: LoginFormData) => {
  const response = await fetch(`${api}/auth/login`, {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
  })

  const resJSON = await response.json();
  if (!response.ok) {
    console.log("Error:", resJSON.message)
    throw new Error('An error occured. Please try again!');
  }

return resJSON;
}

export const signup = async (formData: SignupFormData) => {
  const response = await fetch(`${api}/auth/signup`, {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
  })

  const resJSON = await response.json();
  if (!response.ok) {
    console.log("Error:", resJSON.message)
    throw new Error('An error occured. Please try again!.');
  }

  return resJSON;
}

