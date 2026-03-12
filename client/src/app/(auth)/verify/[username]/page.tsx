'use client'
import React from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import axios, { AxiosError } from 'axios'
import toast from 'react-hot-toast'

import { verifySchem } from '@/schemas/verifySchema'
import { ApiResponse } from '@/types/ApiResponse'
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form' // Form imported correctly here
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button' // Fixed Button import

const VerifyAccount = () => {

    const router = useRouter()
    const params = useParams<{ username: string }>()
    
    const form = useForm<z.infer<typeof verifySchem>>({
        resolver: zodResolver(verifySchem),
        defaultValues: {
            code: ""
        }
    })

    const onSubmit = async (data: z.infer<typeof verifySchem>) => {
        try {
            const response = await axios.post(`/api/verify-code`, { 
                username: params.username, 
                code: data.code 
            })
            toast.success(response.data.message)
            router.replace("/sign-in") // Added a forward slash for safety
        } catch (error) {
            console.error("Error in verify code : ", error)
            const axiosError = error as AxiosError<ApiResponse>;
            toast.error(axiosError.response?.data.message || "Invalid verification code")
        }
    }

    return (
        <div className="flex justify-center items-center min-h-screen bg-[#F8FAFC] p-4 sm:p-8 font-sans">
            <div className="w-full max-w-md p-10 space-y-8 bg-white border border-slate-100 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                
                <div className="space-y-3 text-center sm:text-left">
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">
                        Verify Account
                    </h1>
                    <p className="text-slate-500 text-sm font-medium">
                        Enter the verification code sent to your email.
                    </p>
                </div>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                        <FormField
                            name="code"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem> {/* Changed from FormIcon to FormItem */}
                                    <FormLabel className="text-slate-700 font-semibold">
                                        Verification Code
                                    </FormLabel>
                                    <Input 
                                        {...field} 
                                        placeholder="Enter 6-digit code"
                                        // Added text-center and tracking-widest for a premium OTP feel
                                        className="bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400 focus-visible:ring-1 focus-visible:ring-slate-900 rounded-xl h-12 px-4 shadow-sm text-center tracking-widest text-lg" 
                                    />
                                    <FormMessage className="text-rose-500" />
                                </FormItem>
                            )}
                        />
                        
                        <Button 
                            className="w-full h-12 bg-slate-900 text-white hover:bg-slate-800 font-semibold rounded-xl mt-8 shadow-sm" 
                            type="submit"
                            disabled={form.formState.isSubmitting} // Uses React-Hook-Form's built in loading state
                        >
                            {form.formState.isSubmitting ? "Verifying..." : "Verify"}
                        </Button>
                    </form>
                </Form>
            </div>
        </div>
    );
}

export default VerifyAccount