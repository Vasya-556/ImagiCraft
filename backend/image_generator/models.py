from django.contrib.auth.models import User
from django.db import models

class History(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)  
    image = models.ImageField(upload_to='generated_images/')  
    prompt = models.CharField(max_length=255)  
    created_at = models.DateTimeField(auto_now_add=True)  

    def __str__(self):
        return f"Image for {self.user.username} - {self.prompt}"
    
    class Meta:
        verbose_name = "History Record"  
        verbose_name_plural = "History Records"