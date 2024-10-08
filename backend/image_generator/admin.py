from django.contrib import admin
from .models import History
from django.contrib.auth.models import User
from django.contrib.auth.admin import UserAdmin

@admin.register(History)
class HistoryAdmin(admin.ModelAdmin):
    list_display = ('user', 'prompt', 'created_at', 'image')  
    search_fields = ('user__username', 'prompt')  
    list_filter = ('created_at',)  

class CustomUserAdmin(UserAdmin):
    model = User

    class HistoryInline(admin.TabularInline):
        model = History
        extra = 0  

    inlines = [HistoryInline]

admin.site.unregister(User)  
admin.site.register(User, CustomUserAdmin)