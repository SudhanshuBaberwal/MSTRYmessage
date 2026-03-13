'use client'

import React from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { X } from 'lucide-react'
import { Message } from '@/model/User'
import axios from 'axios'
import toast from 'react-hot-toast'

type MessageCardProps = {
  message: Message;
  onMessageDelete: (messageId: string) => void;
}

export default function MessageCard({ message, onMessageDelete }: MessageCardProps) {

  const handleDeleteConfirm = async () => {
    try {
      // Optimistic UI update: instantly remove it from the screen
      onMessageDelete(message._id.toString());
      
      // Make the API call to delete
      await axios.delete(`/api/delete-message/${message._id}`);
      toast.success('Message deleted');
    } catch (error) {
      toast.error('Failed to delete message');
    }
  }

  return (
    <Card className="bg-slate-900/60 backdrop-blur-xl border border-slate-800/60 shadow-lg rounded-2xl overflow-hidden hover:border-indigo-500/30 transition-all group">
      <CardHeader className="p-5 pb-3">
        {/* THIS IS THE FIX: justify-between, gap-4, and shrink-0 on the button container */}
        <div className="flex justify-between items-start gap-4">
          <CardTitle className="text-slate-200 text-lg leading-snug wrap-break-word flex-1">
            {message.content}
          </CardTitle>
          
          {/* shrink-0 ensures this button NEVER gets crushed or hidden by the text */}
          <div className="shrink-0 mt-0.5">
            <Button 
              variant="destructive" 
              size="icon" 
              onClick={handleDeleteConfirm}
              className="w-8 h-8 rounded-full bg-rose-500/10 text-rose-400 hover:bg-rose-500 hover:text-white border border-rose-500/20 transition-all"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-5 pt-0">
        <div className="text-xs text-slate-500 font-medium mt-2">
          {new Date(message.createdAt).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })}
        </div>
      </CardContent>
    </Card>
  )
}