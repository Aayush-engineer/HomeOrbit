"use client";
import { useClerk, useSignUp } from "@clerk/nextjs";
import { clerkClient, currentUser } from "@clerk/nextjs/server";
import { useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";

export default function VerifyEmailPage() {
  const { signUp, setActive, isLoaded } = useSignUp();
  const router = useRouter();
  const params = useSearchParams();
  const role = params.get("role") || "tenant";
  const { signOut } = useClerk();
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const signUpId = params.get("studentId");
  const handleVerify = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!isLoaded || loading) return;

  setLoading(true);
  setError("");

  try {
    

    if (!signUpId) {
      setError("Signup session expired. Please sign up again.");
      router.push("/signup");
      return;
    }

    const completeSignUp = await signUp.attemptEmailAddressVerification({
      code: code.trim(),
    });
    
    if (completeSignUp.status !== "complete") {
      throw new Error("Email verification incomplete.");
    }
    
   
    
    await setActive({ session: completeSignUp.createdSessionId });
    
    router.push("/");
  } catch (err: any) {
    console.error("Verification Error:", err);
    setError(err.errors?.[0]?.message || err.message || "Verification failed");
  } finally {
    setLoading(false);
  }
};

  return (
    <form onSubmit={handleVerify} className="space-y-4 p-6 max-w-md mx-auto">
      <h2 className="text-xl font-bold">Verify Your Email</h2>

      <input
        type="text"
        placeholder="Verification Code"
        value={code}
        onChange={(e) => setCode(e.target.value)}
        required
        className="border px-3 py-2 w-full rounded"
      />

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded disabled:opacity-50"
      >
        {loading ? "Verifying..." : "Verify Email"}
      </button>
    </form>
  );
}
