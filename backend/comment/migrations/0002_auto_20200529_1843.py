# Generated by Django 3.0.5 on 2020-05-29 16:43

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ('comment', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='comment',
            name='parentComment',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='comment.Comment'),
        ),
    ]
