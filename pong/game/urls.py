from django.urls import path
from game import views

urlpatterns = [
	path('api/v1/game_users/<int:id>/', views.game_users, name='game_users'),
	path('api/v1/game_requests/<int:id>/', views.game_requests, name='game_requests'),
	path('api/v1/tournament/<int:id>/', views.tournament, name='tournament'),
	path('api/v1/join_tournament/<int:id>/', views.join_tournament, name='tournament'),

	path('api/v1/invite/<int:id>/', views.invite, name='invite'),
	path('api/v1/join/<int:id>/', views.join, name='join'),
	path('api/v1/ignore/<int:id>/', views.ignore, name='ignore'),

	path('local_game/', views.local_game, name='local_game'),
]