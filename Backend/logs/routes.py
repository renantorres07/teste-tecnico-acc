from flask import jsonify, request
from datetime import datetime
from bson import ObjectId
import os


def extrair_logs(logs_folder_path, logs_collection):
    try:
        if os.path.exists(logs_folder_path) and \
         os.path.isdir(logs_folder_path):
            logs_content = []
            for filename in os.listdir(logs_folder_path):
                file_path = os.path.join(logs_folder_path, filename)
                if os.path.isfile(file_path) and filename.endswith('.log'):
                    with open(file_path, 'r') as file:
                        for line in file:
                            log_data = line.strip().split(';')
                            if len(log_data) >= 6:
                                log_entry = {
                                    'ip_address': log_data[0],
                                    'date': datetime.strptime(
                                       log_data[1], '%d-%b-%Y'
                                       ).strftime('%Y-%m-%d'),
                                    'time': datetime.strptime(
                                        log_data[2], '%H:%M:%S.%f'
                                        ).strftime('%H:%M:%S'),
                                    'username': log_data[3],
                                    'version': log_data[4],
                                    'document': log_data[5],
                                    'description': log_data[6]
                                }
                                logs_content.append(log_entry)

            if logs_content:
                result = logs_collection.insert_many(logs_content)
                inserted_ids_str = [str(id_) for id_ in result.inserted_ids]
                return jsonify({
                    'message': 'Logs extraídos e salvos com sucesso',
                    'inserted_ids': inserted_ids_str
                }), 200
            else:
                return jsonify({'message': 'Nenhum log foi processado'}), 200

        else:
            return jsonify({'error': 'Pasta de logs não encontrada '
                           'ou é um diretório.'}), 404

    except Exception as e:
        return jsonify({'error': str(e)}), 500


def serialize(obj):
    if isinstance(obj, ObjectId):
        return str(obj)
    elif isinstance(obj, dict):
        return {key: serialize(value) for key, value in obj.items()}
    elif isinstance(obj, list):
        return [serialize(item) for item in obj]
    elif isinstance(obj, (int, float, str, bool, type(None))):
        return obj
    else:
        return str(obj)


def get_logs(logs_collection):
    try:
        logs = list(logs_collection.find({}))
        serialized_logs = [serialize(log) for log in logs]
        return jsonify({'logs': serialized_logs}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500


def filter_logs(logs_collection):
    try:
        start_date = request.args.get('date__gte')
        end_date = request.args.get('date__lte')
        keyword = request.args.get('keyword')

        print(
            f"date__gte: {start_date},date__lte: {end_date},keyword: {keyword}"
        )

        filters = {}

        if start_date and end_date:
            filters['date__gte'] = datetime.strptime(start_date, '%Y-%m-%d')
            filters['date__lte'] = datetime.strptime(end_date, '%Y-%m-%d')

        if keyword:
            filters['description__icontains'] = keyword

        logs = list(logs_collection.find(filters))
        serialized_logs = [{
         'ip_address': log['ip_address'],
         'date': log['date'].strftime('%Y-%m-%d'),
         'time': log['time'].strftime('%H:%M:%S'),
         'username': log['username'],
         'version': log['version'],
         'document': log['document'],
         'description': log['description']
        } for log in logs]
        return jsonify({'logs': serialized_logs}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500
