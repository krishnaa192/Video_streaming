
from . import views

from django.urls import path

urlpatterns = [
   path('', views.lobby, name='lobby'),
    path('room', views.room, name='room'),
    path('get_token/',views.getToken, name='getToken')
]
