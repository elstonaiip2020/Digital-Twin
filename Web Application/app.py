from flask import Flask, Response, jsonify, request,redirect
import meterologicalsystem as mt
import physical_asset as ps
import requests
import json
import datetime
import time


app = Flask(__name__)

@app.route("/")
def index():
    return jsonify({"text":"test"})

@app.route("/realtime")
def realtime():
    ''' Function used for simulating and plotting realtime data'''
    def generate_random_data():
 
        flag=0
        times=0
        
        while True:
            
            time.sleep(1)
            
            # Query Meterological Data
            output=mt.mtime(times,flag)
            Ho=mt.mHo(output[0])
            times=output[0]
            flag=output[1]
            meterological_data={'date_time':times,'Ho':Ho}
            
            # Digital Twin Query
            twin_api    =   "http://127.0.0.1:5002/digitaltwin?date_time=" \
                          + str(meterological_data['date_time'].strftime('%Y-%m-%d %H:%M:%S')) \
                          + "&Ho=" + str(meterological_data['Ho'])
            
            twin_output = requests.get(twin_api).json()
            twin_output=twin_output[0]
            
            
            # Physical Asset Query

            physical_output=ps.physicalasset(7.3775,twin_output['Azimuth'],twin_output['Tilt'],\
                                             meterological_data['date_time'].strftime('%Y-%m-%d %H:%M:%S'),\
                                             meterological_data['Ho'])
            physical_output=physical_output[0]
            
            # Data Presentation in webpage
            data={'twin_output':twin_output,'physical_output':physical_output}
            data_json=json.dumps(data)
            yield f"data:{data_json}\n\n"
    return Response(generate_random_data(),mimetype='text/event-stream')

    
    
if __name__ == '__main__':
    app.run(port=5000, debug=True)