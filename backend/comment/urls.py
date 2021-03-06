from django.urls import path, include

from comment.views import CommentByPath, DeleteCommentById, ReplyComment, LikeComment, Ban, Unban, Recent, DeleteAll

byId = [
    path('', DeleteCommentById.as_view()),
    path('reply', ReplyComment.as_view()),
    path('like', LikeComment.as_view())
]

byUId = [
    path('ban/', Ban.as_view()),
    path('unban/', Unban.as_view()),
    path('deleteall/', DeleteAll.as_view())
]

urlpatterns = [
    path('path/<str:path>', CommentByPath.as_view()),
    path('id/<int:id>/', include(byId)),
    path('user/<int:id>/', include(byUId)),
    path('recent/', Recent.as_view())
]
