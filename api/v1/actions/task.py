#!/usr/bin/python

""" Handles all commands related to Tasks """

from models.__init__ import storage
from models.task import Task
from models.user import User
from api.v1.actions import app_actions
from flask import abort, jsonify, make_response, request
from flasgger.utils import swag_from
from sqlalchemy.exc import IntegrityError


@app_actions.route('/tasks/create', methods=['POST'], strict_slashes=False)
def new_task():
    """ Creates a new task """

    # Gets the user ID from the form
    user_id = request.form.get('userId')
    if not user_id:
        return jsonify({"error": "User ID not provided"}), 400
    # print("User ID", user_id)

    # Empty Dictionray
    task_dict = dict()

    # Get the User from storage
    user = storage.get_user(user_id)

    if user is None:
        return jsonify({"message": "Couldn't find user with that ID"}), 404

    # Assign form data about Task to the empty dictionary
    task_dict['user_id'] = user_id
    task_dict['task_name'] = request.form.get('taskName')
    task_dict['daily_goal'] = float(request.form.get('dailyGoal'))
    task_dict['weekly_goal'] = task_dict['daily_goal'] *\
        user.number_of_work_days

    # Create a new Task object and save it
    try:
        new_task = Task(**task_dict)
        storage.new(new_task)
        storage.save()

        return jsonify({'message': 'Task created successfully', 'data': {'task_id': new_task.id}}), 201
    except IntegrityError as e:
        return jsonify({'message': 'Task name has to be unique. Please try again'}), 400
    except e:
        return jsonify({'message': 'Unkown error occured. Please try again'}), 500


@app_actions.route('/tasks', methods=['POST'], strict_slashes=False)
def all_tasks():
    """Gets all tasks associated with the user"""
    user_id = request.form.get('userId')
    if not user_id:
            return jsonify({"message": "User ID not provided"}), 400
    
    try: 
        tasks = storage.get_task_by_user_id(user_id)
        task_names = [task.task_name for task in tasks]

        user_tasks = [{
            'name': task.task_name,
            'id': task.id,
            'ttot': task.total_time_on_task
        } for task in tasks]

        return jsonify({'tasks': user_tasks, 'task_names': task_names })

    except Exception as e:
        return ({"message": "Error fetching tasks."}), 500


@app_actions.route('/tasks/total', methods=['POST', 'GET'],
                   strict_slashes=False)
def total_time_on_task():
    """ Gets the total time spent on task """
    task_id = request.form.get('taskId')
    task_name = request.form.get('taskName')

    if not task_id:
        task_id = storage.get_task_id_by_task_name(task_name)
        print("Task Id by task name:", task_id)


    # Gets a specific task from storage using the Task ID
    task = storage.get_task(task_id)

    if task is None:
        return jsonify({'message': "Couldn't find a task with that ID. Please try agian."}), 400
    
    # print('Ttot:', task.total_time_on_task)

    return jsonify({'report':{
        'ttot': task.total_time_on_task,
        'taskName': task.task_name
        }
    })

@app_actions.route("/tasks/update", methods=['POST'], strict_slashes=False)
def update_task():
    ''' Update a task's name '''
    task_id = request.form.get('taskId')
    new_name = request.form.get('newName')

    print("Task Id:", task_id)

    if not task_id:
        return ({ 'message': 'Task ID is required. Please try again'}), 400
    task = storage.get_task(task_id)

    if task is None:
        return jsonify({'message': "Couldn't find a task with that ID. Please try again. "}), 404
    
    if task.task_name == new_name:
        return jsonify({'message': "No change detected"}), 400
    
    try:
        storage.change_task_name(new_name, task_id)
        return jsonify({ 'message': 'Task updated successfully' }), 200
    except IntegrityError as e:
        print(e)
        return jsonify({ 'message': "A task with this name already exists. Please change it and try again" }), 400
    except Exception as e:
        print(e)
        return jsonify({ 'message': 'Unknown error occured. Please try again' }), 500

@app_actions.route("/tasks/delete", methods=['DELETE'], strict_slashes=False)
def delete_task():
    """ Deletes a task. """
    task_id = request.form.get("taskId")

    if not task_id:
        return jsonify({'message': 'Task Id is required'}), 400

    task = storage.get_task(task_id)

    try:
        storage.delete(task)
        return jsonify({'message': 'Task deleted successfully!'}), 200
    except Exception as e:
        print(e)
        return jsonify({'message': 'Unkown error occured. Please try again'}), 500
