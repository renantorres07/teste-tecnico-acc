from routes import extrair_logs, get_logs, filter_logs
from flask import Flask
from pymongo import MongoClient
from flask_cors import CORS


app = Flask(__name__)
CORS(app)

client = MongoClient('localhost', 27017)
db = client['teste-tecnico-accenture']
logs_collection = db['logs']


@app.route('/extrair_logs', methods=['GET'])
def extrair_logs_route():
    logs_folder_path = '/home/renan/Teste-tecnico-Accenture/Logs'
    return extrair_logs(logs_folder_path, logs_collection)


@app.route('/logs', methods=['GET'])
def get_logs_route():
    return get_logs(logs_collection)


@app.route('/logs/filter', methods=['GET'])
def filter_logs_route():
    return filter_logs(logs_collection)


if __name__ == '__main__':
    app.run(debug=True)
