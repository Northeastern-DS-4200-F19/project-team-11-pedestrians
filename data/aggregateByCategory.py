import pandas as pd
df = pd.read_csv("../data/crimeV3.csv", low_memory=False, usecols=["neighborhoods","offense_type","id"])
df.rename(columns={'id':'count'}, inplace=True)
aggregate = df.groupby(["neighborhoods","offense_type"]).agg('count');
#agg2 = aggregate.groupby("offense_type")["count"].sum().nlargest(n = 5)
agg2 = aggregate.groupby("neighborhoods",as_index=False).apply(lambda x:x.nlargest(5,'count'))

print(agg2);
agg2.to_csv("./crimeV4.csv")