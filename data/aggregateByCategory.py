import pandas as pd
df = pd.read_csv("../data/crimeV3.csv", low_memory=False, usecols=["neighborhoods","offense_type","id"])
aggregate = df.groupby("offense_type").agg('count')
agg2 = aggregate.sort_values("id",ascending=False).groupby('id')
agg2.rename(columns={'id':'count'}, inplace=True)
agg2.to_csv("./crimeV4.csv")