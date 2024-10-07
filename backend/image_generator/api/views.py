from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.conf import settings
import os
import time
import random
import json
import requests

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
        is_logged_in = data.get("isLoggedIn", False)

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

                    with open(image_path, "wb") as f:
                        f.write(image_data)

                    # Build the correct URL for the frontend
                    image_url = request.build_absolute_uri(os.path.join(settings.MEDIA_URL, "generated_images", image_filename)).replace('\\', '/')
                    image_urls.append(image_url)
                    break
                else:
                    if "currently loading" in response.text:
                        time.sleep(retry_delay)
                    else:
                        break

        return JsonResponse({
            "status": "success",
            "images": image_urls
        }, status=200)
    else:
        return JsonResponse({
            "status": "error",
            "message": "Only POST requests are allowed"
        }, status=400)
