# models.py
from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils import timezone
from django.utils.timezone import now
from django.contrib.auth import get_user_model
import uuid
from django.conf import settings

class User(AbstractUser):
    """Extended User model for students and mentors"""
    USER_TYPES = [
        ('student', 'Student'),
        ('mentor', 'Mentor'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    email = models.EmailField(unique=True)
    user_type = models.CharField(max_length=10, choices=USER_TYPES, default='student')
    is_mentor = models.BooleanField(default=False)
    phone = models.CharField(max_length=15, blank=True, null=True)
    profile_picture = models.ImageField(upload_to='profiles/', blank=True, null=True)
    bio = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    # Override username to use email
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username', 'first_name', 'last_name']
    
    def save(self, *args, **kwargs):
        # Sync is_mentor with user_type
        self.is_mentor = (self.user_type == 'mentor')
        super().save(*args, **kwargs)
    
    def __str__(self):
        return f"{self.first_name} {self.last_name} ({self.email})"

class Message(models.Model):
    """Message model matching your React Native interface"""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    sender = models.ForeignKey(User, on_delete=models.CASCADE, related_name='sent_messages')
    receiver = models.ForeignKey(User, on_delete=models.CASCADE, related_name='received_messages')
    content = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)
    is_read = models.BooleanField(default=False)
    
    class Meta:
        ordering = ['-timestamp']
    
    @property
    def sender_id(self):
        return str(self.sender.id)
    
    @property
    def receiver_id(self):
        return str(self.receiver.id)
    
    @property
    def sender_name(self):
        return f"{self.sender.first_name} {self.sender.last_name}"
    
    @property
    def sender_type(self):
        return self.sender.user_type
    
    def __str__(self):
        return f"Message from {self.sender_name} to {self.receiver.first_name}"

class Conversation(models.Model):
    """Track conversations between users"""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    participants = models.ManyToManyField(User, related_name='conversations')
    created_at = models.DateTimeField(auto_now_add=True)
    last_message = models.ForeignKey(Message, on_delete=models.SET_NULL, null=True, blank=True)
    
    def __str__(self):
        participant_names = ", ".join([user.first_name for user in self.participants.all()])
        return f"Conversation: {participant_names}"

class MentorProfile(models.Model):
    """Additional info for mentors"""
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='mentor_profile')
    specialization = models.CharField(max_length=200)
    experience_years = models.IntegerField(default=0)
    availability = models.TextField(blank=True, null=True)
    rating = models.DecimalField(max_digits=3, decimal_places=2, default=0.00)
    total_ratings = models.IntegerField(default=0)
    
    def __str__(self):
        return f"Mentor: {self.user.first_name} - {self.specialization}"

class StudentProfile(models.Model):
    """Additional info for students"""
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='student_profile')
    grade_level = models.CharField(max_length=50, blank=True, null=True)
    interests = models.TextField(blank=True, null=True)
    current_mentor = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='mentees')
    
    def __str__(self):
        return f"Student: {self.user.first_name}"

User = get_user_model()

class Doubt(models.Model):
    title = models.CharField(max_length=255)
    text = models.TextField()
    answered = models.BooleanField(default=False)
    anonymous = models.BooleanField(default=False)
    author = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

class Reply(models.Model):
    doubt = models.ForeignKey(Doubt, on_delete=models.CASCADE, related_name='replies')
    text = models.TextField()
    author = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    is_mentor = models.BooleanField(default=False)