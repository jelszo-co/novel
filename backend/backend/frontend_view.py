from django.http import JsonResponse


def pagenotfound_view(request, *args, **kwargs):  # pragma: no cover
    return JsonResponse({"error":"Not existing endpoint"},status=404)
