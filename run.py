import logging
from app.views import app
FORMAT = '%(asctime)s %(levelname)s: %(message)s'
logging.basicConfig(filename='babylogger.log', level=logging.INFO, format=FORMAT)
app.run('127.0.0.1', '8080')
