import functools

from django.http import JsonResponse

from authorization.models import User


def permission_needed(cond403, e401, e403):
    def real(function):
        @functools.wraps(function)
        def wrapper(request, *args, **kwargs):
            if not request.fb_user.isAuthenticated:
                return JsonResponse({'error': e401}, status=401)
            if cond403(request):
                return JsonResponse({'error': e403}, status=403)
            return function(request, *args, **kwargs)

        return wrapper

    return real


def get_user_by_id(func):
    def wrapper(request, *args, **kwargs):
        id = kwargs.get('id', '')
        try:
            request.fb_user_byId = User.objects.get(id=id)
            return func(request, *args, **kwargs)
        except User.DoesNotExist:
            return JsonResponse({"error": "Comment not found"}, status=404)

    return wrapper
