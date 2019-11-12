import csv
import pandas as pd
import numpy as np

hours = []
inthours =[]
houragg = [0] * 24

with open('Boston Crime Data.csv') as csvfile:
    readCSV = csv.reader(csvfile, delimiter=',')

    for row in readCSV:
        hour = row[11]
        hours.append(hour)
csvfile.close()

for hour in hours:
    if hour != "HOUR":
        inthours.append(int(hour))

for inthour in inthours:
    currval = houragg[inthour]
    newval = currval + 1
    houragg[inthour] = newval

compiledhour = []
for x in range(0, len(houragg)):
    temp = []
    temp.append(x)
    temp.append(houragg[x])
    compiledhour.append(temp)

# Writing hours and crime count to new CSV file
with open('aggregatecrime.csv', 'w') as csvFile:
    writer = csv.writer(csvFile)

    writer.writerow(["hour", "crimecount"])

    for x in range(0, len(compiledhour)):
        writer.writerow(compiledhour[x])
csvFile.close()
