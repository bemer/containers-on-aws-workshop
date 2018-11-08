from flask import Flask, json
from flask_cors import CORS
from datetime import datetime
import os
import uuid
import boto3
from boto3.dynamodb.conditions import Key, Attr
from botocore.exceptions import ClientError

app = Flask(__name__)
cors = CORS(app, resources={r"/api/*": {"origins": "*"}})

dynamo = boto3.resource('dynamodb')
table = dynamo.Table(os.environ['apiTable'])

def insertItem(option):
  try:
    response = table.put_item(
      Item = {
        'id': uuid.uuid4().hex,
        'vote': option,
        'dateTime': datetime.now().isoformat()
      }
    )
    return response
  except ClientError as e:
    return(e.response)

def listItem(option):
  try:
    response = table.query(
      Select='COUNT',
      KeyConditionExpression=Key('vote').eq(option)
    )
    return response
  except ClientError as e:
    return(e.response)

def responseGenerator(code, msg):
  response = app.response_class(
    response=json.dumps(msg),
    status=code,
    mimetype='application/json'
  )
  return response

@app.route('/api/')
def hello():
  return responseGenerator(200, {'msg': 'Chicken or Pasta API'})

@app.route('/api/votes/<option>', methods = ['GET'])
def getVote(option):
  data = listItem(option)
  if data['ResponseMetadata']['HTTPStatusCode'] == 200:
    return responseGenerator(data['ResponseMetadata']['HTTPStatusCode'], 
                            {'StatusCode': data['ResponseMetadata']['HTTPStatusCode'],
                            'Count': data['Count'],
                            'msg': 'Ok'})
  else:
    return responseGenerator(data['ResponseMetadata']['HTTPStatusCode'], 
                            {'StatusCode': data['ResponseMetadata']['HTTPStatusCode'],
                            'Code': data['Error']['Code'],
                            'msg': data['Error']['Message']})


@app.route('/api/votes/chicken', methods = ['POST'])
def chickenVote():
  data = insertItem('chicken')
  if data['ResponseMetadata']['HTTPStatusCode'] == 200:
    return responseGenerator(data['ResponseMetadata']['HTTPStatusCode'], 
                            {'StatusCode': data['ResponseMetadata']['HTTPStatusCode'],
                            'msg': 'Your vote was counted!'})
  else:
    return responseGenerator(data['ResponseMetadata']['HTTPStatusCode'], 
                            {'StatusCode': data['ResponseMetadata']['HTTPStatusCode'],
                            'Code': data['Error']['Code'],
                            'msg': data['Error']['Message']})

@app.route('/api/votes/pasta', methods = ['POST'])
def pastaVote():
  data = insertItem('pasta')
  if data['ResponseMetadata']['HTTPStatusCode'] == 200:
    return responseGenerator(data['ResponseMetadata']['HTTPStatusCode'], 
                            {'StatusCode': data['ResponseMetadata']['HTTPStatusCode'],
                            'msg': 'Your vote was counted!'})
  else:
    return responseGenerator(data['ResponseMetadata']['HTTPStatusCode'], 
                            {'StatusCode': data['ResponseMetadata']['HTTPStatusCode'],
                            'Code': data['Error']['Code'],
                            'msg': data['Error']['Message']})

@app.errorhandler(404)
def page_not_found(e):
    return responseGenerator(404, 
                            {'StatusCode': 404,
                            'msg': 'Sorry!'})

if __name__ == "__main__":
  app.run(host='0.0.0.0')