import cherrypy
from cherrypy import wsgiserver
from app import app


#cherrypy.engine.start()
#cherrypy.config.update({'engine.autoreload.on':False})
d = wsgiserver.WSGIPathInfoDispatcher({'/': app})
server = wsgiserver.CherryPyWSGIServer(('0.0.0.0', 8080), d)

if __name__ == '__main__':
	try:
		server.start()
	except KeyboardInterrupt:
		server.stop()
