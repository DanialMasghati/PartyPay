from rest_framework import serializers

class ExpenseSerializer(serializers.Serializer):
    item = serializers.CharField(max_length=200)
    amount = serializers.IntegerField()
    consumers = serializers.ListField(child=serializers.CharField(), allow_empty=False)

class PayerSerializer(serializers.Serializer):
    name = serializers.CharField(max_length=100)
    amount = serializers.IntegerField()

class CalculationRequestSerializer(serializers.Serializer):
    expenses = ExpenseSerializer(many=True)
    payers = PayerSerializer(many=True)
    participants = serializers.ListField(child=serializers.CharField(), allow_empty=False)