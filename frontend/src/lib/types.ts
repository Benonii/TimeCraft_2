// User type
export type User = {
    username: string,
    id: string,
    email: string,
    weekly_work_hours_goal: number,
    number_of_work_days: number,
    total_wasted_time: number,
    total_productive_time:  number,
}

// Form data types
export type changeUsernameFormData = {
    username: string 
}

export type CreateLogFormData = {
    userId: string | null,
    taskId: string | null,
    taskName: string | null,
    timeOnTask: number,
    timeWasted: number,
}

export type NewUserFormData = {
    username: string,
    weekly_hours_goal: number,
    work_days: number,
}

export type NewActivityFormData = {
    uniqueID?: string,
    name: string,
    description?: string,
    dailyGoal: number,
}

export type DailyReportFromData = {
    userId: string,
    date: Date,
}

export type MonthlyReportFormData = {
    userId: string,
    month: string,
}

export type TptFormData = {
    userId: string
}

export type TtotFormData = {
    userId: string,
    taskId: string | null,
    taskName: string | null,
}

export type ChangeTaskNameFormData = {
    id: string,
    newName: string,
}

export type DeleteTask = {
    id: string
}

export type LoginFormData = {
    email: string,
    password: string,
}

export type SignupFormData = {
    email: string,
    full_name: string,
    username: string,
    weekly_work_hours_goal: number,
    number_of_work_days: number,
    password: string,
    confirmPassword: string,
}

// Response data types
export type MessageResponseData = {
    message: string
}

export type NewUserResponseData = {
    message: string,
    data: {
      user_id: string
    }
}

export type NewActivityResponseData = {
    message: string,
    data: {
        created_at: string,
        daily_goal: number,
        description: string,
        id: string,
        name: string,
        total_time_on_task: number,
        unique_id: string,
        updated_at: string,
        weekly_goal: number
    },
}

export type DailyReport = {
    tasks: [
        task: {
          name: string
          ttot: number
        }
      ]
      date: string
      ttot_day: number,
      twt_day: number,
      weekday: string,
}

export type WeeklyReport = {
    tasks: [
        task: {
          name: string
          ttot: number
        }
      ]
      ttot_week: number,
      twt_week: number,
      start_date: string,
      end_date: string,
}

export type MonthlyReport = {
    tasks: [
        task: {
          name: string
          ttot: number
        }
      ]
      ttot_month: number,
      twt_month: number,
      month: string,
      year: string,
}

export type TptReport =  {
    tpt: number
}

export type TwtReport = {
    twt: number
}

export type TtotReport = {
    ttot: number
    taskName: string
}

export type DailyReportResponseData = {
    report: DailyReport,
}

export type WeeklyReportResponseData = {
    report: WeeklyReport,

}

export type MonthlyReportResponseData = {
    report: MonthlyReport
}

export type TptReportResponseData = {
    report: TptReport
}

export type TwtReportResponseData = {
    report: TwtReport
}

export type TtotReportResponseData = {
    report: TtotReport
}

export type LoginResponseData = {
    message: string,
    data: {token : string, user: User}
}