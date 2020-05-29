import json

from django.http import JsonResponse
from django.utils.decorators import method_decorator
from django.views import View

from authorization.decorator import permission_needed
from comment.decoratos import get_comment_by_id
from comment.models import Comment
from novel.decorator import get_novel_by_path


def commentJson(c):
    return {
        "id": c.pk,
        "likes": None,  # TODO
        "likedByMe": None,  # TODO
        "sender": {
            "id": c.sender.pk,
            "name": c.sender.name
        },
        "writtenAt": c.writtenAt,
        "content": c.content,
        "recipient": {
            "id": c.recipient.pk,
            "name": c.recipient.name
        } if c.recipient else None,
        "replies": []
    }


class CommentByPath(View):
    @method_decorator(get_novel_by_path)
    def get(self, request, *args, **kwargs):
        rootComms = Comment.objects.filter(novel=request.novel, parentComment=None).order_by("-writtenAt")
        resp = []
        for c in rootComms:
            resp.append(commentJson(c))
            repls = Comment.objects.filter(novel=request.novel, parentComment=c).order_by("-writtenAt")
            for r in repls:
                resp[-1]["replies"].append(commentJson(r))

        return JsonResponse(resp, safe=False)

    @method_decorator(get_novel_by_path)
    @method_decorator(permission_needed('not request.fb_user.isAuthenticated',
                                        'You have to be logged in - even with an anonymous account - to write a comment',
                                        'You are banned from writing comments'))
    def post(self, request, *args, **kwargs):
        body = json.loads(request.body.decode('utf-8'))
        if "content" not in body:
            return JsonResponse({"error": "Bad input"}, status=400)
        comm = Comment.objects.create(content=body["content"], sender=request.fb_user, parentComment=None,
                                      novel=request.novel)
        return JsonResponse(commentJson(comm))


class DeleteCommentById(View):
    @method_decorator(get_comment_by_id)
    @method_decorator(
        permission_needed('not (request.fb_user==request.comment.sender or request.fb_user.isAdmin)',
                          'You have to be logged in to delete comments', 'You cannot delete this comment'))
    def delete(self, request, *args, **kwargs):
        request.comment.delete()
        return JsonResponse({"success": "Successfully deleted"})
