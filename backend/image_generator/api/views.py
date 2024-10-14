from django.http import JsonResponse, HttpResponse
from django.views.decorators.csrf import csrf_exempt
from django.conf import settings
from django.contrib.auth import authenticate
from django.contrib.auth.models import User
import os
import time
import random
import json
import requests
from ..models import History
from django.contrib.auth.models import User
from rest_framework_simplejwt.tokens import AccessToken
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.core.mail import send_mail

from .Api_Token import token

model_id = "dreamlike-art/dreamlike-diffusion"
url = f"https://api-inference.huggingface.co/models/{model_id}"
headers = {
    "Authorization": f"Bearer {token}",
    "Content-Type": "application/json"
}

max_retries = 5
retry_delay = 171

output_dir = os.path.join(settings.MEDIA_ROOT, "generated_images")
os.makedirs(output_dir, exist_ok=True)

@csrf_exempt
def generate_images(request):
    if request.method == 'POST':
        data = json.loads(request.body.decode('utf-8'))
        prompt = data.get("prompt", "")
        is_logged_in = data.get("isLogged", False)
        user_id = data.get("user_id", None)  

        image_num = 3 if is_logged_in else 1
        image_urls = []

        for i in range(image_num):
            prompt_with_variation = f"{prompt} {random.randint(1, 1000)}"

            for attempt in range(max_retries):
                payload = {
                    "inputs": prompt_with_variation,
                }

                response = requests.post(url, headers=headers, data=json.dumps(payload))

                if response.status_code == 200:
                    image_data = response.content
                    image_filename = f"generated_image_{i + 1}_{int(time.time())}.png"
                    image_path = os.path.join(output_dir, image_filename)

                    try:
                        with open(image_path, "wb") as f:
                            f.write(image_data)
                    except Exception as e:
                        return JsonResponse({
                            "status": "error",
                            "message": f"Error saving image: {str(e)}"
                        }, status=500)

                    image_url = request.build_absolute_uri(f"{settings.MEDIA_URL}generated_images/{image_filename}")
                    image_urls.append(image_url)

                    if is_logged_in and user_id:
                        try:
                            user = User.objects.get(id=user_id)
                            History.objects.create(user=user, image=image_filename, prompt=prompt)
                        except User.DoesNotExist:
                            return JsonResponse({
                                "status": "error",
                                "message": "User not found."
                            }, status=404)

                    break  
                else:
                    print(f"Error from image generation API: {response.status_code} - {response.text}")
                    if "currently loading" in response.text:
                        time.sleep(retry_delay)
                    else:
                        break

        return JsonResponse({
            "status": "success",
            "images": image_urls
        }, status=200)

    return JsonResponse({
        "status": "error",
        "message": "Only POST requests are allowed"
    }, status=400)
    
@csrf_exempt
def get_user_history(request):
    if request.method == 'POST':
        data = json.loads(request.body.decode('utf-8'))
        user_id = data.get("user_id")  

        try:
            history = History.objects.filter(user__id=user_id).order_by('-created_at')

            
            history_dict = {}
            for item in history:
                prompt = item.prompt
                image_url = request.build_absolute_uri(f"{settings.MEDIA_URL}generated_images/{item.image}")  
                print("Generated image URL:", image_url)  

                if prompt not in history_dict:
                    history_dict[prompt] = []
                history_dict[prompt].append({
                    "id": item.id,
                    "image_url": image_url,  
                    "created_at": item.created_at,
                })

            return JsonResponse({
                "status": "success",
                "history": history_dict  
            }, status=200)
        except User.DoesNotExist:
            return JsonResponse({
                "status": "error",
                "message": "User not found."
            }, status=404)

    return JsonResponse({
        "status": "error",
        "message": "Only POST requests are allowed"
    }, status=400)

@csrf_exempt
def signup(request):
    if request.method == 'POST':
        data = json.loads(request.body.decode('utf-8'))
        username = data.get('username')
        email = data.get('email')
        password = data.get('password')

        if User.objects.filter(username=username).exists():
            return JsonResponse({'status': 'error', 'message': 'Username already exists.'}, status=400)

        user = User.objects.create_user(username=username, email=email, password=password)
        user.save()
        return JsonResponse({'status': 'success', 'message': 'User registered successfully.'}, status=201)
    
    return JsonResponse({'status': 'error', 'message': 'Only POST requests are allowed'}, status=400)

@csrf_exempt
def signin(request):
    username = request.data.get('username')
    password = request.data.get('password')

    user = authenticate(request, username=username, password=password)
    if user is not None:
        token = AccessToken.for_user(user)
        return Response({'status': 'success', 'token': str(token)}, status=status.HTTP_200_OK)
    return Response({'status': 'error', 'message': 'Invalid credentials.'}, status=status.HTTP_401_UNAUTHORIZED)

@csrf_exempt
def signout(request):
    return JsonResponse({'status': 'success', 'message': 'Logout successful.'}, status=200)

def hello_world(request):
    return HttpResponse('<h1>Hello World</h1>')

@csrf_exempt
def get_user_data(request):
    try:
        data = json.loads(request.body.decode('utf-8'))
        user_id = data.get("user_id")
        user = User.objects.get(id=user_id)
        user_data = {
            'username': user.username,
            'email': user.email,
            'first_name': user.first_name,
            'last_name': user.last_name
        }
        return JsonResponse({'status': 'success', 'data': user_data})
    except User.DoesNotExist:
        return JsonResponse({'status': 'error', 'message': 'User not found'}, status=404)
    except Exception as e:
        return JsonResponse({'status': 'error', 'message': str(e)}, status=500)
    
@csrf_exempt
def update_user_data(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body.decode('utf-8'))
            user_id = data.get("user_id")
            user = User.objects.get(id=user_id)

            user.username = data.get("username", user.username)
            user.email = data.get("email", user.email)
            user.first_name = data.get("first_name", user.first_name)
            user.last_name = data.get("last_name", user.last_name)
            user.save()

            return JsonResponse({'status': 'success', 'message': 'User data updated successfully'})
        except User.DoesNotExist:
            return JsonResponse({'status': 'error', 'message': 'User not found'}, status=404)
        except Exception as e:
            return JsonResponse({'status': 'error', 'message': str(e)}, status=500)
    else:
        return JsonResponse({'status': 'error', 'message': 'Invalid request method'}, status=405)
    
verification_codes = {}

@csrf_exempt
def request_password_reset(request):
    if request.method == 'POST':
        data = json.loads(request.body.decode('utf-8'))
        email = data.get('email')

        try:
            user = User.objects.get(email=email)
            verification_code = random.randint(100000, 999999)
            verification_codes[email] = verification_code  

            send_mail(
                'Your Password Reset Code',
                f'Your verification code is {verification_code}',
                settings.DEFAULT_FROM_EMAIL,
                [email],
                fail_silently=False,
            )

            return JsonResponse({'status': 'success', 'message': 'Verification code sent to email.'})
        except User.DoesNotExist:
            return JsonResponse({'status': 'error', 'message': 'User not found.'}, status=404)

@csrf_exempt
def change_password(request):
    if request.method == 'POST':
        data = json.loads(request.body.decode('utf-8'))
        email = data.get('email')
        code = data.get('code')
        new_password = data.get('new_password')

        stored_code = verification_codes.get(email)

        if stored_code is not None and str(stored_code) == str(code):
            try:
                user = User.objects.get(email=email)
                user.set_password(new_password)
                user.save()
                del verification_codes[email]  
                return JsonResponse({'status': 'success', 'message': 'Password changed successfully.'})
            except User.DoesNotExist:
                return JsonResponse({'status': 'error', 'message': 'User not found.'}, status=404)
        else:
            return JsonResponse({'status': 'error', 'message': 'Invalid verification code.'}, status=400)