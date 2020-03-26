from django.urls import path

from novel.views import Test

urlpatterns = [
    path('', Test.as_view())
]
