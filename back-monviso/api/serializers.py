from rest_framework import serializers
from django.contrib.auth.models import User
from budget.models import UserProfile, Income, Expense, SavingsGoal, Category, Transaction

class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = ['monthly_income', 'currency', 'onboarding_completed']

class IncomeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Income
        fields = ['id', 'name', 'amount', 'type', 'is_primary', 'frequency']

class ExpenseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Expense
        fields = ['id', 'name', 'amount', 'type', 'category', 'frequency']

class SavingsGoalSerializer(serializers.ModelSerializer):
    progress_percentage = serializers.ReadOnlyField()
    
    class Meta:
        model = SavingsGoal
        fields = ['id', 'name', 'target_amount', 'current_amount', 'target_date', 'type', 'priority', 'progress_percentage']

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name', 'type']

class TransactionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Transaction
        fields = ['id', 'name', 'amount', 'type', 'category', 'date', 'payment_method', 'frequency', 'created_at']
        read_only_fields = ['id', 'created_at']

    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)

class OnboardingDataSerializer(serializers.Serializer):
    # Personal info
    first_name = serializers.CharField(max_length=30)
    last_name = serializers.CharField(max_length=30)
    monthly_income = serializers.DecimalField(max_digits=10, decimal_places=2)
    currency = serializers.CharField(max_length=3, default='EUR')
    
    # Incomes
    incomes = IncomeSerializer(many=True, required=False)
    
    # Expenses
    fixed_expenses = ExpenseSerializer(many=True, required=False)
    variable_expenses = ExpenseSerializer(many=True, required=False)
    
    # Goals
    savings_goals = SavingsGoalSerializer(many=True, required=False)

    def create(self, validated_data):
        user = self.context['request'].user
        
        # Update user's first and last name
        user.first_name = validated_data.get('first_name', user.first_name)
        user.last_name = validated_data.get('last_name', user.last_name)
        user.save()
        
        # Create or update user profile
        profile, created = UserProfile.objects.get_or_create(user=user)
        profile.monthly_income = validated_data.get('monthly_income')
        profile.currency = validated_data.get('currency', 'EUR')
        profile.onboarding_completed = True
        profile.save()
        
        # Create incomes
        incomes_data = validated_data.get('incomes', [])
        for income_data in incomes_data:
            Income.objects.create(user=user, **income_data)
        
        # Create fixed expenses
        fixed_expenses_data = validated_data.get('fixed_expenses', [])
        for expense_data in fixed_expenses_data:
            expense_data['type'] = 'fixed'
            Expense.objects.create(user=user, **expense_data)
        
        # Create variable expenses
        variable_expenses_data = validated_data.get('variable_expenses', [])
        for expense_data in variable_expenses_data:
            expense_data['type'] = 'variable'
            Expense.objects.create(user=user, **expense_data)
        
        # Create savings goals
        goals_data = validated_data.get('savings_goals', [])
        for goal_data in goals_data:
            SavingsGoal.objects.create(user=user, **goal_data)
        
        return {
            'user': user,
            'profile': profile,
            'message': 'Onboarding completed successfully'
        }
