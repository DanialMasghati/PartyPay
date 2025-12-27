import os
import json
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.utils import timezone
from openai import OpenAI
from .models import DailyUsage
from .serializers import CalculationRequestSerializer

def get_client_ip(request):
    x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
    if x_forwarded_for:
        ip = x_forwarded_for.split(',')[0]
    else:
        ip = request.META.get('REMOTE_ADDR')
    return ip

def create_prompt(data):
    input_data = f"""
    Expenses: {json.dumps(data['expenses'], ensure_ascii=False)}
    Payers: {json.dumps(data['payers'], ensure_ascii=False)}
    Participants: {json.dumps(data['participants'], ensure_ascii=False)}
    """

    prompt = f"""
    You are an expert accountant API. You must output ONLY valid JSON.
    Calculate the party split based on the following data:
    {input_data}

    Response Format (JSON ONLY):
    {{
        "table": [
            {{"name": "Name", "share": 1000, "paid": 0, "balance": -1000, "status": "Debtor/Creditor"}}
        ],
        "settlements": [
            {{"from": "Name", "to": "Name", "amount": 1000}}
        ],
        "reasoning": "Short summary of how calculation was done."
    }}
    
    Rules:
    1. 'balance' is (paid - share). Negative means they owe money.
    2. 'settlements' must minimize transactions.
    3. Do NOT write any introduction or conclusion text. ONLY the JSON object.
    """
    return prompt

class CalculateShareView(APIView):
    def post(self, request):
        serializer = CalculationRequestSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        # Rate Limiting
        user_ip = get_client_ip(request)
        today = timezone.now().date()
        usage_record, created = DailyUsage.objects.get_or_create(ip_address=user_ip, date=today)
        
        if usage_record.request_count >= 100:
             return Response({"error": "Daily limit reached."}, status=status.HTTP_429_TOO_MANY_REQUESTS)
        
        validated_data = serializer.validated_data
        generated_prompt = create_prompt(validated_data)

        try:
            client = OpenAI(
                base_url=os.getenv('LIARA_BASE_URL'),
                api_key=os.getenv('LIARA_API_KEY'),
            )

            completion = client.chat.completions.create(
                model=os.getenv('LIARA_MODEL_NAME'),
                messages=[{"role": "user", "content": generated_prompt}],
                # این خط به مدل می‌فهماند که حتما جیسون بدهد (اگر مدل پشتیبانی کند)
                response_format={"type": "json_object"} 
            )

            ai_content = completion.choices[0].message.content
            
            # تبدیل رشته به جیسون پایتون
            ai_json = json.loads(ai_content)

            usage_record.request_count += 1
            usage_record.save()

            return Response(ai_json, status=status.HTTP_200_OK)

        except Exception as e:
            print(f"Error: {e}")
            return Response(
                {"error": "AI Processing Error", "details": str(e)},
                status=status.HTTP_503_SERVICE_UNAVAILABLE
            )