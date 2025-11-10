from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from .views import LoginView, RegisterView, TestConnectionView, ProfileView, OnboardingView, OnboardingStatusView, FinancialDataView, TransactionListCreateView, TransactionDetailView, CategoryListCreateView, CategoryDetailView

urlpatterns = [
    path('test/', TestConnectionView.as_view(), name='test_connection'),
    path('profile/', ProfileView.as_view(), name='profile'),
    path('auth/login/', LoginView.as_view(), name='login'),
    path('auth/register/', RegisterView.as_view(), name='register'),
    path('auth/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('onboarding/', OnboardingView.as_view(), name='onboarding'),
    path('onboarding/status/', OnboardingStatusView.as_view(), name='onboarding_status'),
    path('dashboard/', FinancialDataView.as_view(), name='dashboard_data'),
    path('financial-data/', FinancialDataView.as_view(), name='financial_data'),
    path('transactions/', TransactionListCreateView.as_view(), name='transactions'),
    path('transactions/<int:pk>/', TransactionDetailView.as_view(), name='transaction_detail'),
    path('categories/', CategoryListCreateView.as_view(), name='categories'),
    path('categories/<int:pk>/', CategoryDetailView.as_view(), name='category_detail'),
]
