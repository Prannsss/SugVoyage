'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ArrowLeft, Send, Search, Phone, Video } from 'lucide-react';
import { findUserByUsername } from '@/lib/posts';

// Hardcoded messages data for testing
const conversations = [
  {
    id: 1,
    user: {
      name: 'Sarah Johnson',
      username: 'sarah_j',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face',
    },
    lastMessage: 'That place looks amazing! 🌟',
    timestamp: '2 min ago',
    unread: true,
    messages: [
      { id: 1, sender: 'sarah_j', content: 'Hey! I saw your post about Bali', timestamp: '10:30 AM' },
      { id: 2, sender: 'me', content: 'Yes! It was incredible. The temples were breathtaking', timestamp: '10:32 AM' },
      { id: 3, sender: 'sarah_j', content: 'That place looks amazing! 🌟', timestamp: '10:35 AM' },
    ]
  },
  {
    id: 2,
    user: {
      name: 'Mike Chen',
      username: 'mike_explorer',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
    },
    lastMessage: 'Thanks for the travel tips!',
    timestamp: '1 hour ago',
    unread: false,
    messages: [
      { id: 1, sender: 'mike_explorer', content: 'Your itinerary for Japan looks perfect!', timestamp: '9:20 AM' },
      { id: 2, sender: 'me', content: 'Glad you liked it! Make sure to visit the bamboo forest', timestamp: '9:25 AM' },
      { id: 3, sender: 'mike_explorer', content: 'Thanks for the travel tips!', timestamp: '9:30 AM' },
    ]
  },
  {
    id: 3,
    user: {
      name: 'Emma Wilson',
      username: 'wanderlust_emma',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
    },
    lastMessage: 'Planning my next trip to Europe',
    timestamp: '3 hours ago',
    unread: true,
    messages: [
      { id: 1, sender: 'wanderlust_emma', content: 'Hi! I loved your Paris recommendations', timestamp: '7:15 AM' },
      { id: 2, sender: 'me', content: 'Thank you! Did you visit the Louvre?', timestamp: '7:20 AM' },
      { id: 3, sender: 'wanderlust_emma', content: 'Planning my next trip to Europe', timestamp: '7:25 AM' },
    ]
  }
];

function MessagesContent() {
  const [selectedConversation, setSelectedConversation] = useState<number | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const searchParams = useSearchParams();
  
  // Check if we have a specific user to message
  const withUser = searchParams.get('with');

  useEffect(() => {
    if (withUser) {
      // Find existing conversation with this user or create one
      const existingConv = conversations.find(conv => conv.user.username === withUser);
      if (existingConv) {
        setSelectedConversation(existingConv.id);
      } else {
        // Create a new conversation for this user
        const userProfile = findUserByUsername(withUser);
        if (userProfile) {
          const newConv = {
            id: Date.now(), // Simple ID generation for demo
            user: {
              name: userProfile.name,
              username: userProfile.username,
              avatar: userProfile.avatar,
            },
            lastMessage: '',
            timestamp: 'now',
            unread: false,
            messages: []
          };
          conversations.unshift(newConv);
          setSelectedConversation(newConv.id);
        }
      }
    }
  }, [withUser]);

  const filteredConversations = conversations.filter(conv => 
    conv.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    conv.user.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedConv = selectedConversation ? conversations.find(c => c.id === selectedConversation) : null;

  const handleSendMessage = () => {
    if (newMessage.trim() && selectedConv) {
      // In a real app, this would send the message
      const newMsg = {
        id: Date.now(),
        sender: 'me',
        content: newMessage.trim(),
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      
      selectedConv.messages.push(newMsg);
      selectedConv.lastMessage = newMessage.trim();
      selectedConv.timestamp = 'now';
      
      setNewMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex bg-background h-screen">
      {/* Conversations List */}
      <div className={`w-full md:w-80 border-r ${selectedConversation ? 'hidden md:block' : 'block'} flex flex-col`}>
        <div className="p-4 border-b flex-shrink-0">
          <div className="flex items-center gap-3 mb-4">
            <Button variant="ghost" size="icon" asChild>
              <Link href="/profile/alex_doe">
                <ArrowLeft className="h-5 w-5" />
              </Link>
            </Button>
            <h1 className="text-xl font-semibold">Messages</h1>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search conversations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        
        <ScrollArea className="flex-1 overflow-y-auto">
          {filteredConversations.map((conversation) => (
            <div
              key={conversation.id}
              onClick={() => setSelectedConversation(conversation.id)}
              className={`p-4 border-b cursor-pointer hover:bg-muted/50 transition-colors ${
                selectedConversation === conversation.id ? 'bg-muted' : ''
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={conversation.user.avatar} alt={conversation.user.name} />
                    <AvatarFallback>{conversation.user.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  {conversation.unread && (
                    <div className="absolute -top-1 -right-1 h-3 w-3 bg-primary rounded-full" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium truncate">{conversation.user.name}</h3>
                    <span className="text-xs text-muted-foreground">{conversation.timestamp}</span>
                  </div>
                  <p className="text-sm text-muted-foreground truncate">
                    {conversation.lastMessage || 'Start a conversation...'}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </ScrollArea>
      </div>

      {/* Chat Area */}
      {selectedConv ? (
        <div className="flex-1 flex flex-col">
          {/* Chat Header */}
          <div className="p-4 border-b flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setSelectedConversation(null)}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <Avatar className="h-10 w-10">
              <AvatarImage src={selectedConv.user.avatar} alt={selectedConv.user.name} />
              <AvatarFallback>{selectedConv.user.name.slice(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h2 className="font-medium">{selectedConv.user.name}</h2>
              <p className="text-sm text-muted-foreground">@{selectedConv.user.username}</p>
            </div>
            <div className="flex gap-2">
              <Button variant="ghost" size="icon">
                <Phone className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon">
                <Video className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Messages */}
          <ScrollArea className="flex-1 p-4">
            {selectedConv.messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <Avatar className="h-16 w-16 mb-4">
                  <AvatarImage src={selectedConv.user.avatar} alt={selectedConv.user.name} />
                  <AvatarFallback>{selectedConv.user.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <h3 className="font-medium mb-2">{selectedConv.user.name}</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Start a conversation with @{selectedConv.user.username}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {selectedConv.messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender === 'me' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[70%] rounded-lg px-3 py-2 ${
                        message.sender === 'me'
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted'
                      }`}
                    >
                      <p className="text-sm">{message.content}</p>
                      <p className={`text-xs mt-1 ${
                        message.sender === 'me' ? 'text-primary-foreground/70' : 'text-muted-foreground'
                      }`}>
                        {message.timestamp}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>

          {/* Message Input */}
          <div className="p-4 border-t">
            <div className="flex gap-2">
              <Input
                placeholder="Type a message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                className="flex-1"
              />
              <Button onClick={handleSendMessage} disabled={!newMessage.trim()}>
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div className="hidden md:flex flex-1 items-center justify-center">
          <div className="text-center">
            <h2 className="text-xl font-semibold mb-2">Select a conversation</h2>
            <p className="text-muted-foreground">Choose a conversation from the left to start messaging</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default function MessagesPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center h-screen">Loading messages...</div>}>
      <MessagesContent />
    </Suspense>
  );
}
