from django.db import models
from django.contrib.auth.models import User
from django.core.files.storage import default_storage

import base64
import os

# Create your models here.
class GameInvite(models.Model):
	sender = models.ForeignKey('auth.User', related_name='game_invites_sent', on_delete=models.CASCADE)
	receiver = models.ForeignKey('auth.User', related_name='game_invites_received', on_delete=models.CASCADE)
	join = models.BooleanField(default=False)
	ignore = models.BooleanField(default=False)
	created_at = models.DateTimeField(auto_now_add=True)

	def __str__(self):
		return f'{self.sender} invited {self.receiver}'
	
	def join_invite(self):
		self.join = True
		self.save()

	def ignore_invite(self):
		self.ignore = True
		self.save()

class PongGame(models.Model):
    players = models.ManyToManyField(User, related_name='pong_games')
    max_players = models.IntegerField(default=2)
    game_process = models.BooleanField(default=False)
    game_mode = models.CharField(max_length=25)

    def __str__(self):
        return f'{self.players.all()}'
    
    def is_full(self):
        return self.players.count() == self.max_players

class Player(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    win = models.IntegerField(default=0)
    lose = models.IntegerField(default=0)
    points = models.IntegerField(default=0)
    game = models.ForeignKey(PongGame, related_name='game_players', on_delete=models.CASCADE, null=True, blank=True)
    fa = models.BooleanField(default=False)
    language = models.CharField(max_length=2, blank=True, default='en')
    image = models.TextField(blank=True, null=True)
    game_process = models.BooleanField(default=False)
    game_mode = models.CharField(max_length=25, blank=True, default='')

    def __str__(self):
        return f'{self.user}'

    def save_base64_image(self, image_path=None):
        if image_path:
            self.image = self.image_to_base64(image_path)
        elif self.image:
            self.image = self.ensure_base64_encoding(self.image)
        else:
            default_image_path = os.path.join(os.path.dirname(__file__), '..', 'main', 'static', 'images', 'default_user.jpg')
            self.image = self.image_to_base64(default_image_path)
        self.save()

    def image_to_base64(self, image_path):
        with default_storage.open(image_path, 'rb') as image_file:
            base64_string = base64.b64encode(image_file.read()).decode('utf-8')
        return base64_string

    def ensure_base64_encoding(self, base64_string):
        try:
            decoded_image = base64.b64decode(base64_string)
            reencoded_image = base64.b64encode(decoded_image).decode('utf-8')
            return reencoded_image
        except Exception as e:
            print(f"Error re-encoding image: {e}")
            return None

class History(models.Model):
	player = models.ForeignKey('Player', related_name='histories', on_delete=models.CASCADE)
	opponent = models.ForeignKey('Player', related_name='opponent_histories', on_delete=models.CASCADE)
	result = models.CharField(max_length=10)
	created_at = models.DateTimeField(auto_now_add=True)
	points = models.IntegerField(default=0)
	game_mode = models.CharField(max_length=25)

	def __str__(self):
		return f'{self.player} vs {self.opponent}'