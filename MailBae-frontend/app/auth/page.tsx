'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Mail, Eye, EyeOff, TriangleAlert, CheckCircle, XCircle } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    username: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const validations = [
    { label: "At least 8 characters", valid: password.length >= 8 },
    { label: "A lowercase letter (a-z)", valid: /[a-z]/.test(password) },
    { label: "An uppercase letter (A-Z)", valid: /[A-Z]/.test(password) },
    { label: "A number (0-9)", valid: /\d/.test(password) },
    { label: "A symbol (!@#$)", valid: /[^A-Za-z0-9]/.test(password) },
  ];

  const isPasswordStrong = (password: string): boolean => {
    return (
      password.length >= 8 &&
      /[a-z]/.test(password) &&
      /[A-Z]/.test(password) &&
      /\d/.test(password) &&
      /[^A-Za-z0-9]/.test(password)
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

      if (isLogin) {
        // Login logic
        const { error } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: password,
        });

        if (error) throw error;
      } else {
        // 1. Check if username is taken
        const { data: existingUser, error: checkError } = await supabase
          .from('dashboard_metrics')
          .select('username')
          .eq('username', formData.username);

        if (checkError) throw checkError;

        if (existingUser && existingUser.length > 0) {
          toast.error('Username already taken! Please choose another.');
          setIsLoading(false);
          return;
        }

        // 2. Sign up the user
        if (!isPasswordStrong(password)) {
          toast.error("Password must be atleast 8 characters and include uppercase, lowercase, number, symbol")
          return;
        }

        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
          email: formData.email,
          password: password,
          options: {
            data: { username: formData.username, timezone: timezone, since_hour: 9 },
          },
        });

        if (signUpError) throw signUpError;

        // 3. Insert dashboard_metrics row for the new user
        const { error: insertError } = await supabase.from('dashboard_metrics').insert([
          {
            username: formData.username,
            emails_processed: 0,
            summaries_generated: 0,
            time_saved: 0,
            auto_replies: 0,
          },
        ]);

        if (insertError) {
          console.error('Error inserting metrics row:', insertError);
          toast.error('Signup successful, but there was a problem setting up your dashboard.');
        }
      }

      // ✅ Redirect to dashboard
      router.push('/welcome');
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };



  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50/30 to-white flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Mail className="w-10 h-10 text-blue-500" />
            <span className="text-3xl font-bold text-gray-900">MailBae</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900">
            {isLogin ? 'Welcome back' : 'Create your account'}
          </h2>
          <p className="text-gray-600 mt-2">
            {isLogin
              ? 'Sign in to your MailBae account'
              : 'Start managing your emails smarter'
            }
          </p>
        </div>

        {/* Auth Form */}
        <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Username field (signup only) */}
            {!isLogin && (
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                  Username
                </label>
                <input
                  id="username"
                  name="username"
                  type="text"
                  required={!isLogin}
                  value={formData.username}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="Enter your username"
                />
              </div>
            )}

            {/* Email field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                placeholder="Enter your email"
              />
              {!isLogin && (
                <div className='flex items-center inline-block'>
                  <TriangleAlert color='red' />
                  <p className="text-gray-600 mt-2 ml-2 text-sm">Make sure to use the same email ID that you want to connect to MailBae.</p>
                </div>
              )}
            </div>

            {/* Password field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>

              {/* Password Checklist */}
              {!isLogin && password && (
                <ul className="space-y-1 text-sm">
                  {validations.map((item, index) => (
                    <li
                      key={index}
                      className={`flex items-center gap-2 ${item.valid ? "text-green-600" : "text-red-500"
                        }`}
                    >
                      {item.valid ? (
                        <CheckCircle className="w-4 h-4" />
                      ) : (
                        <XCircle className="w-4 h-4" />
                      )}
                      {item.label}
                    </li>
                  ))}
                </ul>)}
            </div>

            {/* Submit button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 px-4 rounded-xl font-semibold text-lg transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isLoading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Please wait...</span>
                </div>
              ) : (
                isLogin ? 'Sign In' : 'Create Account'
              )}
            </button>
          </form>

          {/* Toggle between login/signup */}
          <div className="mt-6 text-center">
            <p className="text-gray-600">
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <button
                type="button"
                onClick={() => setIsLogin(!isLogin)}
                className="text-blue-500 hover:text-blue-600 font-semibold transition-colors duration-200"
              >
                {isLogin ? 'Sign up' : 'Sign in'}
              </button>
            </p>
          </div>

          {/* Forgot password (login only) */}
          {isLogin && (
            <div className="mt-4 text-center">
              <button
                type="button"
                className="text-sm text-gray-500 hover:text-gray-700 transition-colors duration-200"
              >
                Forgot your password?
              </button>
            </div>
          )}
        </div>

        {/* Back to home */}
        <div className="text-center mt-6">
          <button
            onClick={() => router.push('/')}
            className="text-gray-500 hover:text-gray-700 text-sm transition-colors duration-200"
          >
            ← Back to home
          </button>
        </div>
      </div>
    </div>
  );
}