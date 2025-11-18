import { Suspense } from "react";
import LoginForm from "@/app/features/auth/login/login-form";

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
