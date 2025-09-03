from django.shortcuts import render
from django.contrib.auth.models import User
from rest_framework import status, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import IsAuthenticated
from .serializers import OnboardingDataSerializer, UserProfileSerializer, IncomeSerializer, ExpenseSerializer, SavingsGoalSerializer, TransactionSerializer
from budget.models import UserProfile, Income, Expense, SavingsGoal, Transaction

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
        try:
            profile = UserProfile.objects.get(user=user)
            monthly_income = profile.monthly_income
        except UserProfile.DoesNotExist:
            monthly_income = None
            
        return Response({
            'id': user.id,
            'username': user.username,
            'email': user.email,
            'first_name': user.first_name,
            'last_name': user.last_name,
            'monthly_income': monthly_income,
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
        full_name = request.data.get('full_name', '')
        
        # Split full name into first and last name
        name_parts = full_name.strip().split(' ', 1) if full_name else []
        first_name = name_parts[0] if len(name_parts) > 0 else ''
        last_name = name_parts[1] if len(name_parts) > 1 else ''
        
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

class OnboardingView(APIView):
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        """Complete user onboarding with all financial data"""
        print(f"[ONBOARDING] User {request.user.username} submitting onboarding data")
        print(f"[ONBOARDING] Data received: {request.data}")
        
        serializer = OnboardingDataSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            result = serializer.save()
            print(f"[ONBOARDING] Onboarding completed successfully for user {request.user.username}")
            return Response({
                'message': result['message'],
                'onboarding_completed': True,
                'user': {
                    'id': result['user'].id,
                    'username': result['user'].username,
                    'email': result['user'].email,
                    'first_name': result['user'].first_name,
                    'last_name': result['user'].last_name,
                }
            }, status=status.HTTP_201_CREATED)
        else:
            print(f"[ONBOARDING] Validation errors: {serializer.errors}")
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class OnboardingStatusView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        """Check if user has completed onboarding"""
        try:
            profile = UserProfile.objects.get(user=request.user)
            return Response({
                'onboarding_completed': profile.onboarding_completed,
                'has_profile': True
            })
        except UserProfile.DoesNotExist:
            return Response({
                'onboarding_completed': False,
                'has_profile': False
            })

class UserFinancialDataView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        """Get user's complete financial data"""
        try:
            profile = UserProfile.objects.get(user=request.user)
            incomes = Income.objects.filter(user=request.user)
            expenses = Expense.objects.filter(user=request.user)
            goals = SavingsGoal.objects.filter(user=request.user)
            
            return Response({
                'profile': UserProfileSerializer(profile).data,
                'incomes': IncomeSerializer(incomes, many=True).data,
                'expenses': ExpenseSerializer(expenses, many=True).data,
                'savings_goals': SavingsGoalSerializer(goals, many=True).data,
            })
        except UserProfile.DoesNotExist:
            return Response({
                'error': 'User profile not found. Please complete onboarding first.'
            }, status=status.HTTP_404_NOT_FOUND)

class FinancialDataView(APIView):
    """
    Endpoint pour récupérer les données financières de l'utilisateur
    """
    permission_classes = [permissions.IsAuthenticated]
    
    def get(self, request):
        user = request.user
        try:
            profile = UserProfile.objects.get(user=user)
            
            # Récupérer les revenus
            incomes = Income.objects.filter(user=user)
            total_income = sum(income.amount for income in incomes)
            
            # Récupérer les dépenses fixes
            fixed_expenses = Expense.objects.filter(user=user, type='fixed')
            total_fixed_expenses = sum(expense.amount for expense in fixed_expenses)
            
            # Récupérer les dépenses variables
            variable_expenses = Expense.objects.filter(user=user, type='variable')
            total_variable_expenses = sum(expense.amount for expense in variable_expenses)
            
            total_expenses = total_fixed_expenses + total_variable_expenses
            remaining_budget = total_income - total_expenses
            
            # Récupérer les objectifs d'épargne
            savings_goals = SavingsGoal.objects.filter(user=user)
            
            return Response({
                'monthly_income': profile.monthly_income,
                'total_income': total_income,
                'total_expenses': total_expenses,
                'total_fixed_expenses': total_fixed_expenses,
                'total_variable_expenses': total_variable_expenses,
                'remaining_budget': remaining_budget,
                'incomes': [{
                    'id': income.id,
                    'name': income.name,
                    'amount': income.amount,
                    'type': income.type,
                    'frequency': income.frequency,
                    'is_primary': income.is_primary
                } for income in incomes],
                'fixed_expenses': [{
                    'id': expense.id,
                    'name': expense.name,
                    'amount': expense.amount,
                    'frequency': expense.frequency,
                    'type': expense.type
                } for expense in fixed_expenses],
                'variable_expenses': [{
                    'id': expense.id,
                    'name': expense.name,
                    'amount': expense.amount,
                    'frequency': expense.frequency,
                    'type': expense.type
                } for expense in variable_expenses],
                'savings_goals': [{
                    'id': goal.id,
                    'name': goal.name,
                    'target_amount': goal.target_amount,
                    'current_amount': goal.current_amount,
                    'target_date': goal.target_date,
                    'type': goal.type,
                    'priority': goal.priority
                } for goal in savings_goals]
            })
            
        except UserProfile.DoesNotExist:
            return Response({'error': 'Profile not found'}, status=404)

class TransactionListCreateView(APIView):
    """
    Endpoint pour lister et créer des transactions
    """
    permission_classes = [permissions.IsAuthenticated]
    
    def get(self, request):
        """Récupérer toutes les transactions de l'utilisateur"""
        transactions = Transaction.objects.filter(user=request.user)
        serializer = TransactionSerializer(transactions, many=True)
        return Response(serializer.data)
    
    def post(self, request):
        """Créer une nouvelle transaction"""
        print(f"[TRANSACTION] Données reçues: {request.data}")
        serializer = TransactionSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            transaction = serializer.save()
            print(f"[TRANSACTION] Transaction créée avec succès: {transaction}")
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        print(f"[TRANSACTION] Erreurs de validation: {serializer.errors}")
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class TransactionDetailView(APIView):
    """
    Endpoint pour récupérer, modifier ou supprimer une transaction spécifique
    """
    permission_classes = [permissions.IsAuthenticated]
    
    def get_object(self, pk, user):
        try:
            return Transaction.objects.get(pk=pk, user=user)
        except Transaction.DoesNotExist:
            return None
    
    def get(self, request, pk):
        """Récupérer une transaction spécifique"""
        transaction = self.get_object(pk, request.user)
        if not transaction:
            return Response({'error': 'Transaction not found'}, status=status.HTTP_404_NOT_FOUND)
        
        serializer = TransactionSerializer(transaction)
        return Response(serializer.data)
    
    def put(self, request, pk):
        """Modifier une transaction"""
        transaction = self.get_object(pk, request.user)
        if not transaction:
            return Response({'error': 'Transaction not found'}, status=status.HTTP_404_NOT_FOUND)
        
        serializer = TransactionSerializer(transaction, data=request.data, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def delete(self, request, pk):
        """Supprimer une transaction"""
        transaction = self.get_object(pk, request.user)
        if not transaction:
            return Response({'error': 'Transaction not found'}, status=status.HTTP_404_NOT_FOUND)
        
        transaction.delete()
        return Response({'message': 'Transaction supprimée avec succès'}, status=status.HTTP_204_NO_CONTENT)
