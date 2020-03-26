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

    def save(self, *args, **kwargs):
        path = self.title.lower()
        self.path = path.replace(' ', '-').replace('á', 'a').replace('é', 'e').replace('í', 'i').replace('ó',
                                                                                                         'o').replace(
            'ö', 'o').replace('ő', 'o').replace('ú', 'u').replace('ü', 'u').replace('ű', 'u')
        super(Novel, self).save(*args, **kwargs)
