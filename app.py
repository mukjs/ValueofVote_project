import os
import pandas as pd
import numpy as np
from flask import Flask, jsonify, render_template,redirect
import json



# # Create an instance of Flask
app = Flask(__name__)


@app.route("/")
def index():
    return render_template('index.html') 


@app.route("/prov_geojson")
def prov():
    """Return geojson for provinces"""

    prov_json_v2=os.path.join('data','test_prov_v2.json')

    with open(prov_json_v2, 'r') as pj:
        prov_data = json.load(pj)
       

    return jsonify(prov_data)


@app.route("/electoral_districts")
def elec_dist():
    return render_template('electoral_districts.html') 


@app.route("/ed_geojson")
def ed_data():
    """Return geojson for provinces"""

    ed_json=os.path.join('data','electoral_2016.json')

    with open(ed_json, 'r') as ej:
        ed_data = json.load(ej)
       
        
    return jsonify(ed_data)


@app.route("/about")
def about():

    return render_template('about.html')


if __name__ == "__main__":
    #app.run()
    app.run(debug=True)
