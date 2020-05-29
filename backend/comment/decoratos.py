from django.http import JsonResponse

from comment.models import Comment


def get_comment_by_id(func):
    def wrapper(request, *args, **kwargs):
        id = kwargs.get('id', '')
        try:
            request.comment = Comment.objects.get(id=id)
            return func(request, *args, **kwargs)
        except Comment.DoesNotExist:
            return JsonResponse({"error": "Comment not found"}, status=404)

    return wrapper
