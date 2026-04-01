from django.db import models


class VisitorCount(models.Model):
    count = models.IntegerField(default=0)

    def __str__(self):
        return f'Visitor Count: {self.count}'
