/* eslint-disable react-hooks/rules-of-hooks */
"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { forgotPassword } from '@/app/api/auth';
import { toast } from 'react-toastify';
import { ForgotPasswordData } from "@/interface/auth";
import { useState } from "react";

export function ForgotForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<'form'>) {
  const [loading, setLoading] = useState(false); // ✅ Correct place for useState

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData: ForgotPasswordData = {
      email: event.currentTarget.email.value,
      isPanel: true,
    };

    setLoading(true); // Start loading
    try {
      await forgotPassword(formData);
      toast.success('Password reset link sent successfully!');
    } catch {
      toast.error("There was an error sending the reset link. Please try again.");
    } finally {
      setLoading(false); // Stop loading
    }
  };

  return (
    <form className={cn('flex flex-col gap-6', className)} onSubmit={handleSubmit} {...props}>
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Forgot your password?</h1>
        <p className="text-balance text-sm text-muted-foreground">
          Please enter the email address associated with your account and we will email you a link to reset your password.
        </p>
      </div>
      <div className="grid gap-6">
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" placeholder="Enter your email   " required />
        </div>
        <Button 
          type="submit" 
          className="w-full"
          disabled={loading}
        >
          {loading ? "SENDING..." : "SEND REQUEST"}
        </Button>
      </div>
      <div className="text-center text-sm">
        <a href="/auth/login" className="hover:underline">
          BACK
        </a>
      </div>
    </form>
  );
}
