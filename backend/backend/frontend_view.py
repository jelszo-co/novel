from django.shortcuts import render


def frontend_view(request, *args, **kwargs):
    return render(request, 'index.html')
