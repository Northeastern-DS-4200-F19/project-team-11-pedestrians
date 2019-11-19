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

df2 = pd.read_csv("./neighborhood.txt",delimiter= "|", low_memory=False)
df3 = pd.read_csv("../data/indicators.csv", low_memory=False)

# with open('neighborhoods.geojson') as f:
#     data = json.load(f)

# for feature in data["features"]:
#     print(feature["properties"]["Name"])

# excel = xlrd.open_workbook("./demographics.xlsx")

def getNCodes():
    result = []
    with engine.connect() as cursor:
        rows = cursor.execute("SELECT * FROM quandl_neighborhoods")
        ##rows = cursor.fetchall()
        for row in rows:
            if "Boston" in row[1] and len(row[1].split(",")) == 4:
                result.append([row[1].split(",")[0],row[2]])
            else:
                continue
    return result

load_dotenv(verbose=True)
quandl.ApiConfig.api_key = os.getenv("QUANDLAPIKEY")

##TODO data too large to completely send over http
##TODO convert DateValues Properly
def realEstateData():
    n = getNCodes()
    result = []
    for row in n:
        try:
            code = "ZILLOW/N%s_MLPAH" % (row[1])
            print(code)
            realEstate = quandl.get(code)
            realEstate["neighborhood"] = row[0]
            result.append(realEstate)
        except:
            continue
    data = pd.concat(result)
    return data

# def createAge(sheet):
#     result = []
#     relevant_columns = [1,3,5,7,9]
#     relevant_rows = [1,4,5,6,7,8,9,11,12,13,14,16,18,19,20,21,22,24,25,27,28,29]
#     for col in relevant_columns:
#         line = []
#         line.append(sheet.name)
#         for row in relevant_rows:
#             line.append(sheet.cell(row,col).value)
#         result.append(line)
#     return result

# def createAgeDatabase(excel):
#     columns = ["neighborhood"
#                 ,"year"
#                 ,"0 - 9 years"
#                 ,"10 - 19 years"
#                 ,"20 - 34 years"
#                 ,"25 - 54 years"
#                 ,"55 - 64 years"
#                 ,"65 years and over"
#                 ,"less than High School"
#                 ,"High School or GED"
#                 ,"Some College or Associate's Degree"
#                 ,"Bachelor's Degree or Higher"
#                 ,"Foreign Born"
#                 ,"White"
#                 ,"Black/ African American"
#                 ,"Hispanic"
#                 ,"Asian/PI"
#                 ,"Other"
#                 ,"Male"
#                 ,"Female"
#                 ,"Occupied Housing Units"
#                 ,"Owner-occupied"
#                 ,"Renter-occupied"
#                 ]
#     result = []
#     for sheet in excel.sheets():
#         result.extend(createAge(sheet))
#     return pd.DataFrame(result, columns=columns)

# demographic = createAgeDatabase(excel)
# crime = pd.DataFrame(data)

# demographic.to_csv("./demographic.csv")
# crime.to_csv("./crime.csv")
# df2.to_csv("./data/quandl_neighborhoods.csv")
# df3.to_csv("./data/quandl_indicators.csv")

# demographic.to_sql("demographic",engine)
# crime.to_sql("crime",engine)
# df2.to_sql("quandl_neighborhoods",engine)
# df3.to_sql("quandl_indicators",engine)

real = realEstateData()
# real.sort_values(by='Date')
# real = pd.read_csv("real_estate.csv")
sorted_real = real.sort_values(by="Date")
sorted_real.to_csv("real_estate.csv")

# real.to_sql("real_estate",engine)