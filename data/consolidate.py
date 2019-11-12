import csv
import pandas as pd
import numpy as np
import sqlalchemy
from sqlalchemy import create_engine
import json
import xlrd
from dotenv import load_dotenv
import os
import pickle
import quandl
from sklearn.neighbors import KNeighborsClassifier

engine = create_engine('sqlite:///boston.db')
classifier = KNeighborsClassifier(n_neighbors=3,algorithm="kd_tree",n_jobs=2)

## pulling test data from geojson
geo = {}

with open('boston.geojson') as constraints:
    geo = json.load(constraints)
    with open("aggregates.json") as agg:
        crime = json.load(agg)
        with open("realAggregates.json") as real:
            real_estate = json.load(real)
            with open("bostonv2.geojson", "w") as fp:
                for feature in geo["features"]:
                    name = feature["properties"]["Name"]
                    feature["properties"]["crime"] = crime[name]
                    try:
                        feature["properties"]["real_estate"] = real_estate[name]
                    except:
                         feature["properties"]["real_estate"] = 0
                json.dump(geo,fp)