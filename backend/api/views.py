from django.shortcuts import render, HttpResponse
from django.contrib.auth.models import User
from rest_framework import generics
from .serializers import UserSerializer, NoteSerializer
from rest_framework.permissions import IsAuthenticated, AllowAny
from .models import Note
from .models import TodoItem

# Create your views here.

class NoteListCreate(generics.ListCreateAPIView):
    serializer_class = NoteSerializer
    # Can't access unless you pass a valid JWT token
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Note.objects.filter(author=user)
    
    # The reason we have to manually perform_create is because we set author to read_only in the serializer so we have to handle the autho creation
    def perform_create(self, serializer):
        if serializer.is_valid():
            serializer.save(author=self.request.user)
        else:
            print(serializer.errors)

class NoteDelete(generics.DestroyAPIView):
    serializer_class = NoteSerializer
    permission_classes = [IsAuthenticated]

    # Specify the set of valid notes you can delete and manually overridden to ensure only active user
    def get_queryset(self):
        user = self.request.user
        return Note.objects.filter(author=user)


class CreateUserView(generics.CreateAPIView):
    # Look at list of all users so we don't create a new one that already exists
    queryset = User.objects.all()
    # Tells what kind of data is required by the Serializer
    serializer_class = UserSerializer
    permission_classes = [AllowAny]

def home(request):
    return render(request, "home.html")


def todo(request):
    items = TodoItem.objects.all()
    return render(request, "todos.html", {"todos": items})
