import pandas as pd
import csv
import numpy as np
from datetime import datetime
import json
import os
from shapely.geometry import shape, Point
from fuzzywuzzy import process

## TODO implement string similarity for crime categories
## TODO reiterate through this data set once a week for discrepancies

## Aggregating Legacy and Current Crime Tracking System
df1 = pd.read_csv("https://data.boston.gov/dataset/6220d948-eae2-4e4b-8723-2dc8e67722a3/resource/12cb3883-56f5-47de-afa5-3b1cf61b257b/download/tmp3bg1m024.csv")
df = pd.read_csv("https://data.boston.gov/dataset/eefad66a-e805-4b35-b170-d26e2028c373/resource/ba5ed0e2-e901-438c-b2e0-4acfc3c452b9/download/crime-incident-reports-july-2012-august-2015-source-legacy-system.csv", low_memory=False)
## pulling test data from geojson
geo = {}
with open('./json_files/boston.geojson') as constraints:
    geo = json.load(constraints)

## defining functions
def colComparison(df1,df2,colname1,colname2):
    result = []
    for item in set(df1[colname1]):
        if item.upper() in set(df2[colname2]):
            result.append(item)
        else:
            continue
    return result

def mergeCols(col1,col2):
    return np.concatenate((col1.values, col2.values))

def toHour(d):
    result = 0
    try:
        result = datetime.strptime(d, '%m/%d/%Y %H:%M:%S %p').strftime("%H")
    except:
        result = datetime.strptime(d, '%Y-%m-%d %H:%M:%S').strftime("%H")
    return result

## classifying crime to neighborhoods
def classify(location):
    result = ""
    y = float(location.split(", ")[0][1:len(location.split(", ")[0])])
    x = float(location.split(", ")[1][0:len(location.split(", ")[1])-1])
    point = Point(x,y)
    for feature in geo["features"]:
        nb_name = feature["properties"]["Name"]
        area = shape(feature["geometry"])
        if(area.contains(point)):
            result = nb_name
            break
        else:
            continue
    return result

newCategories = df1["OFFENSE_CODE_GROUP"].unique()

def legacyToNew(category):
    highest = process.extractOne(category, newCategories)
    if(highest[1] < 50):
        return category
    else: 
        return highest[0]

# Recategorizing legacy crime categories
df["OFFENSE_CODE_GROUP"] = df["INCIDENT_TYPE_DESCRIPTION"].apply(legacyToNew)

data = {}
data["id"] = mergeCols(df["COMPNOS"],df1["INCIDENT_NUMBER"])
data["offense_type"] = mergeCols(df["OFFENSE_CODE_GROUP"],df1["OFFENSE_CODE_GROUP"])
data["year"] = mergeCols(df["Year"],df1["YEAR"])
data["month"]= mergeCols(df["Month"],df1["MONTH"])
data["day_of_Week"]= mergeCols(df["DAY_WEEK"], df1["DAY_OF_WEEK"])
data["ucr_oart"] = mergeCols(df["UCRPART"], df1["UCR_PART"])
data["lat"] = mergeCols(df["X"], df1["Lat"])
data["long"] = mergeCols(df["Y"] , df1["Long"])
data["location"] = mergeCols(df["Location"], df1["Location"])
data["street"] = mergeCols(df["STREETNAME"], df1["STREET"])
data["date"] = mergeCols(df["FROMDATE"], df1["OCCURRED_ON_DATE"])

# crime = pd.DataFrame(data)

# Creating Hour Field, Classifying Crime, Saving base level dataset
crime["hour"] = crime["date"].apply(toHour)
crime["neighborhoods"] = crime["location"].apply(classify)
crime.to_csv("./csv_files/boston_crime.csv")

# Aggregating Dataset
aggregate = crime.groupby(["neighborhoods","offense_type","hour"]).agg('count')
aggregate.rename(columns={'id':'count'}, inplace=True)
aggregate.reset_index(inplace=True)
aggregate[["neighborhoods","offense_type","hour","count"]].to_csv("./csv_files/crime.csv")



