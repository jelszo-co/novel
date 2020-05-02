from django.http import HttpResponse, JsonResponse


def frontend_view(request, *args, **kwargs):  # pragma: no cover
    path = request.path.split("/")
    if len(path) >= 2 and path[1] == "api":
        return JsonResponse({"error": "Endpoint not found"}, status=404)
    else:
        return HttpResponse()  # render(request, 'index.html')
