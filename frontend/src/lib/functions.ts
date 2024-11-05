// Hooks

// Types
import { changeUsernameFormData, CreateLogFormData, DailyReportFromData,
         MonthlyReportFormData, NewTaskFormData, NewUserFormData, 
         User, TptFormData, TtotFormData, ChangeTaskNameFormData,
         DeleteTask, LoginFormData, SignupFormData } from "./types";

// API URL
const api = process.env.REACT_APP_API_URL;


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
    // console.log(response)
    throw new Error(resJSON.message || 'An error occured');
  }

return resJSON;
}


export const createTask = async (formData: NewTaskFormData) => {
  console.log("Form data:", formData)
  const params = new URLSearchParams();
  params.append('userId', formData.userId);
  params.append('taskName', formData.taskName);
  params.append('dailyGoal', String(formData.dailyGoal));

  // console.log("Params", params.toString());

  const response = await fetch(`${api}/tasks/create`, {
    method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          },
        body: params.toString(),
  })

  const resJSON = await response.json();
  if (!response.ok) {
    // console.log(r)
    throw new Error(resJSON.message || 'An error occured');
}

return resJSON
};


export const createLog = async (formData: CreateLogFormData, user: User) => {
    const params = new URLSearchParams();
    if (user) {
      params.append('userId', user.id);
      params.append('taskName', formData.taskName !)
    } else {
      params.append('userId', formData.userId !);
      params.append('taskId', formData.taskId !);
    }
    params.append('timeOnTask', String(formData.timeOnTask));
    params.append('timeWasted', String(formData.timeWasted));

    console.log("Params", params.toString())
    const response = await fetch(`${api}/new_log`, {
      method: 'POST',
          headers: {
              'Content-Type': 'application/x-www-form-urlencoded'
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


// Get functions
export const getDailyReport = async (formData: DailyReportFromData, user: User) => {
    const params = new URLSearchParams();
    params.append('userId', user ? user.id : formData.userId)
    const localDate = new Date(formData.date);
    const year = localDate.getFullYear();
    const month = String(localDate.getMonth() + 1).padStart(2, '0');
    const day = String(localDate.getDate()).padStart(2, '0');
    
    const formattedDate = `${year}-${month}-${day}`
    // console.log(formattedDate);
    params.append('date', formattedDate)
    // console.log("Params:", params.toString());

    const response = await fetch(`${api}/report/daily`, {
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


export const getWeeklyReport = async (formData: DailyReportFromData, user: User) => {
    const params = new URLSearchParams();
    params.append('userId', user ? user.id : formData.userId)
    const localDate = new Date(formData.date);
    const year = localDate.getFullYear();
    const month = String(localDate.getMonth() + 1).padStart(2, '0');
    const day = String(localDate.getDate()).padStart(2, '0');
    
    const formattedDate = `${year}-${month}-${day}`
    // console.log(formattedDate);
    params.append('date', formattedDate)
    // console.log("Params:", params.toString());

    const response = await fetch(`${api}/report/weekly`, {
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


export const getMonthlyReport = async (formData: MonthlyReportFormData, user: User) => {
    const params = new URLSearchParams();
    params.append('userId', user ? user.id : formData.userId)
    params.append('month', formData.month)
    // console.log("Params:", params.toString());

    const response = await fetch(`${api}/report/monthly`, {
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
      // console.log(response)
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
      // console.log(response)
      throw new Error(resJSON.message || 'An error occured');
    }

    return resJSON;
}


export const getTtot = async (formData: TtotFormData, user: User) => {
    const params = new URLSearchParams();
    params.append('userId', user ? user.id : formData.userId)
    user ? params.append('taskName', formData.taskName !)
         : params.append('taskId', formData.taskId !) 
    console.log("Params:", params.toString());

    const response = await fetch(`${api}/tasks/total`, {
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


export const getTasks = async (id: string) => {
  const params = new URLSearchParams();
  params.append('userId', id);

  // console.log("Params:", params.toString())
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


// Update functions
export const changeUsername = async (formData: changeUsernameFormData, user: User) => {
  const params = new URLSearchParams();
  params.append('username', formData.username);
  params.append('userId', user.id);

  // console.log('Params:', params.toString());

  const response = await fetch(`${api}/user/update`, {
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
      // console.log(response)
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
      // console.log(response)
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
    // console.log(response)
    throw new Error(resJSON.message || 'An error occured');
  }

  return resJSON;      
}

// Auth functions
export const login = async (formData: LoginFormData) => {
  console.log("API URL:", api);
  const params = new URLSearchParams();
  params.append('email', formData.email);
  params.append('password', formData.password);
  const response = await fetch(`${api}/login`, {
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

export const signup = async (formData: SignupFormData) => {
  const params = new URLSearchParams();
  params.append('email', formData.email);
  params.append('username', formData.username);
  params.append('weekly_hours', String(formData.weekly_hours))
  params.append('work_days', String(formData.work_days))
  params.append('password', formData.password)
  const response = await fetch(`${api}/signup`, {
      method: 'POST',
      headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: params.toString()
  })

  const resJSON = await response.json();
  if (!response.ok) {
    // console.log(response)
    throw new Error(resJSON.message || 'An error occured');
  }

return resJSON;
}
