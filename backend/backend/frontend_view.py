from django.shortcuts import render


def frontend_view(request, *args, **kwargs):  # pragma: no cover
    return render(request, 'index.html')
