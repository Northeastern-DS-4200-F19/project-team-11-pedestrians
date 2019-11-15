import csv
import pandas as pd
import numpy as np
from datetime import datetime
# hours = []
# inthours =[]
# houragg = [0] * 24

# with open('Boston Crime Data.csv') as csvfile:
#     readCSV = csv.reader(csvfile, delimiter=',')

#     for row in readCSV:
#         hour = row[11]
#         hours.append(hour)
# csvfile.close()

# for hour in hours:
#     if hour != "HOUR":
#         inthours.append(int(hour))

# for inthour in inthours:
#     currval = houragg[inthour]
#     newval = currval + 1
#     houragg[inthour] = newval

# compiledhour = []
# for x in range(0, len(houragg)):
#     temp = []
#     temp.append(x)
#     temp.append(houragg[x])
#     compiledhour.append(temp)

# # Writing hours and crime count to new CSV file
# with open('aggregatecrime.csv', 'w') as csvFile:
#     writer = csv.writer(csvFile)

#     writer.writerow(["hour", "crimecount"])

#     for x in range(0, len(compiledhour)):
#         writer.writerow(compiledhour[x])
# csvFile.close()


import pandas as pd
df = pd.read_csv("../data/crimeV3.csv", low_memory=False, usecols=["date","neighborhoods","offense_type","id"])
aggregate = df.groupby("offense_type").agg('count')
agg2 = aggregate.sort_values("id",ascending=False).groupby('id').head(5)
print(agg2)
# agg2.rename(columns={'id':'count'}, inplace=True)
# agg2.to_csv("./crimeV4.csv")