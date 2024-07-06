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
        print("join_tournament" )
        data = json.loads(request.body)
        users = User.objects.all()
        #by taking the given username and password check if the user is exist in the database   
        return JsonResponse({'message': 'Player not created'})
        return JsonResponse({'message': 'GET request received'})

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
