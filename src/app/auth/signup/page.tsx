import { Suspense } from "react";
import SignUpForm from "@/features/auth/signup/signup-form";

export default function SignUpPage() {
  return (
    <Suspense>
      <SignUpForm />
    </Suspense>
  );
}
