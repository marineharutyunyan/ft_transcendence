from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt
import json
from django.http import JsonResponse
import requests

from django.contrib.auth import get_user_model
from django.contrib.auth.models import User
from game.models import Player
from rest_framework_simplejwt.tokens import AccessToken, RefreshToken

import os
import base64
import json
import requests

from urllib.parse import urlencode

# Create your views here.
@csrf_exempt
def get_access_token(code):
    data = {
        'grant_type': 'client_credentials',
        'client_id': os.environ.get('INTRA_API_UID'),
        'client_secret': os.environ.get('INTRA_API_SECRET'),
        'redirect_uri': os.environ.get('INTRA_REDIRECT_URI'),
        'code': code,
    }
    response = requests.post('https://api.intra.42.fr/oauth/token', data=data)
    if response.status_code != 200:
        return None
    return response.json()

@csrf_exempt
def login(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        code = data.get('code')
        intra_login = data.get('username')
        if code is None:
            return JsonResponse({'error': 'No code provided'}, status=400)
        access_token = get_access_token(code)
        if access_token is None:
            return JsonResponse({'error': 'Failed to obtain access token'}, status=400)
        user_info = get_user_info(intra_login, access_token['access_token'])
        if user_info is None:
            return JsonResponse({'error': 'Failed to obtain user info'}, status=400)
        user = User.objects.filter(username=intra_login).first()
        image_info = user_info['image']
        image_url = image_info['link']
        image_response = requests.get(image_url)
        if image_response.status_code == 200:
            image_content_base64 = base64.b64encode(image_response.content).decode('utf-8')
        if user is None:
            user = get_user_model().objects.create(
                    first_name = user_info['first_name'],
                    username=intra_login,
                    email=user_info['email'],
                    is_active = True
                )
            Player.objects.create(user=user, image=image_content_base64)
            access = AccessToken.for_user(user)
            refresh = RefreshToken.for_user(user)
            # player = Player.objects.get(user=user)

            if user.is_active:
                return JsonResponse({'error': 'User already logged in'}, status=400)
            user.last_login = None
            user.is_active = True
            user.save()
        else:
            access = AccessToken.for_user(user)
            refresh = RefreshToken.for_user(user)
            if user.is_active:
                return JsonResponse({'error': 'User already logged in'}, status=400)
            user.last_login = None
            user.is_active = True
            user.save()
        return JsonResponse({'message': 'Login successful',  'access': str(access), 'refresh': str(refresh), 'image': str(image_content_base64)}, status=200)      
        # return JsonResponse({'message': 'Login successful',  'access': str(access), 'refresh': str(refresh)}, 'image':  status=200)
    return render(request, 'main/home.html')

def get_user_info(login, access_token):
        headers = {
                'Authorization': 'Bearer ' + access_token}
        response = requests.get(
                os.environ.get('INTRA_API_URL') + '/v2/users/' + login,
                headers=headers)
        return response.json()

