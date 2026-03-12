'use client'
import React, { useEffect, useState } from 'react'
import { useForm } from "react-hook-form"
import * as z from "zod"
import Link from 'next/link'
import { useDebounceCallback } from "usehooks-ts"
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'
import { signUpSchema } from '@/schemas/signupSchema'
import { zodResolver } from "@hookform/resolvers/zod"
import axios, { AxiosError } from "axios"
import { ApiResponse } from '@/types/ApiResponse'
import { CheckCircle2, XCircle, Search, Eye, EyeOff } from "lucide-react" // Added Eye and EyeOff icons
import {
    Form,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from "@/components/ui/form"
import { Input } from '@/components/ui/input'
import { Button } from "@/components/ui/button"

const SignUpPage = () => {
    const [username, setUsername] = useState("")
    const [usernameMessage, setUsernameMessage] = useState("")
    const [loading, setLoading] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    
    // State for toggling password visibility
    const [showPassword, setShowPassword] = useState(false)
    
    const router = useRouter()
    const debounced = useDebounceCallback(setUsername, 300)

    // zod implementation
    const form = useForm<z.infer<typeof signUpSchema>>({
        resolver: zodResolver(signUpSchema),
        defaultValues: {
            username: '',
            email: '',
            password: ''
        }
    })

    useEffect(() => {
        const checkUsernameUnique = async () => {
            if (username) {
                setLoading(true)
                setUsernameMessage('')
                try {
                    const response = await axios.get(`/api/check-username-unique?username=${username}`)
                    setUsernameMessage(response.data.message)
                } catch (error) {
                    const axiosError = error as AxiosError<ApiResponse>
                    setUsernameMessage(axiosError.response?.data.message ?? "Error checking username")
                }
                finally {
                    setLoading(false)
                }
            }
        }
        checkUsernameUnique()
    }, [username])

    const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
        setIsSubmitting(true)

        try {
            const response = await axios.post<ApiResponse>("/api/sign-up", data)
            toast.success(response.data.message)

            router.replace(`/verify/${data.username}`)
        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>
            toast.error(axiosError.response?.data.message ?? "Signup failed")
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="flex justify-center items-center min-h-screen bg-[#F8FAFC] p-4 sm:p-8 font-sans">
            <div className="w-full max-w-md p-10 space-y-8 bg-white border border-slate-100 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                
                <div className="space-y-3">
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">
                        Join True Feedback
                    </h1>
                    <p className="text-slate-500 text-sm font-medium">
                        Create an account to start your secret conversations.
                    </p>
                </div>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                        <FormField
                            name="username"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-slate-700 font-semibold">Username</FormLabel>
                                    <div className="relative">
                                        <Input
                                            {...field}
                                            className="bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400 focus-visible:ring-1 focus-visible:ring-slate-900 rounded-xl h-12 px-4 shadow-sm"
                                            placeholder="Choose a username"
                                            onChange={(e) => {
                                                field.onChange(e)
                                                debounced(e.target.value)
                                            }}
                                        />
                                        <div className="absolute right-4 top-3.5 h-5 w-5 text-slate-400">
                                            {loading && <Search className="h-4 w-4" />}
                                            {!loading && usernameMessage?.toLowerCase().includes('unique') && <CheckCircle2 className="h-4 w-4 text-emerald-500" />}
                                            {!loading && usernameMessage && !usernameMessage?.toLowerCase().includes('unique') && <XCircle className="h-4 w-4 text-rose-500" />}
                                        </div>
                                    </div>
                                    {usernameMessage && !loading && (
                                        <p className={`text-xs font-semibold ${usernameMessage?.toLowerCase().includes('unique') ? 'text-emerald-600' : 'text-rose-600'}`}>
                                            {usernameMessage}
                                        </p>
                                    )}
                                    {loading && (
                                        <p className="text-xs text-slate-500 font-medium">Checking availability...</p>
                                    )}
                                    <FormMessage className="text-rose-500" />
                                </FormItem>
                            )}
                        />

                        <FormField
                            name="email"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-slate-700 font-semibold">Email</FormLabel>
                                    <Input 
                                        {...field} 
                                        type="email"
                                        placeholder="you@example.com"
                                        className="bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400 focus-visible:ring-1 focus-visible:ring-slate-900 rounded-xl h-12 px-4 shadow-sm" 
                                    />
                                    <FormMessage className="text-rose-500" />
                                </FormItem>
                            )}
                        />

                        {/* Password Field with Show/Hide Toggle */}
                        <FormField
                            name="password"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-slate-700 font-semibold">Password</FormLabel>
                                    <div className="relative">
                                        <Input 
                                            type={showPassword ? "text" : "password"} 
                                            {...field} 
                                            placeholder="••••••••"
                                            // Added pr-12 to ensure the text doesn't hide behind the icon
                                            className="bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400 focus-visible:ring-1 focus-visible:ring-slate-900 rounded-xl h-12 px-4 pr-12 shadow-sm"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-4 top-3.5 text-slate-400 hover:text-slate-600 focus:outline-none transition-colors"
                                            aria-label={showPassword ? "Hide password" : "Show password"}
                                        >
                                            {showPassword ? (
                                                <EyeOff className="h-5 w-5" />
                                            ) : (
                                                <Eye className="h-5 w-5" />
                                            )}
                                        </button>
                                    </div>
                                    <FormMessage className="text-rose-500" />
                                </FormItem>
                            )}
                        />

                        <Button 
                            className="w-full h-12 bg-slate-900 text-white hover:bg-slate-800 font-semibold rounded-xl mt-8 shadow-sm" 
                            type="submit" 
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? "Creating account..." : "Sign Up"}
                        </Button>
                    </form>
                </Form>

                <div className="pt-6 text-center">
                    <p className="text-slate-500 text-sm font-medium">
                        Already have an account?{' '}
                        <Link href="/sign-in" className="text-slate-900 font-bold hover:underline underline-offset-4">
                            Sign in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    )
}

export default SignUpPage