from django.contrib import admin
from django.urls import path, include

urls = [
    path('novel/', include('novel.urls')),
    path('user/', include('authorization.urls'))
]

urlpatterns = [
    path('api/', include(urls)),
    path('admin/', admin.site.urls),
]

handler404 = 'backend.frontend_view.frontend_view'
