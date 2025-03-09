## TimeCraft Documentation

### Introduction

TimeCraft is a time tracking application. It helps users monitor and analyze their time allocation across different activities. TimeCraft provides tools to log time spent on tasks, track productive and wasted time, and generate reports for daily, weekly, and monthly analysis. It offers both a REST API and a command-line interface for interaction.

### Quick Start

1.  **Installation**

    *   Ensure Python 3.13 and MySQL are installed.
    *   Install Python dependencies:

    ```bash
    pip install -r v1/requirements.txt
    pip install -r v2/pyproject.toml
    ```

2.  **Database Setup**

    *   Set up a MySQL database.
    *   Configure database connection via environment variable `DATABASE_URL`.
    *   Run database migrations using Alembic:

    ```bash
    alembic upgrade head -n v1 -x config_file=v1/alembic.ini
    alembic upgrade head -n v2 -x config_file=v2/alembic.ini
    ```
    *   Alternatively, use provided SQL scripts to create tables: `v1/database_setup/create_tables.sql`.

3.  **Running the API**

    *   Version 1 API:

    ```bash
    python v1/app.py
    ```

    *   Version 2 API:

    ```bash
    python v2/app.py
    ```

    *   The API will be accessible at `http://0.0.0.0:5000/api`.

4.  **Using the Command-Line Interface (CLI)**

    *   Run the CLI:

    ```bash
    python timecraft.py
    ```

    *   Follow the prompts to interact with TimeCraft. Type `help` for available commands.

### Configuration

TimeCraft is configured using environment variables and `.ini` files.

1.  **Database Configuration**

    *   Set the `DATABASE_URL` environment variable to your MySQL database connection string. Example:

    ```
    DATABASE_URL="mysql://tc_dev:passwd@localhost/tc_dev_db"
    ```

    *   Alembic configuration files (`alembic.ini`, `v2/alembic.ini`) are used for database migrations.

2.  **Secret Key**

    *   For API Version 2, set the `SECRET_KEY` and `ALGORITHM` environment variables for JWT authentication. Example:

    ```
    SECRET_KEY="your_secret_key"
    ALGORITHM="HS256"
    ```

3.  **.env Files**

    *   Environment variables are loaded from `.env` files in the repository root and `v2` directory.

### API Documentation

TimeCraft provides two API versions: Version 1 and Version 2.

#### Version 1 API (`/api/v1`)

Version 1 API provides basic functionalities for user, task, log, and report management.

**1. Index Endpoints**

*   `/status` `GET`
    *   Returns API status.
    *   Response: `{"status": "OK"}`

**2. User Endpoints**

*   `/user/create` `POST`
    *   Creates a new user.
    *   Parameters (Form Data):
        *   `username`: User's name.
        *   `weekly_hours`: Weekly work hours goal.
        *   `work_days`: Number of work days per week.
    *   Response (Success 201): `{'message': 'User created successfully!', 'data': {'user_id': new_user.unique_id} }`
*   `/signup` `POST`
    *   Signs up a new user with email and password.
    *   Parameters (Form Data):
        *   `username`: Username.
        *   `email`: User's email.
        *   `weekly_hours`: Weekly work hours goal.
        *   `work_days`: Number of work days per week.
        *   `password`: User password.
    *   Response (Success 201): `{'message': 'User signed up successfully!'}`
*   `/login` `POST`
    *   Logs in a user.
    *   Parameters (Form Data):
        *   `email`: User's email.
        *   `password`: User's password.
    *   Response (Success 200): `{'message': 'Login successful!', 'data': {'token': token, 'user': returning_user} }`
*   `/get_session_user` `GET`
    *   Gets the current session user ID.
    *   Response (Success 200): `{"user_id": storage.user_id}`
*   `/switch_user` `POST`
    *   Switches the current session user.
    *   Parameters (JSON):
        *   `userId`: User ID to switch to.
    *   Response (Success 200): `{'name': user.name}`
*   `/user/update` `POST`
    *   Updates a user's username.
    *   Parameters (Form Data):
        *   `userId`: User ID.
        *   `username`: New username.
    *   Response (Success 200): `{'message': 'User updated successfully!'}`
*   `/user/delete` `DELETE`
    *   Deletes a user.
    *   Parameters (Form Data):
        *   `userId`: User ID.
    *   Response (Success 200): `{'message': 'User deleted successfully!'}`

**3. Task Endpoints**

*   `/tasks/create` `POST`
    *   Creates a new task.
    *   Parameters (Form Data):
        *   `userId`: User ID.
        *   `taskName`: Task name.
        *   `dailyGoal`: Daily goal in hours.
    *   Response (Success 201): `{'message': 'Task created successfully', 'data': {'task_id': new_task.unique_id}}`
*   `/tasks` `POST`
    *   Gets all tasks for a user.
    *   Parameters (Form Data):
        *   `userId`: User ID.
    *   Response (Success 200): `{'tasks': user_tasks, 'task_names': task_names }`
*   `/tasks/total` `POST`, `GET`
    *   Gets total time spent on a task.
    *   Parameters (Form Data):
        *   `taskId`: Task ID.
        *   `taskName`: Task Name (alternative to `taskId`).
    *   Response (Success 200): `{'report':{'ttot': task.total_time_on_task, 'taskName': task.task_name}}`
*   `/tasks/update` `POST`
    *   Updates a task's name.
    *   Parameters (Form Data):
        *   `taskId`: Task ID.
        *   `newName`: New task name.
    *   Response (Success 200): `{'message': 'Task updated successfully'}`
*   `/tasks/delete` `DELETE`
    *   Deletes a task.
    *   Parameters (Form Data):
        *   `taskId`: Task ID.
    *   Response (Success 200): `{'message': 'Task deleted successfully!'}`

**4. Log Endpoints**

*   `/new_log` `POST`
    *   Creates a new log entry.
    *   Parameters (Form Data):
        *   `taskId`: Task ID.
        *   `taskName`: Task Name (alternative to `taskId`).
        *   `userId`: User ID.
        *   `timeOnTask`: Time spent on task.
        *   `timeWasted`: Time wasted.
    *   Response (Success 200): `{'message': 'Log created successfully'}`

**5. Report Endpoints**

*   `/report/daily` `POST`, `GET`
    *   Gets a daily report.
    *   Parameters (Form Data):
        *   `userId`: User ID.
        *   `date`: Date for the report (YYYY-MM-DD or "today").
    *   Response (Success 200): `{'report': daily_report}`
*   `/report/weekly` `POST`, `GET`
    *   Gets a weekly report.
    *   Parameters (Form Data):
        *   `userId`: User ID.
        *   `week`: "this_week", "last_week", or "custom".
        *   `date` (if `week` is "custom"): Date for custom week (YYYY-MM-DD).
    *   Response (Success 200): `{'report': weekly_report}`
*   `/report/monthly` `POST`, `GET`
    *   Gets a monthly report.
    *   Parameters (Form Data):
        *   `userId`: User ID.
        *   `month`: Month for the report (e.g., "January").
    *   Response (Success 200): `{'report': monthly_report }`
*   `/report/productive` `POST`, `GET`
    *   Gets total productive time for a user.
    *   Parameters (Form Data):
        *   `userId`: User ID.
    *   Response (Success 200): `{'report': tpt}`
*   `/report/wasted` `POST`, `GET`
    *   Gets total wasted time for a user.
    *   Parameters (Form Data):
        *   `userId`: User ID.
    *   Response (Success 200): `{'report': twt}`

#### Version 2 API (`/api/v2`)

Version 2 API introduces improved authentication, activity management, and reporting features.

**1. Authentication Endpoints (`/api/auth`)**

*   `/login` `POST`
    *   Logs in a user.
    *   Request Body (JSON):
        ```json
        {
          "email": "user@example.com",
          "password": "password"
        }
        ```
    *   Response (Success 200): `{'message': 'Login successful!', 'data': {'token': token, 'user': user_data} }`
*   `/signup` `POST`
    *   Signs up a new user.
    *   Request Body (JSON):
        ```json
        {
          "email": "newuser@example.com",
          "full_name": "New User",
          "password": "password123",
          "username": "newusername",
          "weekly_work_hours_goal": 40,
          "number_of_work_days": 5
        }
        ```
    *   Response (Success 200): `{'message': 'User signed up successfully!'}`
*   `/me` `GET`
    *   Gets the current user's profile (requires authentication token).
    *   Headers: `Authorization: Bearer <token>`
    *   Response (Success 200): `{'message': 'User retrieved successfully', 'data': user_data}`

**2. Activity Endpoints (`/api/activity`)**

*   `/activity` `POST`
    *   Creates a new activity.
    *   Headers: `Authorization: Bearer <token>`
    *   Request Body (JSON):
        ```json
        {
          "name": "Coding",
          "description": "Software development tasks",
          "daily_goal": 4,
          "weekly_goal": 20
        }
        ```
    *   Response (Success 201): `{'message': 'Activity created successfully', 'data': activity_dict}`
*   `/activity` `GET`
    *   Gets all activities for the authenticated user.
    *   Headers: `Authorization: Bearer <token>`
    *   Response (Success 200): `{'message': 'Activities retrieved successfully', 'data': activities_list}`
*   `/activity/{activity_id}` `GET`
    *   Gets a specific activity by ID.
    *   Headers: `Authorization: Bearer <token>`
    *   Response (Success 200): `{'message': 'Activity retrieved successfully', 'data': activity_dict}`
*   `/activity/{activity_id}` `PATCH`
    *   Updates a specific activity.
    *   Headers: `Authorization: Bearer <token>`
    *   Request Body (JSON):
        ```json
        {
          "name": "Updated Activity Name",
          "description": "Updated description"
        }
        ```
    *   Response (Success 200): `{'message': 'Activity updated successfully', 'data': activity_dict}`
*   `/activity/{activity_id}` `DELETE`
    *   Deletes a specific activity (soft delete).
    *   Headers: `Authorization: Bearer <token>`
    *   Response (Success 200): `{'message': 'Activity deleted successfully'}`

**3. Report Endpoints (`/api/report`)**

*   `/report` `POST`
    *   Creates a new report for an activity.
    *   Headers: `Authorization: Bearer <token>`
    *   Request Body (JSON):
        ```json
        {
          "activity_id": "activity_unique_id",
          "date": "2025-03-10T10:00:00Z",
          "time_on_task": 2.5,
          "time_wasted": 0.5,
          "comment": "Worked on feature X"
        }
        ```
    *   Response (Success 201): `{'message': 'Report created successfully', 'data': report_data}`
*   `/report` `GET`
    *   Gets reports within a date range.
    *   Headers: `Authorization: Bearer <token>`
    *   Query Parameters:
        *   `start_date`: Start date for report range (YYYY-MM-DD).
        *   `end_date`: End date for report range (YYYY-MM-DD).
    *   Response (Success 200): `{'message': 'Reports retrieved successfully', 'data': reports}`

### Command-Line Interface (CLI)

The `timecraft.py` script provides a command-line interface to interact with TimeCraft.

**Available Commands:**

*   `new User`
    *   Creates a new user and sets the current user ID.
*   `new Task`
    *   Creates a new task for the current user. Requires a current user to be set.
*   `new Log`
    *   Creates a new daily log for a task. Requires a current task to be specified in prompts.
*   `all_tasks`
    *   Lists all tasks for the current user.
*   `total_time_on_task`
    *   Gets the total time spent on a specific task.
*   `delete_task`
    *   Deletes a task.
*   `total_productive_time`
    *   Gets the total productive time for the current user.
*   `total_wasted_time`
    *   Gets the total wasted time for the current user.
*   `daily_report`
    *   Generates a daily report.
*   `weekly_report`
    *   Generates a weekly report.
*   `monthly_report`
    *   Generates a monthly report.
*   `switch_user`
    *   Switches the current user.
*   `quit` or `EOF`
    *   Exits the TimeCraft CLI.
*   `help`
    *   Displays help for available commands.

### Dependencies and Requirements

**Python Dependencies:**

*   `alembic`
*   `annotated-types`
*   `anyio`
*   `appdirs`
*   `asgiref`
*   `attrs`
*   `bcrypt`
*   `blinker`
*   `build`
*   `certifi`
*   `cffi`
*   `charset-normalizer`
*   `click`
*   `coreapi`
*   `coreschema`
*   `crispy-bootstrap4`
*   `cryptography`
*   `decorator`
*   `defusedxml`
*   `Deprecated`
*   `dj-database-url`
*   `dj-rest-auth`
*   `Django`
*   `django-allauth`
*   `django-anymail`
*   `django-cors-headers`
*   `django-crispy-forms`
*   `django-environ`
*   `djangorestframework`
*   `dnspython`
*   `ecdsa`
*   `email_validator`
*   `Fabric3`
*   `fastapi`
*   `fastapi-cli`
*   `flasgger`
*   `Flask`
*   `Flask-Cors`
*   `greenlet`
*   `gunicorn`
*   `h11`
*   `httpcore`
*   `httptools`
*   `httpx`
*   `idna`
*   `invoke`
*   `isoweek`
*   `itsdangerous`
*   `itypes`
*   `Jinja2`
*   `jose`
*   `jsonschema`
*   `jsonschema-specifications`
*   `Mako`
*   `markdown-it-py`
*   `MarkupSafe`
*   `mdurl`
*   `mistune`
*   `mysql-connector-python`
*   `mysqlclient`
*   `oauthlib`
*   `packaging`
*   `paramiko`
*   `passlib`
*   `pep8`
*   `pillow`
*   `psycopg2`
*   `pyasn1`
*   `pycodestyle`
*   `pycparser`
*   `pydantic`
*   `pydantic_core`
*   `Pygments`
*   `PyJWT`
*   `PyNaCl`
*   `pyparsing`
*   `pyproject_hooks`
*   `python-dotenv`
*   `python-jose`
*   `python-multipart`
*   `python3-openid`
*   `PyYAML`
*   `referencing`
*   `requests`
*   `requests-oauthlib`
*   `rich`
*   `rpds-py`
*   `rsa`
*   `shellingham`
*   `shortuuid`
*   `six`
*   `sniffio`
*   `SQLAlchemy`
*   `sqlparse`
*   `starlette`
*   `typer`
*   `typing_extensions`
*   `uritemplate`
*   `urllib3`
*   `uvicorn`
*   `uvloop`
*   `watchfiles`
*   `websockets`
*   `Werkzeug`
*   `whitenoise`
*   `wrapt`

**Node.js Dependencies (for development tools):**

*   `cursor-tools`

### Advanced Usage Examples

1.  **Generating a Weekly Report for Last Week via CLI:**

    ```
    python timecraft.py
    (Tiempo)> switch_user
    Can I please have the user ID?
    : <your_user_id>
    (Tiempo)> weekly_report
    Please choose from these options
    this_week   last_week    custom
    : last_week
    ... weekly report output ...
    ```

2.  **Creating a New Activity and Report via API v2:**

    *   **Create Activity (POST /api/activity):**

        ```bash
        curl -X POST \
          -H "Authorization: Bearer <your_token>" \
          -H "Content-Type: application/json" \
          -d '{
                "name": "Learning New Framework",
                "description": "Studying a new web framework",
                "daily_goal": 2,
                "weekly_goal": 10
              }' \
        http://0.0.0.0:5000/api/activity
        ```

    *   **Create Report (POST /api/report):**

        ```bash
        curl -X POST \
          -H "Authorization: Bearer <your_token>" \
          -H "Content-Type: application/json" \
          -d '{
                "activity_id": "<activity_unique_id>",
                "date": "2025-03-10T14:00:00Z",
                "time_on_task": 2,
                "time_wasted": 0.3,
                "comment": "Initial study and setup"
              }' \
        http://0.0.0.0:5000/api/report
        ```

This documentation provides a comprehensive overview of TimeCraft, including its features, setup, API details, and usage examples. Use this guide to effectively utilize TimeCraft for your time management and analysis needs.