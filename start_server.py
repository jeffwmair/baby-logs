import app
import cherrypy

cherrypy.tree.graft(app.create_app(), '/')
cherrypy.config.update({'server.socket_host': '0.0.0.0',
                        'server.socket_port': 8080,
                        'engine.autoreload.on': False,
                        })

if __name__ == '__main__':
    cherrypy.engine.start()