from django.http import FileResponse,JsonResponse
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import render
import requests as req
import os
from pathlib import Path


def render_home(request):
    return render(request, 'ui_preview_page.html', {})


def get_suggestions(request):
    return JsonResponse( {'data':['suggestion1','suggestion2','suggestion3','suggestion4','suggestion5','suggestion6','suggestion7']})
