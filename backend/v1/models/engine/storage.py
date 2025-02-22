#!/usr/bin/env python3

''' Handles the database storage for TimeCraft '''

import os
import sys
import sqlalchemy
from sqlalchemy import (create_engine, update)
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, scoped_session
from models.basemodel import Base
from models.user import User
from models.task import Task
from models.dailylog import DailyLog
from contextlib import contextmanager
from dotenv import load_dotenv

load_dotenv()  # Load environment variables from .env file

DATABASE_URL = os.getenv("DATABASE_URL")

if DATABASE_URL is None:
   raise ValueError("No DATABASE_URL found in environment variables")

class Storage:
    ''' This class defines handles the storage of our data '''

    __engine = None
    __session = None
    user_id = None

    def __init__(self):
        ''' Insantization '''

        # We are using the dev database
        # self.__engine = create_engine(DATABASE_URL)
        #         # We are using the dev database
        self.__engine = create_engine(DATABASE_URL)

    def all_tasks(self, usr):
        ''' Query the current databse session all tasks belonging to the user
        '''
        task_list = []

        # Converts the string into the corresponding object
        if type(usr) is str:
            usr = eval(usr)
        usr_id = usr.id

        # Gets all Tasks in storage
        tasks = self.__session.query(Task).filter(Task.id == usr_id)

        # Filter the tasks assigned to our user
        # for task in tasks:
        #     if task.user_id == usr_id:
        #         task_list.append(task)
        return tasks

    def total_time_on_task(self, usr, task):
        ''' Gets the total time spent across all tasks OR
            total time spent on one task if task is specified '''
        tasks = self.all_tasks(usr)
        total_time_on_task = 0

        # Goes through all the tasks related to the user
        for tsk in tasks:
            if tsk.id == task.id:
                return task.total_time_on_task

        return total_time_on_task

    def get_user(self, user_id=None):
        """ Get a user(Users) from the list of users """

        # Get all User objects in storage
        users = self.__session.query(User)

        if user_id:
            for user in users:
                if user.unique_id == user_id:
                    return user
            return None

        # If no User Id given, return all User objects(for internal usage)
        return users
    
    def get_user_by_email(self, email):
        ''' Get user byy email address '''
        return self.__session.query(User).filter(User.email == email).first()

    def get_task(self, task_id=None):
        """ Get a task(or all tasks) from the list of tasks """

        # Get all Task objects in storage
        tasks = self.__session.query(Task)

        if task_id:
            for task in tasks:
                if task.unique_id == task_id:
                    return task
            return None

        # If noto Task ID is given, return all Task objects(for internal use)
        return tasks
    
    def get_task_by_user_id(self, user_id):
        ''' Get a task by user Id '''
        return self.__session.query(Task).filter(Task.user_id == user_id)
    
    def get_task_id_by_task_name(self, task_name):
        ''' Get task's Id by task name'''
        return self.__session.query(Task).filter(Task.task_name == task_name).first().unique_id

    def get_logs_of_the_day(self, log_date=None):
        """ Gets a log(or all logs) from the list of logs """

        # Get all Log objects in storarge
        logs = self.__session.query(DailyLog)
        logs_of_the_day = []

        if log_date:
            for log in logs:
                # Get all logs for a given date
                if log.date == log_date:
                    logs_of_the_day.append(log)
            return logs_of_the_day

        # If no log date given, return all DailyLog objects(for internal use)
        return logs

    def new(self, obj):
        ''' Adds a new object to the session '''
        self.__session.add(obj)

    def set_user_id(self, user_id):
        ''' Sets a user id for the session '''
        self.user_id = user_id

    def change_username(self, username, user_id):
        ''' Change username of a user '''
        update_query = (
            update(User)
            .where(User.unique_id == user_id)
            .values(username=username)
        )

        with self.__session as session:
            session.execute(update_query)
            session.commit()


    def change_task_name(self, new_name, task_id):
        ''' Change task name of a task '''
        update_query = (
            update(Task)
            .where(Task.unique_id == task_id)
            .values(task_name = new_name)
        )

        with self.__session as session:
            session.execute(update_query)
            session.commit()

    def save(self):
        ''' Saves all changes made in the session '''
        self.__session.commit()

    def delete(self, obj):
        ''' Deletes an object from the database '''
        if obj:
            # with self.__session as session:
            self.__session.delete(obj)

    def reload(self):
        ''' Creates all tables in the database and the current db session '''
        Base.metadata.create_all(self.__engine)

        session_factory = sessionmaker(bind=self.__engine,
                                       expire_on_commit=False)

        Session = scoped_session(session_factory)

        # Starts the session
        self.__session = Session()
    
    def rollback(self):
        ''' Roll back the current session in case of error '''
        self.__session.rollback()

    def close(self):
        ''' Closes the current session '''
        self.__session.close()
