from flask import Flask
app = Flask(__name__)

@app.route('/app')
def hello_world():
    return ('Hello! You have created your first container. <br/> <br/> This is the first step in your world domination')

if __name__ == '__main__':
    app.run(port=3000,host='0.0.0.0')
