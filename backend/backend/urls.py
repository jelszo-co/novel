from django.contrib import admin
from django.urls import path, include

urls = [
    path('novel/', include('novel.urls'))
]

urlpatterns = [
    path('api/', include(urls)),
    path('admin/', admin.site.urls)
]
