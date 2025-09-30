"use client";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";

type SignupPayload = {
  email: string;
  password: string;
};

async function signup(payload: SignupPayload) {
  const res = await fetch("http://localhost:3000/api/signup", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    throw new Error("Signup failed");
  }

  return res.json();
}

export default function SignUpForm() {
  const router = useRouter();
  const [formData, setFormData] = useState<SignupPayload>({
    email: "",
    password: "",
  });

  const signupMutation = useMutation({
    mutationFn: signup,
    onSuccess: () => {
      router.push("/dashboard");
    },
    onError: (error) => {
      console.error(error);
    },
  });

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    signupMutation.mutate(formData);
  };

  const loading = signupMutation.isPending;

  return (
    <div>
      <h1 className="text-center text-3xl">Sign Up</h1>
      <form onSubmit={handleSubmit} className="m-auto mt-6 max-w-md">
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
          className="btn btn-primary w-full mt-4"
          type="submit"
        >
          {loading ? "Signing up..." : "Sign Up"}
        </button>
      </form>
      <div className="divider">OR</div>
      <div>
        <button className="btn bg-white text-black border-[#e5e5e5] w-full">
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
          Signup with Google
        </button>
        {signupMutation.isError && (
          <p className="text-red-500 mt-2">Signup failed. Try again.</p>
        )}
      </div>
    </div>
  );
}
