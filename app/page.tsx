'use client';

import { Suspense } from 'react';
import { LoginForm } from "@/components/auth/login-form";
import Image from "next/image";
import { GoogleLoginHandler } from '@/components/auth/google-login';

export default function Home() {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start"></div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <Suspense fallback={<div>Đang tải...</div>}>
              <LoginForm />
              <GoogleLoginHandler /> {/* 👈 bọc phần xử lý useSearchParams ở đây */}
            </Suspense>
          </div>
        </div>
      </div>
      <div className="relative hidden bg-muted lg:block">
        <Image
          src="/Post.png"
          alt="Image"
          layout="fill"
          objectFit="cover"
          className="absolute inset-0 dark:brightness-[0.2] dark:grayscale"
        />
      </div>
    </div>
  );
}
