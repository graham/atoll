#! /usr/bin/env python
from bottle import route, run, static_file, request
import os
import json
import time
 
@route('/:path#.+#')
def server_static(path):
    if path.endswith('/'):
        path = path.replace('..', '')
        return json.dumps(os.listdir(os.path.abspath(path)))
    else:
        return open(os.path.abspath(path)).read()

@route('/request/user_data')
def user_data():
    time.sleep(1)
    return json.dumps({
        'username':'Graham',
        'email':'graham.abbott@gmail.com',
        'github':'http://github.com/graham/',
        'tags':['one', 'two', 'three']
    })

import sys
 
if len(sys.argv) > 1:
    port = int(sys.argv[1])
else:
    port = 4040
 
run(host='127.0.0.1', port=port)
