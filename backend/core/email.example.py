EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
EMAIL_HOST = 'smtp.gmail.com'
EMAIL_PORT = 587
EMAIL_USE_TLS = True
EMAIL_HOST_USER = 'your-email@gmail.com'  # Sensitive data
EMAIL_HOST_PASSWORD = 'your-email-password'  # Sensitive data
DEFAULT_FROM_EMAIL = 'your-email@gmail.com'