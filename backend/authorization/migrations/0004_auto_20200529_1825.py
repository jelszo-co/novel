# Generated by Django 3.0.5 on 2020-05-29 16:25

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ('authorization', '0003_user_name'),
    ]

    operations = [
        migrations.AlterField(
            model_name='user',
            name='isAnonymous',
            field=models.BooleanField(default=False),
        ),
    ]
