from django.shortcuts import render

from django.http import JsonResponse

# from core.serializers import FriendListSerializer
from django.contrib.auth.models import User
from friendship.models import Friend, FriendshipRequest
from game.models import Player	

from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from django.views.decorators.csrf import csrf_exempt

import json

# Create your views here.

# def friends(request, id):
	# if request.method == 'GET':

def friends(request, pk):
	if request.method == 'GET':
		user = User.objects.get(pk=pk)
		friends = Friend.objects.friends(user)
		if not friends:
			return JsonResponse({'message': 'No friends'}, status=200)
		#send friends id username friends is_active and their images to the frontend
		friends = [{'id': friend.pk, 'username': friend.username, 'is_active': friend.is_active, 'image': friend.player.image} for friend in friends]
		# friends = [{'id': friend.pk, 'username': friend.username, 'image': friend.player.image} for friend in friends]
		return JsonResponse(friends, safe=False)

def requests(request, pk):
	if request.method == 'GET':
		requests = FriendshipRequest.objects.filter(to_user=pk)
		player = Player.objects.get(user=pk)
		if not requests:
			return JsonResponse({'message': 'No requests'}, status=200)
		# send requests id username and their images to the frontend
		requests = [{'id': request.from_user.pk, 'username': request.from_user.username, 'image': request.from_user.player.image} for request in requests]
		return JsonResponse(requests, safe=False)

def users_list(request, pk):
	if request.method == 'GET':
		user = User.objects.get(pk=pk)
		friends = Friend.objects.friends(user)
		# print("friends", friends)

		# requests = FriendshipRequest.objects.filter(to_user=pk)
		# player = Player.objects.get(user=pk)
		
		friends_set = set()
		for x in friends:
			friends_set.add(x.pk)
		# print("player = ", player)
		# player = [player,]
		# if type(player) == list:
		# 	for i in range(0, len(player), 2):
		# 		friends_set.add(player[i].pk)
		users = User.objects.all()
		# player = Player.objects.get(user=pk)
		# print(friends_set)
		# send users id username and their images to the frontend
		users = [{'id': user.pk, 'username': user.username, 'image': user.player.image, 'is_friend': True if user.pk in friends_set else False} for user in users if user.pk != pk]
		
		return JsonResponse(users, safe=False)

@csrf_exempt
def add_friend(request, pk):
	if request.method == 'POST':
		try:
			sender = User.objects.get(pk=pk)
			if not sender:
				raise Exception('User not found')
			data = json.loads(request.body)
			if not data.get('receiver_id'):
				raise Exception('Receiver not found')
			receiver = User.objects.get(pk=data.get('receiver_id'))
			if not receiver:
				raise Exception('Receiver not found')
			if FriendshipRequest.objects.filter(from_user=sender, to_user=receiver).exists():
				raise Exception('Friend request already sent')
			friend_request = FriendshipRequest.objects.create(from_user=sender, to_user=receiver)
			friend_request.save()
			return JsonResponse({'message': 'Friend request sent'})

		except User.DoesNotExist:
			return JsonResponse({'error': 'User not found'}, status=404)

		except Exception as e:
			return JsonResponse({'error': str(e)}, status=400)

@csrf_exempt
def accept(request, pk):
	if request.method == 'POST':
		receiver = User.objects.get(pk=pk)
		if not receiver:
			raise Exception('User not found')
		data = json.loads(request.body)
		if not data.get('sender_id'):
			raise Exception('Sender not found')
		sender = User.objects.get(pk=data.get('sender_id'))
		if not sender:
			raise Exception('Sender not found')
		friend_request = FriendshipRequest.objects.get(from_user=sender, to_user=receiver)
		friend_request.accept()
		return JsonResponse({'message': 'Friend request accepted'})

@csrf_exempt
def decline(request, pk):
	if request.method == 'POST':
		receiver = User.objects.get(pk=pk)
		if not receiver:
			raise Exception('User not found')
		data = json.loads(request.body)
		if not data.get('sender_id'):
			raise Exception('Sender not found')
		sender = User.objects.get(pk=data.get('sender_id'))
		if not sender:
			raise Exception('Sender not found')
		friend_request = FriendshipRequest.objects.get(from_user=sender, to_user=receiver)
		friend_request.reject()
		FriendshipRequest.objects.filter(from_user=sender, to_user=receiver).delete()
		return JsonResponse({'message': 'Friend request declined'})

@csrf_exempt
def remove(request, pk):
	if request.method == 'POST':
		sender = User.objects.get(pk=pk)
		if not sender:
			raise Exception('User not found')
		data = json.loads(request.body)
		if not data.get('receiver_id'):
			raise Exception('Receiver not found')
		receiver = User.objects.get(pk=data.get('receiver_id'))
		if not receiver:
			raise Exception('Receiver not found')
		Friend.objects.remove_friend(sender, receiver)
		return JsonResponse({'message': 'Friend removed'})
