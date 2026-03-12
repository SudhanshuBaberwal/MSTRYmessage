'use client';

import React, { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { signIn } from 'next-auth/react';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signInSchema } from '@/schemas/signinSchema';
import toast from 'react-hot-toast';
import { Eye, EyeOff } from 'lucide-react'; // Added for password visibility toggle

export default function SignInForm() {
  const router = useRouter();
  
  // Added state for the password toggle
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      identifier: '',
      password: '',
    },
  });

  const onSubmit = async (data: z.infer<typeof signInSchema>) => {
    const result = await signIn('credentials', {
      redirect: false,
      identifier: data.identifier,
      password: data.password,
    });

    if (result?.error) {
      if (result.error === 'CredentialsSignin') {
        toast.error("Incorrect email/username or password");
      } else {
        toast.error(result.error);
      }
    }

    if (result?.url) {
      router.replace('/dashboard');
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-[#F8FAFC] p-4 sm:p-8 font-sans">
      <div className="w-full max-w-md p-10 space-y-8 bg-white border border-slate-100 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
        
        <div className="space-y-3 text-center sm:text-left">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Welcome Back
          </h1>
          <p className="text-slate-500 text-sm font-medium">
            Sign in to continue your secret conversations.
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            
            <FormField
              name="identifier"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-slate-700 font-semibold">Email / Username</FormLabel>
                  <Input 
                    {...field} 
                    className="bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400 focus-visible:ring-1 focus-visible:ring-slate-900 rounded-xl h-12 px-4 shadow-sm"
                    placeholder="Enter your email or username"
                  />
                  <FormMessage className="text-rose-500" />
                </FormItem>
              )}
            />
            
            <FormField
              name="password"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  {/* Label area with Forgot Password link */}
                  <div className="flex justify-between items-center">
                    <FormLabel className="text-slate-700 font-semibold">Password</FormLabel>
                    <Link 
                      href="/forgot-password" 
                      className="text-sm font-semibold text-slate-500 hover:text-slate-900 hover:underline underline-offset-4 transition-colors"
                      tabIndex={-1} 
                    >
                      Forgot password?
                    </Link>
                  </div>
                  
                  {/* Password Input with Toggle */}
                  <div className="relative">
                    <Input 
                      type={showPassword ? "text" : "password"} 
                      {...field} 
                      placeholder="••••••••"
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
              disabled={form.formState.isSubmitting} // Automatically handles loading state during NextAuth signIn
            >
              {form.formState.isSubmitting ? "Signing in..." : "Sign In"}
            </Button>
          </form>
        </Form>

        <div className="pt-6 text-center">
          <p className="text-slate-500 text-sm font-medium">
            Not a member yet?{' '}
            <Link href="/sign-up" className="text-slate-900 font-bold hover:underline underline-offset-4">
              Sign up
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
}