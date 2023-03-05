from pyramid.view import (
    view_config,
    view_defaults
    )


@view_defaults(renderer='templates/home.pt')
class TutorialViews:
    def __init__(self, request):
        self.request = request

    # http://localhost:6543/hello/luong/binh
    @view_config(route_name='hello')
    def home(self):
        first = self.request.matchdict['first'] #note
        last = self.request.matchdict['last'] #note
        return {
            'name': 'Home View',
            'first': first,
            'last': last
        }