from django.contrib import admin
from django.urls import path, include

from backend.frontend_view import frontend_view

urls = [
    path('novel/', include('novel.urls'))
]

urlpatterns = [
    path('api/', include(urls)),
    path('admin/', admin.site.urls),
]

handler404 = 'backend.frontend_view.frontend_view'
