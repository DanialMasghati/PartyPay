from django.urls import path
from .views import CalculateShareView

urlpatterns = [
    path('calculate/', CalculateShareView.as_view(), name='calculate_share'),
]