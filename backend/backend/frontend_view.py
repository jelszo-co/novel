from django.http import HttpResponse


def pagenotfound_view(request, *args, **kwargs):  # pragma: no cover
    return HttpResponse(status=404)
