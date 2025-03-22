"use client"; 

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

import { forgotPassword } from '@/app/api/auth';
import { toast } from 'react-toastify'; // Assuming you're using toast notifications
import { ForgotPasswordData } from "@/interface/auth";

export function ForgotForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<'form'>) {
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData: ForgotPasswordData = {
      email: event.currentTarget.email.value,
      isPanel: true, // Assuming isPanel should be set to true
    };

    try {
      await forgotPassword(formData);
      toast.success('Password reset link sent successfully!');
      // Handle redirection or further UI updates after successful request
    } catch{
        toast.error("There was an error sending the reset link. Please try again.");
    }
  };

  return (
    <form className={cn('flex flex-col gap-6', className)} onSubmit={handleSubmit} {...props}>
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Forgot your password?</h1>
        <p className="text-balance text-sm text-muted-foreground">
          Please enter the email address associated with your account and We will email you a link to reset your password.
        </p>
      </div>
      <div className="grid gap-6">
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" placeholder="m@example.com" required />
        </div>
        <Button type="submit" className="w-full">
          Send request
        </Button>
      </div>
      <div className="text-center text-sm">
        <a href="/auth/login" className="hover:underline">
          Return to Sign in
        </a>
      </div>
    </form>
  );
}
