from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User, Message, Conversation, MentorProfile, StudentProfile, Doubt

# Custom UserAdmin to use your custom User model
class UserAdmin(BaseUserAdmin):
    model = User
    list_display = ('email', 'first_name', 'last_name', 'user_type', 'is_staff', 'is_superuser')
    list_filter = ('user_type', 'is_staff', 'is_superuser', 'is_active')
    fieldsets = BaseUserAdmin.fieldsets + (
        (None, {
            'fields': ('user_type', 'phone', 'profile_picture', 'bio')
        }),
    )
    search_fields = ('email', 'first_name', 'last_name')
    ordering = ('email',)

# Register all models
admin.site.register(User, UserAdmin)
admin.site.register(Message)
admin.site.register(Conversation)
admin.site.register(MentorProfile)
admin.site.register(StudentProfile)
admin.site.register(Doubt)
