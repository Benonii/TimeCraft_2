from v2 import router
from flask import jsonify

@router.route('/', methods=['GET'], strict_slashes=False)
def index():
    return jsonify({"TimeCraft API": "OK"})
