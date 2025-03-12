'use client'

// import LoginForm from "./auth/login/page";

import dynamic from "next/dynamic";

const LoginForm = dynamic(
  () => import('./auth/login/page'), 
  { ssr: false }
)

export default function Home() {
  return (
   <div>
    <LoginForm/>
   </div>
  );
}
