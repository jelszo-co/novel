import json

from django.http import JsonResponse
from django.utils.decorators import method_decorator
from django.views import View

from authorization.decorator import permission_needed
from authorization.models import User


class UserView(View):
    def get(self, request, *args, **kwargs):
        user = request.fb_user
        print(user)
        return JsonResponse({
            'stranger': not user.isAuthenticated,
            'anonim': user.isAnonymous,
            'authenticated': user.isAuthenticated and not user.isAnonymous and not user.isAdmin,
            'admin': user.isAdmin,
            'name': user.name
        })

    @method_decorator(permission_needed(lambda request: request.fb_user.isAnonymous, 'Log in to change your name',
                                        'Anonymous accounts can\'t change name'))
    def put(self, request, *args, **kwargs):
        decoded = json.loads(request.body)
        if 'name' not in decoded or type(decoded['name']) != str:
            return JsonResponse({'error': 'name parameter not found'}, status=400)
        user = request.fb_user
        user.name = decoded['name']
        user.save()
        return JsonResponse({'name': User.objects.get(id=user.id).name})
