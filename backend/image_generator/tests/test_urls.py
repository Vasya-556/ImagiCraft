from django.test import SimpleTestCase
from django.urls import reverse, resolve
from image_generator.api.views import generate_images, get_user_history, signup, signin, signout, get_user_data, update_user_data, request_password_reset, change_password

class TestUrls(SimpleTestCase):
    def test_generate_images(self):
        url = reverse('generate_images')
        self.assertEquals(resolve(url).func, generate_images)
        
    def test_get_user_history(self):
        url = reverse('get_user_history')
        self.assertEquals(resolve(url).func, get_user_history)
        
    def test_signup(self):
        url = reverse('signup')
        self.assertEquals(resolve(url).func, signup)
        
    def test_signin(self):
        url = reverse('signin')
        self.assertEquals(resolve(url).func, signin)
        
    def test_signout(self):
        url = reverse('signout')
        self.assertEquals(resolve(url).func, signout)
    
    def test_hello_world(self):
        response = self.client.get('/')  
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, '<h1>Hello World</h1>')
        
    def test_get_user_data(self):
        url = reverse('get_user_data')
        self.assertEquals(resolve(url).func, get_user_data)
        
    def test_update_user_data(self):
        url = reverse('update_user_data')
        self.assertEquals(resolve(url).func, update_user_data)
        
    def test_request_password_reset(self):
        url = reverse('request_password_reset')
        self.assertEquals(resolve(url).func, request_password_reset)
        
    def test_change_password(self):
        url = reverse('change_password')
        self.assertEquals(resolve(url).func, change_password)
