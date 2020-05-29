from django.contrib import admin
from django.urls import path, include

urls = [
    path('novel/', include('novel.urls')),
    path('user/', include('authorization.urls')),
    path('comment/', include('comment.urls'))
]

urlpatterns = [
    path('api/v1/', include(urls)),
    path('admin/', admin.site.urls),
]

handler404 = 'backend.frontend_view.frontend_view'
