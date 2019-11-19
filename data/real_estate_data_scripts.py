import csv
import pandas as pd
import numpy as np
import json
from dotenv import load_dotenv
import os
import quandl

load_dotenv(verbose=True)
df = pd.read_csv("https://s3.amazonaws.com/quandl-production-static/zillow/neighborhood.txt", low_memory=False)
df1 = pd.read_csv("https://s3.amazonaws.com/quandl-production-static/zillow/indicators.csv", low_memory=False)

# with open('neighborhoods.geojson') as f:
#     data = json.load(f)

def getNCodes():
    result = []
    for row in df.iterrows():
        row_result = []
        for item in row[0]:
            if 'Boston' == str(item).strip():
                row_result.append(row[0][0])
                row_result.append(row[1][0].split("|")[1])
                result.append(row_result)
            else:
                continue
    return result

quandl.ApiConfig.api_key = os.getenv("QUANDLAPIKEY")

def getIndicators():
    result = []
    for row in df1.iterrows():
        row_result = []
        if "Median Listing Price Per Square Foot" == row[1][0].split(" - ")[0]:
            row_result.append(row[1][0].split(" - ")[1].split("|")[0])
            row_result.append(row[1][0].split(" - ")[1].split("|")[1])
            result.append(row_result)
        else:
            continue
    return result

##TODO data too large to completely send over http
##TODO convert DateValues Properly
def realEstateData():
    n = getNCodes()
    indicators = getIndicators()
    result = []
    for row in n:
        for indicator in indicators:
            try:
                code = "ZILLOW/N%s_%s" % (row[1],indicator[1])
                realEstate = quandl.get(code)
                realEstate["neighborhood"] = row[0]
                realEstate["category"] = indicator[0]
                result.append(realEstate)
            except:
                print(row[0], code)
                continue
    data = pd.concat(result)
    return data

real = realEstateData()
sorted_real = real.sort_values(by="Date")
sorted_real.rename(columns={'Date':'time','Value':'value'}, inplace=True)
sorted_real.to_csv("./csv_files/real_estate.csv")