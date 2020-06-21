from django.urls import path

from authorization.views import UserView

urlpatterns = [
    path('', UserView.as_view())
]
