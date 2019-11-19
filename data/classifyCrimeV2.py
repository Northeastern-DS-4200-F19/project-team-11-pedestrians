import csv
import pandas as pd
import numpy as np
import sqlalchemy
from sqlalchemy import create_engine
import json
import xlrd
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

def traverseTree(tree):
    result = []
    for item in tree:
        if(type(tree[0][0]) == list):
            result.extend(traverseTree(item))
        else:
            result.append(item)
    return result

def convertFeatures(features):
    result = []
    x = []
    y = []
    for feature in features:
        name = feature["properties"]["Name"]
        for coord in feature["geometry"]["coordinates"]:
            stuff = traverseTree(coord)
            x.extend(stuff)
            y.extend([name] * len(stuff))
    result.append(x)
    result.append(y)
    return result

## fitting the model and stuff
testData = convertFeatures(geo["features"])
classifier.fit(testData[0],testData[1])

df = pd.read_csv("../data/Boston Crime Data.csv", low_memory=False)
nb =[]
# classifying crime to neighborhoods
for row in df.iterrows():
    y = float(row[1][9].split(", ")[0][1:len(row[1][9].split(", ")[0])])
    x = float(row[1][9].split(", ")[1][0:len(row[1][9].split(", ")[1])-1])
    nb.extend(classifier.predict([[x,y]]))

df["neighborhoods"] = nb
# print(geo["features"][len(geo["features"])])
# test = findBox(geo["features"][len(geo["features"])-1])


df.to_csv("./crimeV3.csv")

