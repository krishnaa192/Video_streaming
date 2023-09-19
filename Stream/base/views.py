from django.shortcuts import render
from django.http import JsonResponse
from agora_token_builder import RtcTokenBuilder
import random
import time

# Create your views here.
def getToken(request):
    appId='759360cf7d3d4cb98a666858d6b64e0d'
    appCertificate='5d4f96036b2f4998ae6b20dc6f804d96'
    channelName = request.GET.get('channel')

    uid=random.randint(1,230)
    expirationTimeInSeconds=3600*98
    currentTimeStamp=time.time()
    privilegeExpiredTs=currentTimeStamp+expirationTimeInSeconds
    role=1
    token = RtcTokenBuilder.buildTokenWithUid(appId, appCertificate, channelName, uid, role, privilegeExpiredTs)
    return JsonResponse({'token':token,'uid':uid},safe=False)
def lobby(request):
    return render(request, 'base/lobby.html')

def room(request):
    return render(request, 'base/room.html')