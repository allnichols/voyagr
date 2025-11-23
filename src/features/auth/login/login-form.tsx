"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { useState } from "react";
import Link from "next/link";

type LoginPayload = {
  email: string;
  password: string;
};

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const error = searchParams.get("error");
  const [formData, setFormData] = useState<LoginPayload>({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await signIn("credentials", {
        redirect: false,
        email: formData.email,
        password: formData.password,
        callbackUrl: "/dashboard",
      });

      if (res?.error) {
        setLoginError(res.error);
        setLoading(false);
        return;
      }

      router.push("/dashboard");
    } catch (error) {
      setLoading(false);
      console.error("Login failed:", error);
    }
  };

  return (
    <div>
      <h1 className="text-center text-3xl">Login</h1>
      <form onSubmit={handleLogin} className="m-auto mt-6 max-w-md">
        {loginError && (
          <p className="text-red-500 mb-4">
            {loginError === "CredentialsSignin"
              ? "Invalid email or password."
              : "Login failed. Please try again."}
          </p>
        )}
        <fieldset className="fieldset">
          <label className="input validator w-full mb-4">
            <svg
              className="h-[1em] opacity-50"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
            >
              <g
                strokeLinejoin="round"
                strokeLinecap="round"
                strokeWidth="2.5"
                fill="none"
                stroke="currentColor"
              >
                <rect width="20" height="16" x="2" y="4" rx="2"></rect>
                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
              </g>
            </svg>
            <input
              type="email"
              name="email"
              placeholder="mail@site.com"
              required
              onChange={handleInput}
            />
          </label>

          <label className="input validator w-full mb-4">
            <svg
              className="h-[1em] opacity-50"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
            >
              <g
                strokeLinejoin="round"
                strokeLinecap="round"
                strokeWidth="2.5"
                fill="none"
                stroke="currentColor"
              >
                <path d="M2.586 17.414A2 2 0 0 0 2 18.828V21a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h1a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h.172a2 2 0 0 0 1.414-.586l.814-.814a6.5 6.5 0 1 0-4-4z"></path>
                <circle cx="16.5" cy="7.5" r=".5" fill="currentColor"></circle>
              </g>
            </svg>
            <input
              type="password"
              name="password"
              required
              placeholder="Password"
              pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
              title="Must be more than 8 characters, including number, lowercase letter, uppercase letter"
              onChange={handleInput}
            />
          </label>
          <p className="validator-hint hidden">
            Must be more than 8 characters, including
            <br />
            At least one number <br />
            At least one lowercase letter <br />
            At least one uppercase letter
          </p>
        </fieldset>
        <button
          disabled={
            formData.email === "" || formData.password === "" || loading
          }
          className="btn btn-primary w-full mt-4 disabled:opacity-70 disabled:cursor-not-allowed"
          type="submit"
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
      <div className="divider">OR</div>
      <div>
        <button
          onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
          className="btn bg-white text-black border-[#e5e5e5] w-full"
          type="button"
        >
          <svg
            aria-label="Google logo"
            width="16"
            height="16"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 512 512"
          >
            <g>
              <path d="m0 0H512V512H0" fill="#fff"></path>
              <path
                fill="#34a853"
                d="M153 292c30 82 118 95 171 60h62v48A192 192 0 0190 341"
              ></path>
              <path
                fill="#4285f4"
                d="m386 400a140 175 0 0053-179H260v74h102q-7 37-38 57"
              ></path>
              <path
                fill="#fbbc02"
                d="m90 341a208 200 0 010-171l63 49q-12 37 0 73"
              ></path>
              <path
                fill="#ea4335"
                d="m153 219c22-69 116-109 179-50l55-54c-78-75-230-72-297 55"
              ></path>
            </g>
          </svg>
          Login with Google
        </button>
        {error && <p className="text-red-500 mt-2">Login failed. Try again.</p>}
      </div>
      <div className="text-center mt-5">
        <p className="text-sm">
          Don't have an account? Signup <Link href="/auth/signup" className="text-blue-600">
            Here
          </Link>{" "}
        </p>
      </div>
    </div>
  );
}
