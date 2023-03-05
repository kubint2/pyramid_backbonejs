from pyramid.view import (
    view_config,
    view_defaults
    )

userData = { 'users': [
    {'_id': 1, 'userid': 'BinhLV', 'role': 'Developer', 'group': 'ATI', 'description': 'Lương Văn Bình'},
    {'_id': 2, 'userid': 'MinhNN', 'role': 'BinhLV', 'group': 'HTV', 'description': 'Nguyễn Ngọc Minh'},
],  'uidSeq' : 3
} 


@view_defaults(renderer='index.jinja2')
class TutorialViews:

    @property
    def counter(self):
        session = self.request.session
        if 'counter' in session:
            session['counter'] += 1
        else:
            session['counter'] = 1

        return session['counter']

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

    @view_config(route_name='users', renderer='json')
    def getUsers(self):
        print("in view.getUsers")
        return userData

    # def getUidSeq(self):
    #     return self.counter(self)

    @view_config(route_name='addUser', renderer='json')
    def addUser(self):
        print("in view.addUser")
        request = self.request
        payload = request.json_body
        userNew = {
            'userid': payload['userid'],
            'role' : payload['role'],
            'group': payload['group'],
            'description': payload['description'],
        }

        # save to dbo
        # userNew['_id'] = self.counter
        userNew['_id'] = userData['uidSeq']
        userData['uidSeq']+=1
        usersDbo = userData["users"] # get from dbo
        usersDbo.append(userNew)
        
        uid = userNew.get('_id')
        print("add successful uid = " + str(uid))
        return {'_id': uid} #{'status': 'Successful to call addUser'}

    @view_config(route_name='deleteUser', renderer='json')
    def deleteUser(self):
        print("in view.deleteUser")
        request = self.request
        uid = int(request.matchdict['uid'])

        usersDbo = userData["users"] # get from dbo
        usersFilter = [user for user in usersDbo if user.get('_id')==uid]
        for i in range(len(usersFilter)):
            usersDbo.remove(usersFilter[i])

        return {'_id': uid} #{'status': 'Successful to call delete'}

    @view_config(route_name='updateUser', renderer='json')
    def updateUser(self):
        print("in view.updateUser")
        request = self.request
        payload = request.json_body
        uid = int(request.matchdict['uid'])

        userReq = {
            'userid': payload['userid'],
            'role' : payload['role'],
            'group': payload['group'],
            'description': payload['description'],
        }

        usersDbo = userData["users"] # get from dbo
        for user in usersDbo:
            if user.get('_id') == uid :
                user.update(userReq)
                print("update successful uid = " + str(uid))

        return {'_id': uid} #{'status': 'Successful to call updateUser'}

    