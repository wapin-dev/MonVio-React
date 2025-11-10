from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('budget', '0002_transaction'),
    ]

    operations = [
        migrations.AddField(
            model_name='category',
            name='color',
            field=models.CharField(default='#6366F1', max_length=9),
        ),
        migrations.AddField(
            model_name='category',
            name='icon',
            field=models.CharField(default='💰', max_length=16),
        ),
        migrations.AddField(
            model_name='category',
            name='monthly_budget',
            field=models.DecimalField(blank=True, decimal_places=2, max_digits=10, null=True),
        ),
        migrations.AddField(
            model_name='category',
            name='updated_at',
            field=models.DateTimeField(auto_now=True),
        ),
    ]
