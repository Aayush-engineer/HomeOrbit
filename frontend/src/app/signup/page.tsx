'use client';

import { useEffect, useState } from 'react';
import { useClerk, useSignUp } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';

export default function CustomSignupPage() {
  const { isLoaded, signUp, setActive } = useSignUp();
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState<'manager' | 'tenant'>('tenant');
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
    
  

  const handleSignup = async (e: React.FormEvent) => {
    console.log("loaded",isLoaded);

    e.preventDefault();
    setError('');
    setIsSubmitting(true);
    
    if (!isLoaded) return;

    try {
      console.log("i am here");
      // 1. Create the user
      const signUpResponse = await signUp.create({
        emailAddress: email,
        password,
        username,
        unsafeMetadata: {
          role,
        },
      });

      console.log("passed this step");
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
      router.push(`/verify-email?studentId=${signUpResponse.id}&role=${role}`);
      
    } catch (err: any) {
      console.error('Signup error:', err);
      setError(err.errors?.[0]?.message || 'Something went wrong');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleSignUp = () => {
    if (!isLoaded) return;
    signUp.authenticateWithRedirect({ strategy: 'oauth_google' });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <form
        onSubmit={handleSignup}
        className="bg-white shadow-lg p-8 rounded w-full max-w-md space-y-4"
      >
        <h2 className="text-2xl font-bold text-center">Create Your Account</h2>

        <input
          type="text"
          value={username}
          required
          placeholder="Username"
          onChange={(e) => setUsername(e.target.value)}
          className="border px-3 py-2 w-full rounded"
        />

        <input
          type="email"
          value={email}
          required
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
          className="border px-3 py-2 w-full rounded"
        />

        <input
          type="password"
          value={password}
          required
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
          className="border px-3 py-2 w-full rounded"
        />

        <input
          type="tel"
          value={phone}
          placeholder="+91 9876543210 (Optional)"
          onChange={(e) => setPhone(e.target.value)}
          className="border px-3 py-2 w-full rounded"
        />

        <select
          value={role}
          onChange={(e) => setRole(e.target.value as 'manager' | 'tenant')}
          className="border px-3 py-2 w-full rounded"
        >
          <option value="tenant">Tenant</option>
          <option value="manager">Manager</option>
        </select>

        {error && <p className="text-red-500 text-sm">{error}</p>}
        <div id="clerk-captcha" />
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded"
        >
          {isSubmitting ? 'Signing Up...' : 'Sign Up'}
        </button>

        <div className="text-center text-sm text-gray-500">or</div>

        <button
          type="button"
          onClick={handleGoogleSignUp}
          className="w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded"
        >
          Sign up with Google
        </button>
      </form>
    </div>
  );
}
