from django.shortcuts import render

from django.http import JsonResponse

# from core.serializers import FriendListSerializer
from django.contrib.auth.models import User
from friendship.models import Friend, FriendshipRequest
from game.models import GameInvite, PongGame, Player, History

from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth.hashers import make_password, check_password
from django.views.decorators.csrf import csrf_exempt

import json
from django.utils import timezone


@csrf_exempt
def game_users(request):
    print("Game users")
    if request.method == 'GET':
        print("Game users")
        return JsonResponse({'message': 'GET request received'})
    return render(request, 'main/tournaments.html')

@csrf_exempt
def game_requests(request):
     print("Game requests")
     if request.method == 'GET':
         print("Game requests")
         return JsonResponse({'message': 'GET request received'})
        #  return render(request, '/main/tournaments.html')

@csrf_exempt
def tournament(request, id):
    if request.method == 'GET':
        print("tournament")
        return JsonResponse({'message': 'GET request received'})

@csrf_exempt
def join_tournament(request, id):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
        except json.JSONDecodeError:
            return JsonResponse({'message': 'Invalid JSON'}, status=400)
        requested_data = data.get('requested_data')
        if not requested_data:
            return JsonResponse({'message': 'No requested_data found'}, status=400)
        
        username = requested_data.get('username')
        password = requested_data.get('password')
        try:
            user = User.objects.get(username=username, password=password)
        except User.DoesNotExist:
            return JsonResponse({'message': 'User not found'}, status=404)
        try:
            player = Player.objects.get(user=user)
        except Player.DoesNotExist:
            return JsonResponse({'message': 'Player not found'}, status=404)
        for game in PongGame.objects.all():
            if user in game.players.all():
                return JsonResponse({'message': 'Player already in a game'}, status=400)
        game = PongGame.objects.filter(game_process=False).exclude(players=user).first()
        if game is None or game.is_full():
            game = PongGame.objects.create(game_mode=requested_data.get('game_mode', 'default'))
        game.players.add(user)
    return JsonResponse({'message': 'GET request received'})      


@csrf_exempt
def start_tournament(request, id):
    if request.method == 'POST':
        games = PongGame.objects.filter(game_process=False)
        players = []
        for game in games:
            if game.players.count() == 4:
                players.extend([player.username for player in game.players.all()])
        print("🏓 players", players)
        return JsonResponse({'message': 'Tournament started', 'users': players})

@csrf_exempt
def invite(request, id):
    if request.method == 'POST':
        sender = User.objects.get(id=id).id
        if not sender:
            raise Exception('User not found')
        data = json.loads(request.body)
        if not data.get('receiver_id'):
            raise Exception('Receiver not found')
        receiver = User.objects.get(id=data.get('receiver_id')).id
        if sender == receiver:
            raise Exception('Cannot send invite to self')
        if GameInvite.objects.filter(sender_id=sender, receiver_id=receiver).exists():
            raise Exception('Invite already sent')
        game_invite = GameInvite.objects.create(sender_id=sender, receiver_id=receiver)
        game_invite.save()
        return JsonResponse({'message': 'Invite sent'})


@csrf_exempt
def join(request, id):
    if request.method == 'POST':
        receiver = User.objects.get(id=id).id
        if not receiver:
            raise Exception('User not found')
        data = json.loads(request.body)
        if not data.get('sender_id'):
            raise Exception('Sender not found')
        sender = User.objects.get(id=data.get('sender_id')).id
        if not GameInvite.objects.filter(sender_id=sender, receiver_id=receiver).exists():
            raise Exception('Invite not found')
        game_invite = GameInvite.objects.get(sender_id=sender, receiver_id=receiver)
        game_invite.join_invite()
        return JsonResponse({'message': 'Join accepted'})

@csrf_exempt
def ignore(request, id):
    if request.method == 'POST':
        receiver = User.objects.get(id=id)
        if not receiver:
            raise Exception('User not found')
        data = json.loads(request.body)
        if not data.get('sender_id'):
            raise Exception('Sender not found')
        sender = User.objects.get(id=data.get('sender_id')).id
        if not GameInvite.objects.filter(sender_id=sender, receiver_id=receiver).exists():
            raise Exception('Invite not found')
        game_invite = GameInvite.objects.get(sender_id=sender, receiver_id=receiver)
        game_invite.ignore_invite()
        GameInvite.objects.filter(sender_id=sender, receiver_id=receiver).delete()
        return JsonResponse({'message': 'Ignored'})
    
@csrf_exempt
def get_history(request, id):
    if request.method == 'GET':
        player = User.objects.get(id=id)
        if not player:
            raise Exception('User not found')
        history = History.objects.filter(player=player)
        return JsonResponse({'message': 'History fetched', 'history': history})

def local_game(request):
	return render(request, 'local_game.html')

def local_tournament(request):
	return render(request, 'local_tournament.html')