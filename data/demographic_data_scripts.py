import csv
import pandas as pd
import numpy as np
import json
import xlrd
import os

demographic = pd.read_excel("https://data.boston.gov/dataset/8202abf2-8434-4934-959b-94643c7dac18/resource/7154cc09-55c4-4acd-99a5-3a233d11e699/download/neighborhoodsummaryclean_1950-2010.xlsx",sheet_name=None)
def createAge(sheet):
    result = []
    name = sheet.iloc[0][0]
    relevant_columns = [1,3,5,7,9,11]
    relevant_rows = [10,11,12,13]
    for col in relevant_columns:
        # date
        date = sheet.iloc[0][col]
        for row in relevant_rows:
            line = []
            line.append(name)
            line.append(date)
            # value
            line.append(sheet.iloc[row][col])
            # category 
            line.append(sheet.iloc[row][0])
            result.append(line)
    return result

def createAgeDatabase(db):
    columns = ["neighborhood"
                ,"time"
                ,"value"
                ,"category"]
    result = []
    for key in db.keys():
        result.extend(createAge(db[key]))
    return pd.DataFrame(result, columns=columns)

complete = createAgeDatabase(demographic)

complete.to_csv("./csv_files/demographic.csv")
