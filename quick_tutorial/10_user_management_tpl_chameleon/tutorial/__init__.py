from pyramid.config import Configurator
from pyramid.session import SignedCookieSessionFactory

def main(global_config, **settings):
    my_session_factory = SignedCookieSessionFactory('itsaseekreet') #session
    
    config = Configurator(settings=settings,
                          session_factory=my_session_factory)
    # config = Configurator(settings=settings)
    config.include('pyramid_chameleon') #config.include('pyramid_jinja2') # note 12
    config.add_route('home', '/')
    config.add_route('hello', '/hello')
    config.add_static_view(name='static', path='tutorial:static') # note 13 static
    config.add_route('hello_json', '/hello.json') # note 14 json renderer
    config.add_route('users', '/api/users', request_method='GET')
    config.add_route('addUser', '/api/users', request_method='POST')
    config.add_route('deleteUser', '/api/users/{uid}', request_method='DELETE')
    config.add_route('updateUser', '/api/users/{uid}', request_method='PUT')
    config.scan('.views')
    return config.make_wsgi_app()