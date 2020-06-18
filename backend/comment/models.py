from django.db import models

# Create your models here.
from authorization.models import User
from novel.models import Novel


class Comment(models.Model):
    sender = models.ForeignKey(User, on_delete=lambda: models.SET(User.objects.get(uid='unauthenticated').pk),
                               related_name="sender")
    recipient = models.ForeignKey(User, on_delete=lambda: models.SET(User.objects.get(uid='unauthenticated').pk),
                                  related_name="recipient", null=True, blank=True)
    novel = models.ForeignKey(Novel, models.CASCADE)
    content = models.TextField()
    writtenAt = models.DateTimeField(auto_now_add=True)
    parentComment = models.ForeignKey('self', on_delete=models.CASCADE, null=True, blank=True)
    liked = models.ManyToManyField(User, related_name="liked", blank=True)
