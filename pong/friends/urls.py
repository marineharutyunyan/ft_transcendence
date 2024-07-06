from django.urls import path
from friends import views
# from django.views.generic import TemplateView


urlpatterns = [
    path('api/v1/friends/<int:pk>/', views.friends, name="friends"),
    path('api/v1/requests/<int:pk>/', views.requests , name="requests"),
    path('api/v1/users_list/<int:pk>/', views.users_list, name="users"),
	
    path('api/v1/add_friend/<int:pk>/', views.add_friend, name="add_friend"),
    path('api/v1/accept/<int:pk>/', views.accept, name="accept"),
    path('api/v1/decline/<int:pk>/', views.decline, name="decline"),
    path('api/v1/remove/<int:pk>/', views.remove , name="remove"),
    
]


