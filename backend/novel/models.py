from django.db import models


class Novel(models.Model):
    title = models.CharField(max_length=150, unique=True)
    path = models.CharField(max_length=150, unique=True)
    lore = models.TextField(blank=True, null=True)
    content = models.TextField()
    uploadedAt = models.DateTimeField(auto_now_add=True)
    private = models.BooleanField()
    lang = models.CharField(max_length=2, choices=[
        ('HU', 'Hungarian'),
        ('EN', 'English')
    ], default='HU')

    def __str__(self):  # pragma: no cover
        return self.title

    def save(self, *args, **kwargs):
        path = self.title.lower()
        self.path = path.replace(' ', '-').replace('á', 'a').replace('é', 'e').replace('í', 'i').replace('ó',
                                                                                                         'o').replace(
            'ö', 'o').replace('ő', 'o').replace('ú', 'u').replace('ü', 'u').replace('ű', 'u').replace('?', '').replace(
            ':', '').replace('@', '').replace('+', '').replace('!', '').replace('(', '').replace(')', '')
        if not self.lore:
            self.lore = ''
        super(Novel, self).save(*args, **kwargs)


class Introduction(models.Model):
    key = models.CharField(max_length=32)
    value = models.TextField()

    def __str__(self):
        return f'{self.key}: {self.value}'
