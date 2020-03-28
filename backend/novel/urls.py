from django.urls import path

from novel.views import GetAllNovels, NovelTools

urlpatterns = [
    path('', GetAllNovels.as_view()),
    path('<str:path>',NovelTools.as_view())
]
