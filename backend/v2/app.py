#!/usr/bin/python3
""" Flask App """


from v2.models import storage
from os import environ
from flask import Flask, make_response, jsonify
from flask_cors import CORS
from flasgger import Swagger
from . import router
from v2.auth.index import auth_router


# Initializing app
app = Flask(__name__)
app.config['JSONIFY_PRETTYPRINT_REGULAR'] = True

# Registering blueprint on app
app.register_blueprint(router, url_prefix="/api")
app.register_blueprint(auth_router)

# Setting up Cross-Origin-Resource-Sharing properly
CORS(app, resources={r"/api/*": {"origins": "*"}})

# Closes the Database session when necessary
@app.teardown_appcontext
def close_db(error):
    """ Terminate database session """
    storage.close()

# Handles 404 errors
@app.errorhandler(404)
def not_found(error):
    """ 404 Error
    ---
    response:
      404:
        description: a resource was not found
    """
    return make_response(jsonify({'error': "NOT FOUND"}), 404)

# Documentation tool
app.config['SWAGGER'] = {
    'title': 'TimeCraft',
    'uiversion': 3
}

Swagger(app)

# Run the Flask app
if __name__ == "__main__":
    """ Main Function """
    host = environ.get('HBNB_API_HOST', '0.0.0.0')
    port = environ.get('HBNB_API_PORT', 5000)
    app.run(host=host, port=int(port), threaded=True, debug=True)
