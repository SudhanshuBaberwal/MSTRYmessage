'use client'
import React from 'react'
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { X, Quote } from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Message } from '@/model/User'
import axios from 'axios'
import toast from 'react-hot-toast'

type MessageCardProps = {
    message : Message,
    onMessageDelete : (messageId : string) => void
}

const MessageCard = ({message , onMessageDelete} : MessageCardProps) => {

    const handleDeleteConfirm =  async () => {
        const response = await axios.delete(`/api/delete-message/${message._id}`)
        toast.success(response.data.message)
        // onMessageDelete(message._id)
    }
    
    return (
        <Card className="bg-white border-slate-100 rounded-2xl shadow-[0_4px_20px_rgb(0,0,0,0.03)] overflow-hidden transition-shadow duration-300 hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] group font-sans">
            
            <CardHeader className="flex flex-row items-start justify-between p-6 pb-2">
                <div className="flex items-center gap-2 text-slate-400">
                    <Quote className="w-4 h-4" />
                    <span className="text-xs font-bold uppercase tracking-widest text-slate-400">
                        Anonymous
                    </span>
                </div>
                
                <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity hover:text-rose-600 hover:bg-rose-50 -mr-2 -mt-2 rounded-full"
                    aria-label="Delete message"
                >
                    <X className="w-4 h-4" />
                </Button>
            </CardHeader>

            <CardContent className="p-6 pt-2">
                <p className="text-slate-700 font-medium text-[15px] leading-relaxed">
                    "This is a placeholder for the secret message. The text here is beautifully spaced, highly legible, and feels like a premium personal note left just for you."
                </p>
                
                <div className="mt-6 text-xs font-semibold text-slate-400">
                    Oct 24, 2023 • 2:30 PM
                </div>
            </CardContent>
            
        </Card>
    )
}

export default MessageCard