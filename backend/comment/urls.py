from django.urls import path

from comment.views import CommentByPath

urlpatterns = [
    path('path/<str:path>', CommentByPath.as_view())
]
