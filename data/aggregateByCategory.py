import pandas as pd
df = pd.read_csv("../data/crimeV3.csv", low_memory=False, usecols=["neighborhoods","offense_type","id"])
aggregate = df.groupby(["neighborhoods","offense_type"]).agg('count')
agg2 = aggregate.groupby("neighborhoods",as_index=False).apply(lambda x:x.nlargest(5,'id'))
agg2.rename(columns={'id':'count'}, inplace=True)
agg2.to_csv("./crimeV4.csv")