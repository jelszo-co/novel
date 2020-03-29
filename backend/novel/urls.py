from django.urls import path, include

from novel.views import GetAllNovels, NovelTools, NovelFavoriteToggle

novelSpecific = [
    path('', NovelTools.as_view()),
    path('favorite', NovelFavoriteToggle.as_view())
]

urlpatterns = [
    path('', GetAllNovels.as_view()),
    path('<str:path>/', include(novelSpecific))
]
