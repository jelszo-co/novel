from django.contrib import admin
from django.urls import path, include

from comment.views import Banned
from novel.views import IntroductionView

urls = [
    path('novel/', include('novel.urls')),
    path('user/', include('authorization.urls')),
    path('comment/', include('comment.urls')),
    path('introduction/', IntroductionView.as_view()),
    path('banned/', Banned.as_view()),
]

urlpatterns = [
    path('api/v1/', include(urls)),
    path('djadmin/', admin.site.urls),
]

handler404 = 'backend.frontend_view.frontend_view'
