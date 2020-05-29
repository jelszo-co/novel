from django.urls import path, include

from comment.views import CommentByPath, DeleteCommentById

byId = [
    path('', DeleteCommentById.as_view())
]

urlpatterns = [
    path('path/<str:path>', CommentByPath.as_view()),
    path('id/<int:id>', include(byId))
]
