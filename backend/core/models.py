from django.db import models
from django.utils import timezone

class DailyUsage(models.Model):
    ip_address = models.GenericIPAddressField(db_index=True)
    date = models.DateField(default=timezone.now)
    request_count = models.PositiveIntegerField(default=0)

    class Meta:
        unique_together = ('ip_address', 'date')

    def __str__(self):
        return f"{self.ip_address} - {self.date}: {self.request_count}"