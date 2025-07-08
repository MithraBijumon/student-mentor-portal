# views.py
from rest_framework import generics, status, permissions
from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from rest_framework.views import exception_handler
from django.contrib.auth import authenticate
from django.db.models import Q
from .models import User, Message, Conversation, MentorProfile, StudentProfile, Announcement
from .serializers import (
    UserSerializer, ReplySerializer, MessageSerializer, ConversationSerializer,
    MentorProfileSerializer, StudentProfileSerializer, LoginSerializer, AnnouncementSerializer
)
from django.core.mail import send_mail
from django.urls import reverse
from django.utils.http import urlsafe_base64_encode
from django.utils.http import urlsafe_base64_decode
from django.utils.encoding import force_bytes
from django.http import HttpResponse
from django.contrib.auth.tokens import default_token_generator
from .models import Doubt
from .serializers import DoubtSerializer
from django.contrib.auth import get_user_model
from rest_framework.authentication import TokenAuthentication




# Authentication Views
@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def register(request):
    serializer = UserSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        user.is_active = False  # user must verify first
        user.save()

        # Generate activation link
        uid = urlsafe_base64_encode(force_bytes(user.pk))
        token = default_token_generator.make_token(user)
        activation_url = f"https://649fb13eada1.ngrok-free.app/api/auth/activate/{uid}/{token}/"

        send_mail(
            subject='Verify your email',
            message=f'Click the link to verify your email: {activation_url}',
            from_email=None,
            recipient_list=[user.email],
        )

        return Response({
            'message': 'Verification email sent. Please verify your email to activate your account.'
        }, status=status.HTTP_201_CREATED)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def login(request):
    serializer = LoginSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.validated_data['user']
        token, created = Token.objects.get_or_create(user=user)
        return Response({
            'user': UserSerializer(user).data,
            'token': token.key
        })
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
def logout(request):
    try:
        request.user.auth_token.delete()
        return Response({'message': 'Successfully logged out'})
    except:
        return Response({'error': 'Error logging out'}, status=status.HTTP_400_BAD_REQUEST)

# User Views
@permission_classes([permissions.AllowAny])
class UserListView(generics.ListAPIView):
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        queryset = User.objects.all()
        user_type = self.request.query_params.get('type', None)
        if user_type:
            queryset = queryset.filter(user_type=user_type)
        return queryset
    
@permission_classes([permissions.IsAuthenticated])
class UserDetailView(generics.RetrieveUpdateAPIView):
    serializer_class = UserSerializer
    
    def get_object(self):
        return self.request.user

# Message Views
class MessageListCreateView(generics.ListCreateAPIView):
    serializer_class = MessageSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        return Message.objects.filter(
            Q(sender=user) | Q(receiver=user)
        ).order_by('-timestamp')
    
    def perform_create(self, serializer):
        receiver_id = self.request.data.get('receiver_id')
        try:
            receiver = User.objects.get(id=receiver_id)
            serializer.save(sender=self.request.user, receiver=receiver)
        except User.DoesNotExist:
            raise serializers.ValidationError('Receiver not found')

@api_view(['GET'])
def conversation_messages(request, user_id):
    """Get messages between current user and another user"""
    try:
        other_user = User.objects.get(id=user_id)
        messages = Message.objects.filter(
            (Q(sender=request.user) & Q(receiver=other_user)) |
            (Q(sender=other_user) & Q(receiver=request.user))
        ).order_by('timestamp')
        
        serializer = MessageSerializer(messages, many=True)
        return Response(serializer.data)
    except User.DoesNotExist:
        return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)

@api_view(['POST'])
def mark_messages_read(request, user_id):
    """Mark all messages from a specific user as read"""
    try:
        sender = User.objects.get(id=user_id)
        Message.objects.filter(
            sender=sender, 
            receiver=request.user, 
            is_read=False
        ).update(is_read=True)
        return Response({'message': 'Messages marked as read'})
    except User.DoesNotExist:
        return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)

# Mentor/Student specific views
class MentorListView(generics.ListAPIView):
    queryset = User.objects.filter(user_type='mentor')
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

class StudentListView(generics.ListAPIView):
    queryset = User.objects.filter(user_type='student')
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

@api_view(['GET'])
def user_conversations(request):
    """Get all conversations for the current user"""
    user = request.user
    
    # Get unique users who have exchanged messages with current user
    sent_to = Message.objects.filter(sender=user).values_list('receiver', flat=True).distinct()
    received_from = Message.objects.filter(receiver=user).values_list('sender', flat=True).distinct()
    
    conversation_users = set(sent_to) | set(received_from)
    conversations = []
    
    for user_id in conversation_users:
        other_user = User.objects.get(id=user_id)
        last_message = Message.objects.filter(
            (Q(sender=user) & Q(receiver=other_user)) |
            (Q(sender=other_user) & Q(receiver=user))
        ).order_by('-timestamp').first()
        
        conversations.append({
            'user': UserSerializer(other_user).data,
            'last_message': MessageSerializer(last_message).data if last_message else None,
            'unread_count': Message.objects.filter(
                sender=other_user, receiver=user, is_read=False
            ).count()
        })
    
    # Sort by last message timestamp
    conversations.sort(key=lambda x: x['last_message']['timestamp'] if x['last_message'] else '', reverse=True)
    
    return Response(conversations)

class DoubtCreateView(generics.CreateAPIView):
    queryset = Doubt.objects.all()
    serializer_class = DoubtSerializer
    authentication_classes = [TokenAuthentication]
    permission_classes = [permissions.IsAuthenticated]
    def perform_create(self, serializer):
        print("Logged in user:", self.request.user)
        serializer.save(author=self.request.user)

User = get_user_model()

@api_view(['GET'])
@permission_classes([permissions.AllowAny])
def activate_user(request, uidb64, token):
    try:
        uid = urlsafe_base64_decode(uidb64).decode()
        user = User.objects.get(pk=uid)
    except (TypeError, ValueError, OverflowError, User.DoesNotExist):
        user = None

    if user and default_token_generator.check_token(user, token):
        user.is_active = True
        user.save()
        return HttpResponse("✅ Your email has been successfully verified. You can now login.")
    else:
        return HttpResponse("❌ Activation link is invalid or expired.", status=400)
    
# views.py
@permission_classes([permissions.AllowAny])
class DoubtListView(generics.ListAPIView):
    queryset = Doubt.objects.all()
    serializer_class = DoubtSerializer

    def get_queryset(self):
        filter_param = self.request.query_params.get('filter')
        if filter_param == 'answered':
            return self.queryset.filter(answered=True)
        elif filter_param == 'unanswered':
            return self.queryset.filter(answered=False)
        return self.queryset
    
class DoubtDetailView(generics.RetrieveAPIView):
    queryset = Doubt.objects.all()
    serializer_class = DoubtSerializer

class ReplyCreateView(generics.CreateAPIView):
    serializer_class = ReplySerializer
    authentication_classes = [TokenAuthentication]
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        doubt_id = self.kwargs['doubt_id']
        doubt = Doubt.objects.get(id=doubt_id)
        is_mentor = self.request.user.user_type == 'mentor'
        serializer.save(
            doubt=doubt,
            author=self.request.user,
            is_mentor=is_mentor
        )

@api_view(['PATCH'])
@authentication_classes([TokenAuthentication])
@permission_classes([permissions.IsAuthenticated])
def mark_doubt_as_answered(request, doubt_id):
    try:
        doubt = Doubt.objects.get(id=doubt_id)
        if not doubt.answered:
            doubt.answered = True
            doubt.save()
        return Response({'status': 'marked as answered'})
    except Doubt.DoesNotExist:
        return Response({'error': 'Doubt not found'}, status=status.HTTP_404_NOT_FOUND)

class AnnouncementListCreateView(generics.ListCreateAPIView):
    queryset = Announcement.objects.all().order_by('-created_at')
    serializer_class = AnnouncementSerializer
    permission_classes = [permissions.AllowAny]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)

        return Response({
            "detail": "Announcement posted successfully.",
            "data": serializer.data
        }, status=status.HTTP_201_CREATED, headers=headers)
