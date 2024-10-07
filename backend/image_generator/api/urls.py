from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import *

urlpatterns = [
    path('generate_images/', generate_images, name='generate_images'),
]