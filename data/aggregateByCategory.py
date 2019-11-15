import pandas as pd
df = pd.read_csv("../data/crimeV3.csv", low_memory=False, usecols=["neighborhoods","offense_type","id"])
aggregate = df.groupby(["neighborhoods","offense_type"]).agg('count')
# aggregate.columns=["neighborhoods","offense_type","count"]
aggregate.rename(columns={'id':'count'}, inplace=True)
aggregate.to_csv("./crimeV4.csv")