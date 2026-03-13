'use client'

import MessageCard from '@/components/MessageCard'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Switch } from '@/components/ui/switch'
import { Message } from '@/model/User'
import { AcceptMessageSchema } from '@/schemas/acceptMessageSchema'
import { ApiResponse } from '@/types/ApiResponse'
import { zodResolver } from '@hookform/resolvers/zod'
import axios, { AxiosError } from 'axios'
import { Loader2, RefreshCcw, Link as LinkIcon, Settings, Inbox, Copy } from 'lucide-react'
import { User } from 'next-auth'
import { useSession } from 'next-auth/react'
import React, { useCallback, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'

const DashboardPage = () => {
    const [messages, setMessages] = useState<Message[]>([])
    const [loading, setLoading] = useState(false)
    const [isSwitchLoading, setIsSwitchLoading] = useState(false)
    const [baseUrl, setBaseUrl] = useState("")

    const handleDeleteMessage = (messageId: string) => {
        setMessages((prevMessages) =>
            prevMessages.filter((message) => message._id.toString() !== messageId)
        );
    };
    const { data: session } = useSession()
    const form = useForm({
        resolver: zodResolver(AcceptMessageSchema)
    })

    const { register, watch, setValue } = form
    const acceptMessages = watch('acceptMessages')

    const fetchAcceptMessage = useCallback(async () => {
        setIsSwitchLoading(true)
        try {
            const response = await axios.get(`/api/accept-messages`)
            setValue('acceptMessages', response.data.isAcceptingMessage)
        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>
            toast.error(axiosError.response?.data.message || "Failed to fetch message setting")
        } finally {
            setIsSwitchLoading(false)
        }
    }, [setValue])

    const fetchMessages = useCallback(async (refresh: boolean = false) => {
        if (refresh) {
            setIsSwitchLoading(true)
        } else {
            setLoading(true)
        }
        try {
            const response = await axios.get<ApiResponse>("/api/get-messages")
            setMessages(response.data.messages || [])
            if (refresh) {
                toast.success("Showing latest messages")
            }
        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>
            toast.error(axiosError.response?.data.message || "Failed to fetch messages")
        } finally {
            setLoading(false)
            setIsSwitchLoading(false)
        }
    }, [])

    useEffect(() => {
        if (!session || !session.user) return
        fetchMessages()
        fetchAcceptMessage()
    }, [session, setValue, fetchAcceptMessage, fetchMessages])

    const handleSwitchChange = async () => {
        try {
            const response = await axios.post<ApiResponse>("/api/accept-messages", { acceptMessages: !acceptMessages })
            setValue('acceptMessages', !acceptMessages)
            toast.success(response.data.message || "Message acceptance status updated")
        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>
            toast.error(axiosError.response?.data.message || "Failed to update message setting")
        }
    }

    const username = session?.user?.username

    useEffect(() => {
        const url = `${window.location.protocol}//${window.location.host}`;
        setBaseUrl(url);
    }, []);

    const profileUrl = `${baseUrl}/u/${username}`

    const copyToClipboard = () => {
        navigator.clipboard.writeText(profileUrl)
        toast.success("URL Copied to clipboard!")
    }

    if (!session || !session.user) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-950 text-slate-400 font-medium text-lg">
                Loading your dashboard...
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-slate-950 font-sans relative pb-16 overflow-x-hidden">

            <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-indigo-900/20 blur-[120px] rounded-full pointer-events-none z-0"></div>

            <div className="relative z-10 my-8 px-4 md:px-8 mx-auto w-full max-w-6xl space-y-8">

                <header>
                    <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-slate-100">
                        User Dashboard
                    </h1>
                    <p className="text-slate-400 mt-2 text-sm md:text-base">Manage your unique link and anonymous feedback.</p>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                    <div className="lg:col-span-2 bg-slate-900/60 backdrop-blur-xl border border-slate-800/60 rounded-[1.5rem] p-5 md:p-6 shadow-xl overflow-hidden">
                        <h2 className="text-lg font-bold text-slate-200 mb-4 flex items-center gap-2">
                            <LinkIcon className="w-5 h-5 text-indigo-400" />
                            Share Your Unique Link
                        </h2>
                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                            <input
                                type="text"
                                value={profileUrl}
                                readOnly
                                className="w-full min-w-0 bg-slate-950/50 border border-slate-800 text-slate-300 rounded-xl h-12 px-4 focus:outline-none focus:border-indigo-500/50 text-ellipsis"
                            />
                            <Button
                                onClick={copyToClipboard}
                                className="w-full sm:w-auto h-12 px-6 rounded-xl bg-indigo-600 text-white font-bold hover:bg-indigo-700 transition-colors shrink-0 flex items-center justify-center gap-2"
                            >
                                <Copy className="w-4 h-4" />
                                Copy Link
                            </Button>
                        </div>
                    </div>

                    <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800/60 rounded-[1.5rem] p-5 md:p-6 shadow-xl flex flex-col justify-center">
                        <h2 className="text-lg font-bold text-slate-200 mb-4 flex items-center gap-2">
                            <Settings className="w-5 h-5 text-indigo-400" />
                            Message Settings
                        </h2>
                        <div className="flex items-center justify-between bg-slate-950/50 border border-slate-800 rounded-xl p-3 px-4">
                            <span className="text-slate-300 font-medium text-sm">
                                Accept Messages
                            </span>
                            <div className="flex items-center gap-3">
                                <span className={acceptMessages ? "text-emerald-400 text-sm font-bold" : "text-rose-400 text-sm font-bold"}>
                                    {acceptMessages ? 'ON' : 'OFF'}
                                </span>
                                <Switch
                                    {...register('acceptMessages')}
                                    checked={acceptMessages}
                                    onCheckedChange={handleSwitchChange}
                                    disabled={isSwitchLoading}
                                    className="data-[state=checked]:bg-indigo-500"
                                />
                            </div>
                        </div>
                    </div>

                </div>

                <Separator className="bg-slate-800/60 my-6 md:my-8" />

                <div>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
                        <h2 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
                            <Inbox className="w-6 h-6 text-indigo-400" />
                            Your Inbox
                        </h2>

                        <Button
                            variant="outline"
                            onClick={(e) => {
                                e.preventDefault();
                                fetchMessages(true);
                            }}
                            className="w-full sm:w-auto h-10 rounded-xl border-slate-700 bg-transparent text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
                        >
                            {loading || isSwitchLoading ? (
                                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                            ) : (
                                <RefreshCcw className="h-4 w-4 mr-2" />
                            )}
                            Refresh Messages
                        </Button>
                    </div>

                    {messages.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                            {messages.map((message) => (
                                <MessageCard
                                    key={message._id.toString()}
                                    message={message}
                                    onMessageDelete={handleDeleteMessage}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-16 md:py-20 bg-slate-900/30 border border-slate-800/60 rounded-[1.5rem] border-dashed px-4">
                            <Inbox className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                            <p className="text-slate-300 text-lg font-medium">No messages yet</p>
                            <p className="text-slate-500 text-sm mt-1">Copy and share your link to start receiving anonymous feedback.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default DashboardPage