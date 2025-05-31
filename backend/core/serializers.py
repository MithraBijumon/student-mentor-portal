from rest_framework import serializers
from .models import User, Post, Reply, DMMessage, Announcement

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'roll_number', 'is_mentor']

class PostSerializer(serializers.ModelSerializer):
    class Meta:
        model = Post
        fields = '__all__'
        
class ReplySerializer(serializers.ModelSerializer):
    class Meta:
        model = Reply
        fields = '__all__'

class DMMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = DMMessage
        fields = '__all__'

class AnnouncementSerializer(serializers.ModelSerializer):
    class Meta:
        model = Announcement
        fields = '__all__'
