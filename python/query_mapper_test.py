from app.properties_reader import PropertiesReader
from app.query_mapper import QueryMapper

reader = PropertiesReader('credentials.properties')
creds = reader.read_from_file()
babyid = 1
mapper = QueryMapper(creds, babyid)
mapper.get_chart_data_daily(10)
