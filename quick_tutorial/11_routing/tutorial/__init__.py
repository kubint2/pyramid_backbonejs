from pyramid.config import Configurator


def main(global_config, **settings):
    config = Configurator(settings=settings)
    config.include('pyramid_chameleon')
    #config.add_route('home', '/')
    config.add_route('hello', '/hello/{first}/{last}') #note
    config.scan('.views')
    return config.make_wsgi_app()