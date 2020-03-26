from django.urls import path, include

urls = [
    path('novel/', include('novel.urls'))
]

urlpatterns = [path('api/', include(urls))]
