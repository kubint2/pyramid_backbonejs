from pyramid.config import Configurator


def main(global_config, **settings):
    config = Configurator(settings=settings)
    config.include('pyramid_jinja2') # note 12 #remove config.include('pyramid_chameleon')
    config.add_route('home', '/')
    config.add_route('hello', '/hello')
    config.add_static_view(name='static', path='tutorial:static') # note 13 static
    config.add_route('hello_json', '/hello.json') # note 14 json renderer
    config.scan('.views')
    return config.make_wsgi_app()