#!/usr/bin/python

""" Handles all commands related to Tasks """

from models.__init__ import storage
from models.task import Task
from models.user import User
from api.v1.actions import app_actions
from flask import abort, jsonify, make_response, request
from flasgger.utils import swag_from


@app_actions.route('/tasks/create', methods=['POST'], strict_slashes=False)
def new_task():
    """ Creates a new task """

    # Gets the user ID from the form
    user_id = request.form.get('userId')
    if not user_id:
        return jsonify({"error": "User ID not provided"}), 400

    # Empty Dictionray
    task_dict = dict()

    # Get the User from storage
    user = storage.get_user(user_id)

    if user is None:
        return jsonify({"Error": "Couldn't find user with that ID"}), 404

    # Assign form data about Task to the empty dictionary
    task_dict['user_id'] = user_id
    task_dict['task_name'] = request.form.get('taskName')
    task_dict['daily_goal'] = float(request.form.get('dailyGoal'))
    task_dict['weekly_goal'] = task_dict['daily_goal'] *\
        user.number_of_work_days

    # Create a new Task object and save it
    new_task = Task(**task_dict)
    storage.new(new_task)
    storage.save()

    return jsonify({'task_id': new_task.id}), 201


@app_actions.route('/tasks', methods=['POST'], strict_slashes=False)
def all_tasks():
    """Gets all tasks associated with the user"""
    user_id = request.form.get('userId')
    user_task_names = []
    if not user_id:
            return jsonify({"error": "User ID not provided"}), 400
    
    tasks = storage.get_task_by_user_id(user_id)
    task_names = [task.task_name for task in tasks]

    # for task in tasks:
    #     if task.user_id == user_id:
    #         user_task_names.append(task.name)

    return jsonify({'tasks': task_names})

    # except Exception as e:
    #     return jsonify({"error": str(e)}), 500


@app_actions.route('/tasks/total', methods=['POST', 'GET'],
                   strict_slashes=False)
def total_time_on_task():
    """ Gets the total time spent on task """
    task_id = request.form.get('taskId')
    task_name = request.form.get('taskName')

    if not task_id:
        task_id = storage.get_task_id_by_task_name(task_name)
        # print("Task Id by task name:", task_id)


    # Gets a specific task from storage using the Task ID
    task = storage.get_task(task_id)

    if task is None:
        return jsonify({})

    return jsonify({'ttot': task.total_time_on_task,
                    'taskName': task.task_name
                    })


@app_actions.route("/delete_task", methods=['DELETE'], strict_slashes=False)
def delete_task():
    """ Deletes a task. """
    task_id = request.form.get("task_id")
    task = storage.get_task(task_id)

    task.delete()

    return jsonify({'deleted': 'OK'})
