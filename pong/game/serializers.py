from rest_framework import serializers
from .models import Player, History

class HistorySerializer(serializers.ModelSerializer):
    player = serializers.SerializerMethodField()
    opponent = serializers.SerializerMethodField()

    class Meta:
        model = History
        fields = ['player', 'opponent', 'game_mode', 'result', 'created_at', 'points']

    def get_player(self, obj):
        user = obj.player.user  # Assuming Player has a OneToOneField to User
        return {
            'username': user.username,
            'image': obj.player.image
        }

    def get_opponent(self, obj):
        user = obj.opponent.user  # Assuming Player has a OneToOneField to User
        return {
            'username': user.username,
            'image': obj.opponent.image
        }