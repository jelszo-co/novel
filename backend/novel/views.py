import json

from django.http import JsonResponse
from django.utils.decorators import method_decorator
from django.views import View

from authorization.decorator import permission_needed
from novel.models import Novel


class GetAllNovels(View):
    def get(self, request, *args, **kwargs):
        langs = Novel._meta.get_field('lang').choices
        resp = {}
        for lang, _ in langs:
            resp[lang] = []
            novels = Novel.objects.filter(lang=lang, private=False).order_by('-uploadedAt')
            yr = -1
            for n in novels:
                if yr != n.uploadedAt.year:
                    yr = n.uploadedAt.year
                    resp[lang].append({})
                    resp[lang][-1][yr] = []
                resp[lang][-1][yr].append({
                    'title': n.title,
                    'path': n.path,
                    'lore': n.lore,
                    'uploadedAt': n.uploadedAt.isoformat()
                })

        return JsonResponse(resp, charset='utf-8')


class NovelTools(View):
    def get(self, request, *args, **kwargs):
        path = kwargs.get('path', '')
        try:
            novel = Novel.objects.get(path=path)
        except Novel.DoesNotExist:
            return JsonResponse({"error": "Novel not found"}, status=404)
        return JsonResponse({
            'title': novel.title,
            'lore': novel.lore,
            'content': novel.content,
            'uploadedAt': novel.uploadedAt.isoformat(),
            'liked': False
        }, charset='utf-8')

    @method_decorator(
        permission_needed('not request.fb_user.isAdmin', 'You have to be logged in to edit novels',
                          'You don\'t have permission to edit this novel'))
    def put(self, request, *args, **kwargs):
        needed_params = {}
        path = kwargs.get('path', '')
        try:
            novel = Novel.objects.get(path=path)
        except Novel.DoesNotExist:
            return JsonResponse({"error": "Novel not found"}, status=404)
        body = json.loads(request.body.decode('utf-8'))
        if 'title' not in body or 'lore' not in body or 'content' not in body or 'lang' not in body or body[
            'lang'] not in Novel._meta.get_field('lang').choices:
            return JsonResponse({"error": "You have to be logged in to upload novels"}, status=400)
        novel.title = body['title']
        novel.lore = body['lore']
        novel.content = body['content']
        novel.lang = body['lang']
        novel.save()
        return JsonResponse({
            'title': novel.title,
            'path': novel.path,
            'lore': novel.lore,
            'content': novel.content,
            'lang': novel.lang
        })
