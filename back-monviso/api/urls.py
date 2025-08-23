from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from .views import LoginView, RegisterView, TestConnectionView, ProfileView

urlpatterns = [
    path('test/', TestConnectionView.as_view(), name='test_connection'),
    path('profile/', ProfileView.as_view(), name='profile'),
    path('auth/login/', LoginView.as_view(), name='login'),
    path('auth/register/', RegisterView.as_view(), name='register'),
    path('auth/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]
