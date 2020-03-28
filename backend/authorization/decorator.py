import functools

from django.http import JsonResponse


def permission_needed(cond403, e401, e403):
    def real(function):
        @functools.wraps(function)
        def wrapper(request, *args, **kwargs):
            if not request.fb_user.isAuthenticated:
                return JsonResponse({'error': e401}, status=401)
            if eval(cond403):
                return JsonResponse({'error': e403}, status=403)
            return function(request, *args, **kwargs)

        return wrapper

    return real
