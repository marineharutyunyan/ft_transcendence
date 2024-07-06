from django.contrib import admin
from django.urls import path, include
# from django.shortcuts import render
# from django.conf.urls import handler404

from . import views
# from django.views.generic import TemplateView

from rest_framework_simplejwt.views import TokenObtainPairView, TokenVerifyView

# def error_404(request, exception):
#     return render(request, 'error.html', status=404)

urlpatterns = [
    path('', views.index, name="index"),
    path('home/', views.home, name="home"),
    path('profile/', views.profile, name="profile"),
    path('api/v1/profile_info/<int:id>/', views.profile_info, name="profile_info"),
    path('match_history/', views.match_history, name="match_history"),
    path('tournaments/', views.tournaments, name="tournaments"),
    path('api/v1/change_settings/<int:id>/', views.change_settings, name="change_settings"),
    path('api/v1/set_profile_pic/<int:id>/', views.set_profile_pic, name="set_profile_pic"),
    path('api/v1/remove_profile_pic/<int:id>/', views.remove_profile_pic, name="remove_profile_pic"),
    path('api/v1/delete_account/<int:id>/', views.delete_account, name="delete_account"),
    path('api/v1/two_fa/<int:id>/', views.two_fa, name="two_fa"),
    path('api/v1/language/<int:id>/', views.language, name="language"),

	path('api/v1/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/v1/token/verify/', TokenVerifyView.as_view(), name='token_verify'),

    path('api/v1/settings/<int:id>/', views.check_settings, name="check_settings"),
    path('settings/', views.settings, name="settings"),

    path('api/v1/history/<int:id>/', views.history, name="history"),
]

# handler404 = error_404