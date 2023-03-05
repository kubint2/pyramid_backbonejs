from pyramid.view import (
    view_config,
    view_defaults
    )


@view_defaults(renderer='templates/home.jinja2')
class TutorialViews:
    def __init__(self, request):
        self.request = request

    @view_config(route_name='home')
    def home(self):
        return {'name': 'Home View'}

    @view_config(route_name='hello')
    def hello(self):
        return {'name': 'Hello View'}

    @view_config(route_name='hello_json', renderer='json')
    def hello(self):
        resultData =  {'name': 'Hello View'}
        return resultData