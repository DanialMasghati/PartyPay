import os
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
    prompt = "لطفاً به عنوان یک حسابدار دقیق، دنگ مهمانی ما را محاسبه کن. اطلاعات خریدها و پرداخت‌ها به شرح زیر است:\n\n"
    prompt += "۱. لیست هزینه‌ها و مصرف‌کنندگان:\n"
    for exp in data['expenses']:
        consumers_str = "، ".join(exp['consumers'])
        prompt += f"[مثال: {exp['item']}: مبلغ {exp['amount']} تومان - مصرف‌کنندگان: {consumers_str}]\n"
    
    prompt += "\n۲. لیست پرداخت‌کنندگان (چه کسی پول خرج کرده):\n"
    for payer in data['payers']:
        prompt += f"[مثال: {payer['name']}: {payer['amount']} تومان پرداخت کرده]\n"
    
    prompt += "\n۳. لیست تمام افراد حاضر:\n"
    participants_str = "، ".join(data['participants'])
    prompt += f"[{participants_str}]\n"
    
    prompt += "\nخروجی مورد انتظار:\nلطفاً محاسبات را گام‌به‌گام انجام بده و در نهایت یک جدول Markdown شامل ستون‌های زیر ارائه کن:\n۱. نام فرد\n۲. سهم کل\n۳. مبلغی که قبلاً پرداخت کرده\n۴. وضعیت نهایی (بدهکار/بستانکار)\nدر انتها، دقیقاً مشخص کن که چه کسی باید به چه کسی پول واریز کند تا همه حساب‌ها صاف شود."
    
    return prompt

class CalculateShareView(APIView):
    def post(self, request):
        # 1. اعتبارسنجی
        serializer = CalculationRequestSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        # 2. ریت لیمیت (Rate Limiting)
        user_ip = get_client_ip(request)
        today = timezone.now().date()
        
        usage_record, created = DailyUsage.objects.get_or_create(ip_address=user_ip, date=today)
        
        if usage_record.request_count >= 3:
             return Response(
                {"error": "شما از سقف مجاز ۳ بار استفاده در روز عبور کرده‌اید."},
                status=status.HTTP_429_TOO_MANY_REQUESTS
            )
        
        validated_data = serializer.validated_data
        generated_prompt = create_prompt(validated_data)

        try:
            client = OpenAI(
                base_url=os.getenv('LIARA_BASE_URL'),
                api_key=os.getenv('LIARA_API_KEY'),
            )

            completion = client.chat.completions.create(
                model=os.getenv('LIARA_MODEL_NAME'),
                messages=[
                    {
                        "role": "user",
                        "content": generated_prompt
                    }
                ]
            )

            ai_response = completion.choices[0].message.content

            # موفقیت‌آمیز بود، پس کنتور را می‌اندازیم
            usage_record.request_count += 1
            usage_record.save()

            return Response({
                "result": ai_response,
                "remaining_requests": 3 - usage_record.request_count
            }, status=status.HTTP_200_OK)

        except Exception as e:
            # اگر خطایی در ارتباط با AI پیش آمد
            return Response(
                {"error": "خطا در ارتباط با سرویس هوش مصنوعی", "details": str(e)},
                status=status.HTTP_503_SERVICE_UNAVAILABLE
            )