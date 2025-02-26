from django.shortcuts import render, redirect
from django.http import HttpResponse


from django.contrib import messages
from django.contrib.auth import get_user_model
from django.contrib.auth.models import User
from django.utils.crypto import get_random_string
from django.http import JsonResponse

from django.core.mail import send_mail
from django.conf import settings

from django.views.decorators.csrf import csrf_exempt
from rest_framework_simplejwt.tokens import AccessToken, RefreshToken

import json
from game.models import GameInvite, PongGame, Player, History
from game.serializers import HistorySerializer

from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.tokens import AccessToken
from rest_framework_simplejwt.authentication import JWTAuthentication

import os
import base64
from django.core.files.storage import default_storage


# Create your views here.
def index(request):
    return render(request, 'index.html')

@csrf_exempt
def home(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
        except json.JSONDecodeError:
            return JsonResponse({'message': 'Invalid JSON'}, status=400)
        winners = data.get('winners')
        if not winners:
            return JsonResponse({'message': 'No winners provided'}, status=400)
        round1 = User.objects.get(username=winners[0])
        round2 = User.objects.get(username=winners[1])
        player = User.objects.get(username=winners[2])
        if player == round1:
            History.objects.create(
                player=Player.objects.get(user=round1),
                opponent=Player.objects.get(user=round2),
                points=1, game_mode='1v1', result='win'
                )
            History.objects.create(
                player=Player.objects.get(user=round2),
                opponent=Player.objects.get(user=round1),
                points=0, game_mode='1v1', result='lose'
                )
            player1 = Player.objects.get(user = round1)
            player2 = Player.objects.get(user = round2)
            player1.win = player1.win + 1
            player2.lose = player2.lose + 1
            player1.save()
            player2.save()
        else:
            History.objects.create(
                player=Player.objects.get(user=round2),
                opponent=Player.objects.get(user=round1),
                points=1, game_mode='1v1', result='win'
                )
            History.objects.create(
                player=Player.objects.get(user=round1),
                opponent=Player.objects.get(user=round2),
                points=0, game_mode='1v1', result='lose'
                )
            player1 = Player.objects.get(user = round2)
            player2 = Player.objects.get(user = round1)
            player1.win = player1.win + 1
            player2.lose = player2.lose + 1
            player1.save()
            player2.save()
        game = None
        for pong_game in PongGame.objects.all():
            if player in pong_game.players.all():
                game = pong_game
                break
        if not game:
            return JsonResponse({'message': 'Game not found for the player'}, status=404)
        game.players.clear()
        game.save()
        return JsonResponse({'message': 'Players updated successfully'}, status=200)
    return render(request, 'main/home.html')

@csrf_exempt
def language(request, id):
    if request.method == 'PUT':
        try:
            player = Player.objects.get(user_id=id)
            if player is None:
                return JsonResponse({'error': 'Invalid credentials'}, status=400)
            data = {
                'language': player.language,
            }
            return JsonResponse(data)
        except Player.DoesNotExist:
            return JsonResponse({'error': 'Player not found'}, status=404)

@csrf_exempt
def profile(request):
    return render(request, 'main/profile.html')

@csrf_exempt
def profile_info(request, id):
    if request.method == 'GET':
        try:
            user = User.objects.get(id=id)
            if user is None:
                return JsonResponse({'error': 'Invalid credentials'}, status=400)
            player = Player.objects.get(user_id=id)
            if player is None:
                return JsonResponse({'error': 'Invalid credentials'}, status=400)
            data = {
                'username': user.username,
                'wins': player.win,
                'loses': player.lose,
            }
            return JsonResponse(data)
        except Player.DoesNotExist:
            return JsonResponse({'error': 'Player not found'}, status=404)   
    return JsonResponse({'info': 'Profile info'}, status=200)
            

@csrf_exempt
def match_history(request):
    return render(request, 'main/match_history.html')

@csrf_exempt
def history(request, id):
    if request.method == 'GET':
        try:
            user = User.objects.get(id=id)
        except User.DoesNotExist:
            return JsonResponse({'error': 'User not found'}, status=404)
        try:
            player = Player.objects.get(user_id=id)
        except Player.DoesNotExist:
            return JsonResponse({'error': 'Player not found'}, status=404)

        history = History.objects.filter(player=player)

        serializer = HistorySerializer(history, many=True)
        serialized_data = serializer.data

        formatted_data = []
        for item in serialized_data:
            formatted_data.append({
                'username': item['opponent']['username'],
                'image': item['opponent']['image'],
                'points': item['points'],
                'game_mode': item['game_mode'],
                'result': item['result'],
                'date': item['created_at']
            })

        return JsonResponse(formatted_data, safe=False)

@csrf_exempt
def tournaments(request):
    return render(request, 'main/tournaments.html')

@csrf_exempt
def settings(request):
    if request.method == 'GET':
        return render(request, 'main/settings.html')

@csrf_exempt
def check_settings(request, id):
    if request.method == 'GET':
        try:
            user = User.objects.get(id=id)
            if user:
                return JsonResponse({'username': user.username})
        except User.DoesNotExist:
            return JsonResponse({'error': 'User not found'}, status=404)
    return JsonResponse({'error': 'Invalid request'}, status=400)


@csrf_exempt
def change_settings(request, id):
    if request.method == 'PUT':
            # Get the email from the JSON data
            data = json.loads(request.body)
            user = User.objects.get(id=id)
            # player = Player.objects.get(user_id=id)
            # get data and send to User model
            desired_domain = "student.42yerevan.am"
            if "@" in user.email:
                domain_part = user.email.split("@")[1]
            if domain_part != desired_domain:
                name = data.get('name')
                if name == '' or name is None:
                    name = user.first_name
                username = data.get('username')
                if username == '' or username is None:
                    username = user.username
                email = data.get('email')
                if email == '' or email is None:
                    email = user.email
                pass1 = data.get('password')
                if pass1 == '' or pass1 is None:
                    pass1 = user.password
                try:
                    if user is not None:
                        user.first_name = name
                        user.username = username
                        user.email = email
                        user.password = pass1
                        user.save()                        
                        return JsonResponse({'message': 'Change successful'}, status=200)
                    else:
                        return JsonResponse({'error': 'Invalid credentials'}, status=400)
                except User.DoesNotExist:
                    return JsonResponse({'error': 'Invalid credentials'}, status=400)
            else:
                print("✅ intra user")
                return JsonResponse({'error': 'Intra users are not allowed to change any credentials'}, status=400)
    return render(request, 'main/settings.html')

@csrf_exempt
def delete_account(request, id):
    if request.method == 'DELETE':
            try:
                user = User.objects.get(id = id)
                if user is not None:
                    data = json.loads(request.body)
                    refresh = data.get('refresh')
                    token = RefreshToken(refresh)
                    token.blacklist()
                    user.delete()
                    return JsonResponse({'message': 'Delete successful'}, status=200)
                else:
                    return JsonResponse({'error': 'Invalid credentials'}, status=400)
            except User.DoesNotExist:
                return JsonResponse({'error': 'Invalid credentials'}, status=400)
    return render(request, 'main/settings.html')

@csrf_exempt
def remove_profile_pic(request, id):
    if request.method == 'GET':
        try:
            player = Player.objects.get(user_id = id)
            image_path = os.path.join(os.path.dirname(__file__), '..', 'main', 'static', 'images', 'default_user.jpg')
            with default_storage.open(image_path, 'rb') as image_file:
                encoded_image = base64.b64encode(image_file.read()).decode('utf-8')
                player.image = encoded_image
                player.save()
            return JsonResponse({'message': 'Data saved successfully', 'image': player.image}, status=200)
        except Player.DoesNotExist:
            return JsonResponse({'error': 'Invalid credentials'}, status=400)
    return render(request, 'main/settings.html')

@csrf_exempt
def set_profile_pic(request, id):
    if request.method == 'PUT':
        try:
            player = Player.objects.get(user_id = id)
            data = json.loads(request.body)
            image = data.get('image')
            #cut the first 22 characters from the image string
            image = image[22:]
            if image == '' or image is None:
                image = player.image
            player.image = image
            player.save()
            return JsonResponse({'message': 'Data saved successfully', 'image': player.image}, status=200)
        except Player.DoesNotExist:
            return JsonResponse({'error': 'Invalid credentials'}, status=400)

    return render(request, 'main/settings.html')

@csrf_exempt
def two_fa(request, id):
    print(request.method)
    if request.method == 'POST':
        try:
            player = Player.objects.get(user_id = id)
            data = json.loads(request.body)
            fa = data.get('check')
            player.fa = fa
            player.save()
            return JsonResponse({'message': 'Data saved successfully', 'fa': player.fa}, status=200)
        except Player.DoesNotExist:
            return JsonResponse({'error': 'Invalid credentials'}, status=400)
    return render(request, 'main/settings.html')
