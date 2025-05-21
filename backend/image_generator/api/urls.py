from django.urls import path
from rest_framework.routers import DefaultRouter
from .views import *
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from django.conf.urls.static import static

urlpatterns = [
    # path('generate_images/', generate_images, name='generate_images'),
    path('generate_images/', generate_image, name='generate_images'),
    path('analyze_image/', analyze_image, name='analyze_image'),
    path('generate_prompts/', generate_prompts, name='generate_prompts'),
    path('user_history/', get_user_history, name='get_user_history'),
    path('signup/', signup, name='signup'),
    path('signin/', signin, name='signin'),
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('get_user_data/', get_user_data, name='get_user_data'),
    path('update_user_data/', update_user_data, name='update_user_data'),
    path('request_password_reset/', request_password_reset, name='request_password_reset'),
    path('change_password/', change_password, name='change_password'),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)