#!/usr/bin/python
""" Handles reports for users """

from models import storage
from models.user import User
from models.dailylog import DailyLog
from api.v1.actions import app_actions
from flasgger.utils import swag_from
from datetime import datetime, timedelta
from flask import jsonify, request, abort


@app_actions.route('/report/daily', methods=['POST', 'GET'],
                   strict_slashes=False)
def daily_report():
    """ Provides a daily report for the current user """

    # Gets User ID from the form
    user_id = request.form.get('userId')
    print('User Id:', user_id)

    ''' Get the date and format the string into something compatible with
        the Log object's "date" attribute '''

    date = request.form.get('date')
    print('Date:', date)

    # date = date.replace('-', '.')
    # date = date.replace(':', '.')
    # date = date.replace(',', '.')
    # date = date.replace(' ', '.')

    ''' Handles the case of the user getting a report for "today" and not a
        specific date '''

    if date == "today":
        date = datetime.today().strftime("%B.%-d.%Y")
    else:
        date = datetime.strptime(date, "%Y-%m-%d").strftime("%B.%-d.%Y")
    
    print("Formatted date:", date)
    # Get all logs that are for the given date
    logs = storage.get_logs_of_the_day(date)

    tasks = []
    ttot_day = 0
    twt_day = 0
    
    # If there are no logs for that date
    if logs:
        # Go through all the logs and add up the work time and wasted time metrics
        for log in logs:
            task = storage.get_task(log.task_id)
            print("Task:", task)

            if task.user_id == user_id:
                tasks.append({
                    'name': task.task_name,
                    'ttot': log.time_on_task,
                })
                ttot_day += log.time_on_task
                twt_day += log.time_wasted
    else:
        return jsonify({ 'message': "There are no logs for this day. Please pick another date"}), 404
    # Store result in the dictionary

    task_names = set(task['name'] for task in tasks)
    task_tally_dict = {name: 0 for name in task_names}
    for task in tasks:
        for name in task_names:
            if task['name'] == name:
                task_tally_dict[name] += task['ttot']
        
    unique_tasks = [{'name': name, 'ttot': tally } for name, tally in task_tally_dict.items()]
    daily_report = {
        'ttot_day': ttot_day,
        'twt_day': twt_day,
        'date': date.replace(".", " "),
        'weekday': datetime.strptime(date, "%B.%d.%Y").strftime("%A"),
        'tasks': unique_tasks,
    } 

    return jsonify({'report': daily_report}), 200


@app_actions.route('/report/weekly', methods=['POST', 'GET'],
                   strict_slashes=False)
def weekly_report():
    """ Provides a weekly report for the current user """
    user_id = request.form.get('userId')
    user = storage.get_user(user_id)

    ''' Gets the "week" to get a report for.
        week is one of 3 things. "this_week", "last_week", or "custom"
    '''
    week = request.form.get('week')

    # Takes in an actual datetime object
    def this_week(date):
        """ Gets a weekly report from Monday to Sunday based on a
            given date. """

        # Gets the difference of the given date and the beginning of the week
        weekday_offset = date.weekday()

        # Calculate the date for Monday of that week
        start_date = date - timedelta(days=weekday_offset)
        # Calculate the date for Sunday of that week
        end_date = start_date + timedelta(days=6)

        # Total productive and wasted time for the week
        tasks = []
        ttot_week = 0
        twt_week = 0

        # Get logs from Monday to Sunday of that week
        day = start_date
        while day < end_date:
            log_id = day.strftime("%B.%-d.%Y")
            logs = storage.get_logs_of_the_day(log_id)

            for log in logs:
                task = storage.get_task(log.task_id)
                if task.user_id == user_id:
                    tasks.append({
                        'name': task.task_name,
                        'ttot': log.time_on_task,
                    })

                    ttot_week += log.time_on_task
                    twt_week += log.time_wasted

            day += timedelta(days=1)


        task_names = set(task['name'] for task in tasks)
        task_tally_dict = {name: 0 for name in task_names}
        for task in tasks:
            for name in task_names:
                if task['name'] == name:
                    task_tally_dict[name] += task['ttot']
        
        unique_tasks = [{'name': name, 'ttot': tally } for name, tally in task_tally_dict.items()]
            
            
        # Initialize a dictionary and store the report to be returned
        weekly_report = {
            'ttot_week': ttot_week,
            'twt_week': twt_week,
            'start_date': start_date.strftime("%a, %d %b, %Y"),
            'end_date': end_date.strftime("%a, %d %b, %Y"),
            'tasks': unique_tasks,
        }

        return jsonify({'report': weekly_report}), 200

    # Gets today's date
    today = datetime.today()

    if week == "this_week":
        year = datetime.today().strftime("%Y")
        return this_week(today)
    elif week == "last_week":
        year = datetime.today().strftime("%Y")

        # Provides a date for a day exactly a week from today
        return this_week(today - timedelta(days=7))
    else:

        ''' Gets the custom date and formats it to match a Log object's
            date attribute
        '''
        custom_date = request.form.get('date')
        print(custom_date)
        custom_date =  datetime.strptime(custom_date, "%Y-%m-%d")
        # custom_date = custom_date.replace(' ', '.')
        # custom_date = custom_date.replace('-', '.')
        # custom_date = custom_date.replace(',', '.')
        # custom_date = custom_date.replace(':', '.')

        # Converts the string to an actual datetime object
        year = custom_date.strftime("%Y")
        return this_week(custom_date)


@app_actions.route('/report/monthly', methods=['POST', 'GET'],
                   strict_slashes=False)
def monthly_report():
    """ Provides a monthly report for the current user """
    user_id = request.form.get('userId')
    user = storage.get_user(user_id)
    month = request.form.get('month')
    year = int(datetime.today().strftime("%Y"))

    # total time on task month
    ttot_month = 0
    # total wasted time month
    twt_month = 0
    tasks = []


    # Get all logs in storage and filter by month
    logs = storage.get_logs_of_the_day()
    logs_of_the_month = []
    for log in logs:
        if log.year == year:
            if log.month == month:
                logs_of_the_month.append(log)

    # If there are no logs for the given month
    if not logs_of_the_month:
        return jsonify({'message': "Looks like there are no logs for tha month. Please try another one"}), 404

    # Get the hourly mesurments for the report on the month
    for log in logs_of_the_month:
        task = storage.get_task(log.task_id)
        if task.user_id== user_id:
            tasks.append({
                'name': task.task_name,
                'ttot': log.time_on_task,
            })
            ttot_month += log.time_on_task
            twt_month += log.time_wasted


    task_names = set(task['name'] for task in tasks)
    task_tally_dict = {name: 0 for name in task_names}
    for task in tasks:
        for name in task_names:
            if task['name'] == name:
                task_tally_dict[name] += task['ttot']
        
    unique_tasks = [{'name': name, 'ttot': tally } for name, tally in task_tally_dict.items()]
    # Store the report in a dictionary
    monthly_report = {
            'ttot_month': ttot_month,
            'twt_month': twt_month,
            'month': month,
            'year': year,
            'tasks': unique_tasks,
        }

    return jsonify({ 'report': monthly_report })


@app_actions.route('/report/productive', methods=['POST', 'GET'],
                   strict_slashes=False)
def total_productive_time():
    """ Gets the total productive time for a User """
    user_id = request.form.get('userId')
    user = storage.get_user(user_id)

    if not user:
        return jsonify({'message': 'No user with that id. Please try again'}), 200

    # Dictionary to store the total productive time
    tpt = {'tpt': 0}

    # Get's a User's total productive time and store it in the dictionary
    tpt['tpt'] = user.total_productive_time

    return jsonify({'report': tpt})


@app_actions.route('/report/wasted', methods=['POST', 'GET'],
                   strict_slashes=False)
def total_wasted_time():
    """ Gets the total wasted time for a User """
    user_id = request.form.get('userId')
    user = storage.get_user(user_id)

    if not user:
        return jsonify({'message': 'No user with that id. Please try again'}), 200

    # Get a User's total wasted time and store it in a dictionary
    twt = {
            'twt': user.total_wasted_time
        }
    return jsonify({'report': twt})
