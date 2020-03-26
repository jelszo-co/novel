from django.http import HttpResponse
from django.views import View


class Test(View):
    def get(self, request, *args, **kwargs):
        print(request.fb_user.isAuthenticated, request.fb_user.isAnonymous)
        return HttpResponse()
