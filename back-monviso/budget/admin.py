from django.contrib import admin
from .models import UserProfile, Category, Income, Expense, SavingsGoal, Transaction

# Register your models here.

@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'monthly_income', 'currency', 'onboarding_completed', 'created_at')
    list_filter = ('onboarding_completed', 'currency', 'created_at')
    search_fields = ('user__username', 'user__email')
    readonly_fields = ('created_at', 'updated_at')

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'type', 'user', 'created_at')
    list_filter = ('type', 'created_at')
    search_fields = ('name', 'user__username')

@admin.register(Income)
class IncomeAdmin(admin.ModelAdmin):
    list_display = ('name', 'amount', 'type', 'user', 'is_primary', 'frequency')
    list_filter = ('type', 'is_primary', 'frequency', 'created_at')
    search_fields = ('name', 'user__username')
    readonly_fields = ('created_at', 'updated_at')

@admin.register(Expense)
class ExpenseAdmin(admin.ModelAdmin):
    list_display = ('name', 'amount', 'type', 'user', 'category', 'frequency')
    list_filter = ('type', 'frequency', 'created_at')
    search_fields = ('name', 'user__username')
    readonly_fields = ('created_at', 'updated_at')

@admin.register(SavingsGoal)
class SavingsGoalAdmin(admin.ModelAdmin):
    list_display = ('name', 'target_amount', 'current_amount', 'progress_percentage', 'user', 'priority', 'type')
    list_filter = ('type', 'priority', 'created_at')
    search_fields = ('name', 'user__username')
    readonly_fields = ('created_at', 'updated_at', 'progress_percentage')
    
    def progress_percentage(self, obj):
        return f"{obj.progress_percentage:.1f}%"
    progress_percentage.short_description = 'Progression'

@admin.register(Transaction)
class TransactionAdmin(admin.ModelAdmin):
    list_display = ('name', 'amount', 'type', 'user', 'category', 'date', 'payment_method', 'frequency')
    list_filter = ('type', 'payment_method', 'frequency', 'date', 'created_at')
    search_fields = ('name', 'user__username', 'category')
    readonly_fields = ('created_at', 'updated_at')
    date_hierarchy = 'date'
