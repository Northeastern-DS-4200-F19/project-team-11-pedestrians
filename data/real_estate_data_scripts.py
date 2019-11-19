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
        else:
            continue
    return result

quandl.ApiConfig.api_key = os.getenv("QUANDLAPIKEY")

##TODO data too large to completely send over http
##TODO convert DateValues Properly
def realEstateData():
    n = getNCodes()
    result = []
    for row in n:
        try:
            code = "ZILLOW/N%s_MSPFAH" % (row[1])
            realEstate = quandl.get(code)
            realEstate["neighborhood"] = row[0]
            realEstate["category"] = "buy"
            result.append(realEstate)
            rent_code = "ZILLOW/N%s_MRPFAH" % (row[1])
            rent_realEstate = quandl.get(rent_code)
            rent_realEstate["neighborhood"] = row[0]
            rent_realEstate["category"] = "rent"
            result.append(rent_realEstate)
        except:
            print(row[0], code)
            continue
    data = pd.concat(result)
    return data

real = realEstateData()
sorted_real = real.sort_values(by="Date")
# aggregate = sorted_real.groupby(["neighborhood","category"]).agg('mean')
# agg2 = aggregate.groupby(["neighborhood","category"],as_index=False).apply(lambda x:x.nlargest(5,'value'))
# agg2.rename(columns={'value':'price_per_foot'}, inplace=True)
# agg2.reset_index(inplace=True)
# agg2[["neighborhoods","offense_type","hour","count"]].to_csv("./csv_files/crime.csv")
sorted_real.to_csv("./csv_files/real_estate.csv")