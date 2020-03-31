from django.db import models

from novel.models import Novel


class User(models.Model):
    uid = models.CharField(max_length=32, unique=True)
    isAdmin = models.BooleanField(default=False)
    isAnonymous = models.BooleanField(default=True)
    isAuthenticated = models.BooleanField(default=True)
    favorites = models.ManyToManyField(Novel, blank=True)

    def __str__(self):
        if self.uid == 'unauthenticated':
            return '*service account - needed for backend*'
        return f'{self.uid} - {"anonim" if self.isAnonymous else ""}{"admin" if self.isAdmin else ""}'
