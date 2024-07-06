from django.urls import path
from intra import views


urlpatterns = [
	path('api/v1/login/', views.login, name='login'),
]