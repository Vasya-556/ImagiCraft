from django.test import TestCase, Client
from django.urls import reverse
from django.contrib.auth.models import User
import json

class ViewsTestCase(TestCase):

    def setUp(self):
        self.client = Client()
        self.user = User.objects.create_user(username='testuser', email='testuser@example.com', password='testpass')

    def test_generate_images(self):
        url = reverse('generate_images')
        response = self.client.post(url, json.dumps({'prompt': 'test prompt', 'isLogged': False, 'user_id': self.user.id}),
                                     content_type='application/json')
        self.assertEqual(response.status_code, 200)
        self.assertIn('images', response.json())

    def test_get_user_history(self):
        url = reverse('generate_images')
        self.client.post(url, json.dumps({'prompt': 'test prompt', 'isLogged': True, 'user_id': self.user.id}),
                         content_type='application/json')

        history_url = reverse('get_user_history')
        response = self.client.post(history_url, json.dumps({'user_id': self.user.id}),
                                     content_type='application/json')
        self.assertEqual(response.status_code, 200)
        self.assertIn('history', response.json())

    def test_signup(self):
        url = reverse('signup')
        response = self.client.post(url, json.dumps({
            'username': 'newuser',
            'email': 'newuser@example.com',
            'password': 'newpassword'
        }), content_type='application/json')
        self.assertEqual(response.status_code, 201)
        self.assertEqual(response.json()['status'], 'success')

    def test_signout(self):
        url = reverse('signout')
        response = self.client.post(url)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()['message'], 'Logout successful.')

    def test_get_user_data(self):
        url = reverse('get_user_data')
        response = self.client.post(url, json.dumps({'user_id': self.user.id}),
                                     content_type='application/json')
        self.assertEqual(response.status_code, 200)
        self.assertIn('data', response.json())

    def test_update_user_data(self):
        url = reverse('update_user_data')
        response = self.client.post(url, json.dumps({
            'user_id': self.user.id,
            'username': 'updateduser',
            'email': 'updated@example.com'
        }), content_type='application/json')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()['status'], 'success')

    def test_request_password_reset(self):
        url = reverse('request_password_reset')
        response = self.client.post(url, json.dumps({'email': self.user.email}),
                                     content_type='application/json')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()['status'], 'success')
