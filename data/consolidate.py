
import json
## pulling test data from geojson
geo = {}

with open('boston.geojson') as constraints:
    geo = json.load(constraints)
    with open("aggregates.json") as agg:
        crime = json.load(agg)
        with open("realAggregates.json") as real:
            real_estate = json.load(real)
            with open("bostonv2.geojson", "w") as fp:
                for feature in geo["features"]:
                    name = feature["properties"]["Name"]
                    feature["properties"]["crime"] = crime[name]
                    try:
                        feature["properties"]["real_estate"] = real_estate[name]
                    except:
                         feature["properties"]["real_estate"] = 0
                json.dump(geo,fp)