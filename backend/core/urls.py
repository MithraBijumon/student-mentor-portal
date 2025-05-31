from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import PostViewSet, ReplyViewSet, DMViewSet, AnnouncementViewSet

router = DefaultRouter()
router.register(r'posts', PostViewSet)
router.register(r'replies', ReplyViewSet)
router.register(r'dms', DMViewSet)
router.register(r'users', UserViewSet)
router.register(r'announcements', AnnouncementViewSet)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include('core.urls')),  # 👈 include your app's urls
]
