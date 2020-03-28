from django.conf import settings
from firebase_admin.auth import verify_id_token

from authorization.models import User


class AuthorizationMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        token = request.COOKIES.get('usertoken')
        if token:
            try:
                payload = verify_id_token(token)
                user, _ = User.objects.get_or_create(uid=payload['uid'])
                user.isAnonymous = payload['firebase']['sign_in_provider'] == "anonymous"
                user.save()
                request.fb_user = user
            except:
                request.fb_user = User.objects.get_or_create(uid='unauthenticated', isAuthenticated=False)[0]
        else:
            request.fb_user = User.objects.get_or_create(uid='unauthenticated', isAuthenticated=False)[0]

        response = self.get_response(request)
        return response


class DisableCSRFOnDebug:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        if settings.DEBUG:
            setattr(request, '_dont_enforce_csrf_checks', True)
        response = self.get_response(request)
        return response
