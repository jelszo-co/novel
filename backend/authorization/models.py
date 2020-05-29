from django.db import models

from novel.models import Novel


class User(models.Model):
    uid = models.CharField(max_length=32, unique=True)
    isAdmin = models.BooleanField(default=False)
    isAnonymous = models.BooleanField(default=False)
    isAuthenticated = models.BooleanField(default=True)
    favorites = models.ManyToManyField(Novel, blank=True)
    name = models.CharField(max_length=32, default='Unknown')

    def __str__(self):  # pragma: no cover
        if self.uid == 'unauthenticated':
            return '*service account - needed for backend*'
        return f'{self.uid} - {self.name} - {"anonim" if self.isAnonymous else ""}{"admin" if self.isAdmin else ""}'
