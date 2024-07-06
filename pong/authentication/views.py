#stexi hert kapvac petq a harcnel Aramin

from django.shortcuts import render, redirect
from django.http import HttpResponse


from django.contrib import messages
from django.contrib.auth import get_user_model
from django.contrib.auth.models import User
from django.utils.crypto import get_random_string
from django.http import JsonResponse

from django.core.mail import send_mail
from django.conf import settings
from django.core.files.storage import default_storage
import base64

from django.views.decorators.csrf import csrf_exempt

import json
import os
from django.utils import timezone
from game.models import Player

from rest_framework_simplejwt.tokens import AccessToken, RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.exceptions import InvalidToken, TokenError

from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response

def signup(request):
    return render(request, "auth/registration.html")

def intra(request):
    return render(request, "auth/intra.html")

@csrf_exempt
def signin(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        email = data.get('email')
        pass1 = data.get('password')
        try:
            user = User.objects.get(email=email, password=pass1)
            access = AccessToken.for_user(user)
            refresh = RefreshToken.for_user(user)
            if user is not None:
                if user.is_active:
                    return JsonResponse({'error': 'User already logged in'}, status=400)
                user.last_login = None
                user.is_active = True
                user.save()
                player, created = Player.objects.get_or_create(user=user)
                if created or not player.image:
                    player.image_to_base64()
                player.save()
                if (player.fa == True):
                    return JsonResponse({'message': 'Login successful',  'access': str(access), 'refresh': str(refresh), 'image': player.image, 'fa': player.fa}, status=200)
                return JsonResponse({'message': 'Login successful',  'access': str(access), 'refresh': str(refresh), 'image': player.image}, status=200)
            else:
                return JsonResponse({'error': 'Invalid credentials'}, status=400)
        except User.DoesNotExist:
            return JsonResponse({'error': 'Invalid credentials'}, status=400)
    return render(request, "./auth/login.html")

@csrf_exempt
def confirm(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            if not data.get('email') or not data.get('password') or not data.get('name') or not data.get('username'):
                return JsonResponse({'error': 'Invalid JSON data'}, status=400)
            name = data.get('name')
            username = data.get('username')
            email = data.get('email')
            password = data.get('password')

            user = get_user_model().objects.create(
                first_name=name,
                username=username,
                email=email,
                password=password,
                is_active = False
            )
            player = Player.objects.create(user=user)
            image_path = os.path.join(os.path.dirname(__file__), '..', 'main', 'static', 'images', 'default_user.jpg')
            with default_storage.open(image_path, 'rb') as image_file:
                encoded_image = base64.b64encode(image_file.read()).decode('utf-8')
                player.image = encoded_image
                player.save()
            return JsonResponse({'message': 'Data saved successfully', 'image': player.image}, status=201)
        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON data'}, status=400)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)
    return render(request, "./auth/confirm.html")

@csrf_exempt
def fa_confirm(request):
    return render(request, "./auth/fa_confirm.html")

@csrf_exempt
def logout(request, id):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            if not data.get('refresh') or not data.get('token'):
                return JsonResponse({'error': 'Invalid JSON data'}, status=400)
            refresh = data.get('refresh')
            token = RefreshToken(refresh)
            token.blacklist()
            user = User.objects.get(id=id)
            if user is None:
                return JsonResponse({'error': 'User not found'}, status=404)
            user.last_login = timezone.now()
            user.is_active = False
            user.save()
            return JsonResponse({'message': 'Logout successful'}, status=200)
        except TokenError:
            return JsonResponse({'error': 'Invalid token'}, status=400)

