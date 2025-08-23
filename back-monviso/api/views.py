from django.shortcuts import render
from django.contrib.auth.models import User
from rest_framework import status, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken

# Create your views here.

class TestConnectionView(APIView):
    """
    Endpoint simple pour tester la connexion API
    """
    permission_classes = [permissions.AllowAny]
    
    def get(self, request):
        return Response({
            'status': 'success',
            'message': 'Connexion à l\'API réussie!'
        })

class ProfileView(APIView):
    """
    Endpoint pour récupérer le profil de l'utilisateur connecté
    """
    permission_classes = [permissions.IsAuthenticated]
    
    def get(self, request):
        user = request.user
        return Response({
            'id': user.id,
            'username': user.username,
            'email': user.email,
            'first_name': user.first_name,
            'last_name': user.last_name,
        })

class LoginView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        email_or_username = request.data.get('email')
        password = request.data.get('password')
        
        print(f" [DEBUG] LoginView - Données reçues: email={email_or_username}, password={'***' if password else 'None'}")
        
        # Chercher l'utilisateur par email OU par username
        user = User.objects.filter(email=email_or_username).first()
        print(f" [DEBUG] Recherche par email '{email_or_username}': {'Trouvé' if user else 'Non trouvé'}")
        
        if not user:
            user = User.objects.filter(username=email_or_username).first()
            print(f" [DEBUG] Recherche par username '{email_or_username}': {'Trouvé' if user else 'Non trouvé'}")
        
        if user:
            print(f" [DEBUG] Utilisateur trouvé: {user.username} ({user.email})")
            password_valid = user.check_password(password)
            print(f" [DEBUG] Mot de passe valide: {password_valid}")
        else:
            print(" [DEBUG] Aucun utilisateur trouvé")
        
        if user is None or not user.check_password(password):
            print(" [DEBUG] Authentification échouée - Retour 401")
            return Response({'error': 'Identifiants incorrects'}, status=status.HTTP_401_UNAUTHORIZED)
        
        print(" [DEBUG] Authentification réussie - Génération des tokens")
        refresh = RefreshToken.for_user(user)
        
        return Response({
            'refresh': str(refresh),
            'access': str(refresh.access_token),
            'user': {
                'id': user.id,
                'username': user.username,
                'email': user.email,
                'first_name': user.first_name,
                'last_name': user.last_name,
            }
        })

class RegisterView(APIView):
    permission_classes = [permissions.AllowAny]
    
    def post(self, request):
        username = request.data.get('username')
        email = request.data.get('email')
        password = request.data.get('password')
        first_name = request.data.get('first_name', username)
        last_name = request.data.get('last_name', '')
        
        if not username or not email or not password:
            return Response({'error': 'Tous les champs sont requis'}, status=status.HTTP_400_BAD_REQUEST)
        
        if User.objects.filter(username=username).exists():
            return Response({
                'error': 'Ce nom d\'utilisateur existe déjà',
                'message': 'Veuillez choisir un autre nom d\'utilisateur'
            }, status=status.HTTP_400_BAD_REQUEST)
            
        if User.objects.filter(email=email).exists():
            return Response({
                'error': 'Cette adresse email est déjà utilisée',
                'message': 'Vous avez déjà un compte avec cette adresse email'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        user = User.objects.create_user(
            username=username,
            email=email,
            password=password,
            first_name=first_name,
            last_name=last_name
        )
        
        refresh = RefreshToken.for_user(user)
        
        return Response({
            'message': 'Inscription réussie ! Bienvenue sur MonViso Budget !',
            'refresh': str(refresh),
            'access': str(refresh.access_token),
            'user': {
                'id': user.id,
                'username': user.username,
                'email': user.email,
                'first_name': user.first_name,
                'last_name': user.last_name,
            }
        }, status=status.HTTP_201_CREATED)
