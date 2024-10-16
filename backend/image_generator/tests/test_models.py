from django.contrib.auth.models import User
from django.test import TestCase
from image_generator.models import History

class HistoryModelTest(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username='testuser',
            password='testpassword'
        )

        self.history = History.objects.create(
            user=self.user,
            image='path/to/test_image.jpg',  
            prompt='Test prompt'
        )

    def test_history_creation(self):
        self.assertEqual(self.history.user, self.user)
        self.assertEqual(self.history.prompt, 'Test prompt')
        self.assertTrue(hasattr(self.history, 'image'))  
        self.assertIsNotNone(self.history.created_at)  

    def test_string_representation(self):
        self.assertEqual(str(self.history), 'Image for testuser - Test prompt')

    def test_verbose_name(self):
        self.assertEqual(str(History._meta.verbose_name), 'History Record')
        self.assertEqual(str(History._meta.verbose_name_plural), 'History Records')

    def test_image_upload_path(self):
        self.assertEqual(self.history.image.field.upload_to, 'generated_images/')

