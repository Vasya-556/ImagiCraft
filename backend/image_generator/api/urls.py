from django.urls import path
from rest_framework.routers import DefaultRouter
from .views import *
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    path('generate_images/', generate_images, name='generate_images'),
    path('user_history/', get_user_history, name='get_user_history'),
    path('signup/', signup, name='signup'),
    path('signin/', signin, name='signin'),
    path('signout/', signout, name='signout'),
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('get_user_data/', get_user_data, name='get_user_data'),
    path('update_user_data/', update_user_data, name='update_user_data'),
]