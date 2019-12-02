import csv
import pandas as pd
import numpy as np
import json
from dotenv import load_dotenv
import os
import quandl

df = pd.read_csv("./csv_files/ChesterSquareSurveyResponses.csv", low_memory=False)

def visitTimeToHour(val):
    if val == "Morning":
        return 7
    elif val == "Afternoon":
        return 14
    else:
        return 21

df["hour"] = [visitTimeToHour(x) for x in df["visittime"]]
print(df["hour"])
df.to_csv("./csv_files/ChesterSquareSurveyResponses.csv")