from django.http import JsonResponse

from novel.models import Novel


def get_novel_by_path(func):
    def wrapper(request, *args, **kwargs):
        path = kwargs.get('path', '')
        try:
            request.novel = Novel.objects.get(path=path)
            return func(request, *args, **kwargs)
        except Novel.DoesNotExist:
            return JsonResponse({"error": "Novel not found"}, status=404)

    return wrapper
