from cherrypy import wsgiserver
from app import app
import logging

FORMAT = '%(asctime)s %(levelname)s: %(message)s'
logging.basicConfig(filename='babylogger.log', level=logging.INFO,format=FORMAT)

logger = logging.getLogger('startup')
logger.info('Starting BabyLogger')
d = wsgiserver.WSGIPathInfoDispatcher({'/': app})
server = wsgiserver.CherryPyWSGIServer(('0.0.0.0', 8080), d)

if __name__ == '__main__':
    try:
        server.start()
    except KeyboardInterrupt:
        server.stop()