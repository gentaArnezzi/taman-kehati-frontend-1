'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { MessageCircle, X } from 'lucide-react';
import { Chatbot } from '@/components/chatbot';

export function FloatingChatbot() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleOpenChat = () => {
      setIsOpen(true);
    };

    window.addEventListener('openFloatingChatbot', handleOpenChat);

    return () => {
      window.removeEventListener('openFloatingChatbot', handleOpenChat);
    };
  }, []);

  return (
    <>
      {isOpen ? (
        <div className="fixed bottom-24 right-4 w-full max-w-md z-50">
          <div className="bg-background border rounded-lg shadow-lg overflow-hidden">
            <div className="flex justify-between items-center p-3 border-b">
              <h3 className="font-medium flex items-center gap-2">
                <MessageCircle className="h-4 w-4 text-primary" />
                Taman Kehati Assistant
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
                className="h-6 w-6 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="h-80 p-2">
              <Chatbot />
            </div>
          </div>
        </div>
      ) : (
        <Button
          onClick={() => setIsOpen(true)}
          size="lg"
          className="fixed bottom-4 right-4 h-14 w-14 rounded-full p-0 z-50 shadow-lg"
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
      )}
    </>
  );
}