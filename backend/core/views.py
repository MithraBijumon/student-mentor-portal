from django.shortcuts import render

# Create your views here.
from rest_framework import viewsets
from .models import Post, Reply, DMMessage, Announcement
from .serializers import PostSerializer, ReplySerializer, DMMessageSerializer, AnnouncementSerializer

class PostViewSet(viewsets.ModelViewSet):
    queryset = Post.objects.all().order_by('-created_at')
    serializer_class = PostSerializer

class ReplyViewSet(viewsets.ModelViewSet):
    queryset = Reply.objects.all()
    serializer_class = ReplySerializer

class DMViewSet(viewsets.ModelViewSet):
    queryset = DMMessage.objects.all()
    serializer_class = DMMessageSerializer

class AnnouncementViewSet(viewsets.ModelViewSet):
    queryset = Announcement.objects.all()
    serializer_class = AnnouncementSerializer
