import json

from django.http import JsonResponse
from django.utils.decorators import method_decorator
from django.views import View

from authorization.decorator import permission_needed, get_user_by_id
from authorization.models import User
from comment.decoratos import get_comment_by_id
from comment.models import Comment
from novel.decorator import get_novel_by_path


def commentJson(c, user):
    return {
        "id": c.pk,
        "likes": len(c.liked.all()),
        "likedByMe": c.liked.filter(id=user.id).exists(),
        "sender": {
            "id": c.sender.pk,
            "name": c.sender.name,
            "isAdmin": c.sender.isAdmin
        },
        "writtenAt": c.writtenAt,
        "content": c.content,
        "recipient": {
            "id": c.recipient.pk,
            "name": c.recipient.name,
            "isAdmin": c.sender.isAdmin
        } if c.recipient else None,
        "replies": []
    }


def getCommentsForNovel(novel, user):
    rootComms = Comment.objects.filter(novel=novel, parentComment=None).order_by("-writtenAt")
    resp = []
    for c in rootComms:
        resp.append(commentJson(c, user))
        repls = Comment.objects.filter(novel=novel, parentComment=c).order_by("-writtenAt")
        for r in repls:
            resp[-1]["replies"].append(commentJson(r, user))
    return resp


class CommentByPath(View):
    @method_decorator(get_novel_by_path)
    def get(self, request, *args, **kwargs):
        return JsonResponse(getCommentsForNovel(request.novel, request.fb_user), safe=False)

    @method_decorator(get_novel_by_path)
    @method_decorator(permission_needed('not request.fb_user.isAuthenticated',
                                        'You have to be logged in - even with an anonymous account - to write a comment',
                                        'You are banned from writing comments'))
    def post(self, request, *args, **kwargs):
        body = json.loads(request.body.decode('utf-8'))
        if "content" not in body:
            return JsonResponse({"error": "Bad input"}, status=400)
        Comment.objects.create(content=body["content"], sender=request.fb_user, parentComment=None,
                               novel=request.novel)
        return JsonResponse(getCommentsForNovel(request.novel, request.fb_user), safe=False)


class DeleteCommentById(View):
    @method_decorator(get_comment_by_id)
    @method_decorator(
        permission_needed('not (request.fb_user==request.comment.sender or request.fb_user.isAdmin)',
                          'You have to be logged in to delete comments', 'You cannot delete this comment'))
    def delete(self, request, *args, **kwargs):
        request.comment.delete()
        return JsonResponse(getCommentsForNovel(request.comment.novel, request.fb_user), safe=False)


class ReplyComment(View):
    @method_decorator(get_comment_by_id)
    @method_decorator(permission_needed('not request.fb_user.isAuthenticated or request.fb_user.banned',
                                        'You have to be logged in - even with an anonymous account - to write a comment',
                                        'You are banned from writing comments'))
    def post(self, request, *args, **kwargs):
        body = json.loads(request.body.decode('utf-8'))
        if "content" not in body:
            return JsonResponse({"error": "Bad input"}, status=400)
        Comment.objects.create(content=body["content"], sender=request.fb_user, parentComment=request.comment,
                               novel=request.comment.novel,
                               recipient=User.objects.get(id=body["recipient"]) if "recipient" in body else None)
        return JsonResponse(getCommentsForNovel(request.comment.novel, request.fb_user), safe=False)


class LikeComment(View):
    @method_decorator(get_comment_by_id)
    @method_decorator(permission_needed('not request.fb_user.isAuthenticated or request.fb_user.banned',
                                        'You have to be logged in - even with an anonymous account - to like a comment',
                                        'You are banned from writing comments'))
    def post(self, request, *args, **kwargs):
        if request.comment.liked.filter(id=request.fb_user.id).exists():
            request.comment.liked.remove(request.fb_user)
        else:
            request.comment.liked.add(request.fb_user)
        request.comment.save()
        return JsonResponse(getCommentsForNovel(request.comment.novel, request.fb_user), safe=False)


class Ban(View):
    @method_decorator(get_user_by_id)
    @method_decorator(permission_needed('not request.fb_user.isAdmin',
                                        'Log in to do this',
                                        'You are not admin'))
    def post(self, request, *args, **kwargs):
        user = request.fb_user_byId
        user.banned = True
        user.save()
        return JsonResponse({'success': f'Successfully banned {user.name} from commenting'})


class Unban(View):
    @method_decorator(get_user_by_id)
    @method_decorator(permission_needed('not request.fb_user.isAdmin',
                                        'Log in to do this',
                                        'You are not admin'))
    def post(self, request, *args, **kwargs):
        user = request.fb_user_byId
        user.banned = False
        user.save()
        return JsonResponse({'success': f'Successfully unbanned {user.name} from commenting'})


class Banned(View):
    @method_decorator(permission_needed('not request.fb_user.isAdmin',
                                        'Log in to do this',
                                        'You are not admin'))
    def get(self, request, *args, **kwargs):
        resp: list[dict[str, any]] = []
        for u in User.objects.filter(banned=True):
            resp.append({
                "name": u.name,
                "id": u.id
            })
        return JsonResponse(resp, safe=False)
