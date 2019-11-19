import pandas as pd
import csv
import numpy as np
from datetime import datetime
import json
import os
from shapely.geometry import shape, Point
## Aggregating Legacy and Current Crime Tracking System

df = pd.read_csv("./csv_files/cs_crime_i.csv", low_memory=False)
df1 = pd.read_csv("./csv_files/cs_crime_ii.csv", low_memory=False)

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
        result = datetime.strptime(d, '%m/%d/%Y %H:%M').strftime("%H")
    except:
        result = datetime.strptime(d, '%Y-%m-%d %H:%M:%S %p').strftime("%H")
    return result

data = {}
data["id"] = mergeCols(df["COMPNOS"],df1["INCIDENT_NUMBER"])
data["offense_type"] = mergeCols(df["INCIDENT_TYPE_DESCRIPTION"],df1["OFFENSE_DESCRIPTION"])
data["year"] = mergeCols(df["Year"],df1["YEAR"])
data["month"]= mergeCols(df["Month"],df1["MONTH"])
data["day_of_Week"]= mergeCols(df["DAY_WEEK"], df1["DAY_OF_WEEK"])
data["ucr_oart"] = mergeCols(df["UCRPART"], df1["UCR_PART"])
data["lat"] = mergeCols(df["X"], df1["Lat"])
data["long"] = mergeCols(df["Y"] , df1["Long"])
data["location"] = mergeCols(df["Location"], df1["Location"])
data["street"] = mergeCols(df["STREETNAME"], df1["STREET"])
data["date"] = mergeCols(df["FROMDATE"], df1["OCCURRED_ON_DATE"])

crime = pd.DataFrame(data)

## Classifying Neighborhoods

## pulling test data from geojson
geo = {}
with open('./json_files/boston.geojson') as constraints:
    geo = json.load(constraints)

## classifying crime to neighborhoods
def classify(location):
    result = ""
    y = float(row[1][9].split(", ")[0][1:len(row[1][9].split(", ")[0])])
    x = float(row[1][9].split(", ")[1][0:len(row[1][9].split(", ")[1])-1])
    point = point(y,x)
    for feature in geo["features"]:
        nb_name = feature["properties"]["Name"]
        area = shape(feature["geometry"])
        if(area.contains(point)):
            result = nb_name
            break
        else:
            continue
    return result

# crime["neighborhoods"] = crime["location"].apply(location)

## Creating Hour Field
# crime["hour"] = crime["date"].apply(toHour)
## Aggregating Dataset
df = pd.read_csv("./csv_files/crimes_with_neighborhoods.csv", low_memory=False)
df["hour"] = df["date"].apply(toHour)
aggregate = df.groupby(["neighborhoods","offense_type","hour"]).agg('count')
agg2 = aggregate.groupby(["neighborhoods","offense_type","hour"],as_index=False).apply(lambda x:x.nlargest(5,'id'))
agg2.rename(columns={'id':'count'}, inplace=True)
agg2.reset_index(inplace=True)
print(agg2.columns)
agg2[["neighborhoods","offense_type","hour","count"]].to_csv("./csv_files/crime_test.csv")

# with open('boston.geojson') as constraints:
#     geo = json.load(constraints)
#     with open("aggregates.json") as agg:
#         crime = json.load(agg)
#         with open("realAggregates.json") as real:
#             real_estate = json.load(real)
#             with open("bostonv2.geojson", "w") as fp:
#                 for feature in geo["features"]:
#                     name = feature["properties"]["Name"]
#                     feature["properties"]["crime"] = crime[name]
#                     try:
#                         feature["properties"]["real_estate"] = real_estate[name]
#                     except:
#                          feature["properties"]["real_estate"] = 0
#                 json.dump(geo,fp)




