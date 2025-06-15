# urls.py (in your app)
from django.urls import path
from . import views
from .views import activate_user, ReplyCreateView

urlpatterns = [
    # Authentication
    path('auth/register/', views.register, name='register'),
    path('auth/activate/<uidb64>/<token>/', views.activate_user, name='activate'),
    path('auth/login/', views.login, name='login'),
    path('auth/logout/', views.logout, name='logout'),
    
    # Users
    path('users/', views.UserListView.as_view(), name='user-list'),
    path('users/me/', views.UserDetailView.as_view(), name='user-detail'),
    path('mentors/', views.MentorListView.as_view(), name='mentor-list'),
    path('students/', views.StudentListView.as_view(), name='student-list'),
    
    # Messages
    path('messages/', views.MessageListCreateView.as_view(), name='message-list-create'),
    path('conversations/', views.user_conversations, name='user-conversations'),
    path('conversations/<uuid:user_id>/messages/', views.conversation_messages, name='conversation-messages'),
    path('conversations/<uuid:user_id>/mark-read/', views.mark_messages_read, name='mark-messages-read'),

    path('doubts/create/', views.DoubtCreateView.as_view(), name='doubt-create'),
    path('doubts/', views.DoubtListView.as_view(), name='doubt-list'),
    path('doubts/<int:pk>/', views.DoubtDetailView.as_view(), name='doubt-detail'),
    path('doubts/<int:doubt_id>/replies/', ReplyCreateView.as_view(), name='reply-create'),
    path('doubts/<int:doubt_id>/mark-answered/', views.mark_doubt_as_answered, name='mark-answered'),
]

