from django.shortcuts import render

# Create your views here.

def home(request):
    return render(request, 'budget/home.html', {'context_variables': 'values'})