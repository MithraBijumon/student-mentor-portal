# serializers.py
from rest_framework import serializers
from django.contrib.auth import authenticate
from .models import User, Reply, Message, Conversation, MentorProfile, StudentProfile, Doubt, Announcement

class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 
                 'user_type', 'is_mentor', 'phone', 'bio', 'password']
        extra_kwargs = {'password': {'write_only': True}}
    
    def create(self, validated_data):
        password = validated_data.pop('password')
        user = User.objects.create_user(**validated_data)
        user.set_password(password)
        user.save()
        
        # Create profile based on user type
        if user.user_type == 'mentor':
            MentorProfile.objects.create(user=user)
        else:
            StudentProfile.objects.create(user=user)
        
        return user

class MessageSerializer(serializers.ModelSerializer):
    sender_id = serializers.CharField(read_only=True)
    receiver_id = serializers.CharField(read_only=True)
    sender_name = serializers.CharField(read_only=True)
    sender_type = serializers.CharField(read_only=True)
    timestamp = serializers.DateTimeField(read_only=True)
    
    class Meta:
        model = Message
        fields = ['id', 'sender_id', 'receiver_id', 'content', 
                 'timestamp', 'is_read', 'sender_name', 'sender_type']
        read_only_fields = ['id', 'timestamp']
    
    def create(self, validated_data):
        validated_data['sender'] = self.context['request'].user
        return super().create(validated_data)

class ConversationSerializer(serializers.ModelSerializer):
    participants = UserSerializer(many=True, read_only=True)
    last_message = MessageSerializer(read_only=True)
    
    class Meta:
        model = Conversation
        fields = ['id', 'participants', 'created_at', 'last_message']

class MentorProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    
    class Meta:
        model = MentorProfile
        fields = ['user', 'specialization', 'experience_years', 
                 'availability', 'rating', 'total_ratings']

class StudentProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    current_mentor = UserSerializer(read_only=True)
    
    class Meta:
        model = StudentProfile
        fields = ['user', 'grade_level', 'interests', 'current_mentor']

class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField()
    
    def validate(self, data):
        email = data.get('email')
        password = data.get('password')
        
        if email and password:
            user = authenticate(username=email, password=password)
            if user:
                if user.is_active:
                    data['user'] = user
                    return data
                else:
                    raise serializers.ValidationError('User account is disabled.')
            else:
                raise serializers.ValidationError('Unable to login with provided credentials.')
        else:
            raise serializers.ValidationError('Must include email and password.')
        
        return data

class ReplySerializer(serializers.ModelSerializer):
    author = serializers.StringRelatedField()
    class Meta:
        model = Reply
        fields = ['id', 'text', 'author', 'created_at']
        read_only_fields = ['author', 'created_at', 'is_mentor']
        
class DoubtSerializer(serializers.ModelSerializer):
    replies = ReplySerializer(many=True, read_only=True)
    class Meta:
        model = Doubt
        fields = '__all__'
        read_only_fields = ['author', 'created_at']

class AnnouncementSerializer(serializers.ModelSerializer):
    class Meta:
        model = Announcement
        fields = ['id', 'title', 'content', 'created_at']
