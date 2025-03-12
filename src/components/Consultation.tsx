import React, { useState } from 'react';
import { ClipboardCheck, AlertCircle, Salad, Activity, Eye, EyeOff } from 'lucide-react';
import { supabase } from '../lib/supabase';
import zxcvbn from 'zxcvbn';
import ExerciseCard from './ExerciseCard';
import { motion } from 'framer-motion';

const Consultation = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup' | 'forgot'>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loginData, setLoginData] = useState({
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    age: '',
    weight: '',
    height: '',
    menstrualCycle: '',
    periodRegular: false,
    acne: false,
    hairGrowth: false,
    weightGain: false,
    hairLoss: false,
    skinDarkening: false,
    acanthosisNigricans: false,
    pelvicPain: false,
    difficulty_conceiving: false,
    insulin_resistance: false
  });

  const getPasswordStrength = (password: string) => {
    const result = zxcvbn(password);
    return {
      score: result.score,
      feedback: result.feedback.warning || result.feedback.suggestions[0] || ''
    };
  };

  const getPasswordStrengthColor = (score: number) => {
    switch (score) {
      case 0: return 'bg-red-500';
      case 1: return 'bg-orange-500';
      case 2: return 'bg-yellow-500';
      case 3: return 'bg-blue-500';
      case 4: return 'bg-green-500';
      default: return 'bg-gray-200';
    }
  };

  const PasswordStrengthIndicator = ({ password }: { password: string }) => {
    const { score, feedback } = getPasswordStrength(password);
    return (
      <div className="mt-1">
        <div className="flex gap-1 mb-1">
          {[0, 1, 2, 3, 4].map((index) => (
            <div
              key={index}
              className={`h-1 w-full rounded-full ${
                index <= score ? getPasswordStrengthColor(score) : 'bg-gray-200'
              }`}
            />
          ))}
        </div>
        {password && (
          <p className="text-xs text-gray-600">
            {feedback || (score > 2 ? 'Strong password' : 'Password is too weak')}
          </p>
        )}
      </div>
    );
  };

  const resetMessages = () => {
    setError(null);
    setSuccess(null);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    resetMessages();
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: loginData.email,
        password: loginData.password
      });

      if (error) throw error;
      if (data.user) {
        setIsLoggedIn(true);
      }
    } catch (error: any) {
      setError("Invalid email or password");
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    resetMessages();
    
    if (loginData.password !== loginData.confirmPassword) {
      setError("Passwords don't match");
      return;
    }

    const { score } = getPasswordStrength(loginData.password);
    if (score < 3) {
      setError("Please choose a stronger password");
      return;
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email: loginData.email,
        password: loginData.password,
        options: {
          emailRedirectTo: window.location.origin
        }
      });

      if (error) throw error;
      if (data.user) {
        setSuccess('Account created successfully! You can now log in.');
        setAuthMode('login');
        setLoginData({ email: '', password: '', confirmPassword: '' });
      }
    } catch (error: any) {
      setError(error.message);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    resetMessages();
    
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(loginData.email, {
        redirectTo: window.location.origin + '/reset-password',
      });

      if (error) throw error;
      setSuccess('Password reset instructions sent to your email');
      setAuthMode('login');
      setLoginData({ email: '', password: '', confirmPassword: '' });
    } catch (error: any) {
      setError(error.message);
    }
  };

  const calculateBMI = () => {
    const heightInMeters = Number(formData.height) / 100;
    const weightInKg = Number(formData.weight);
    return (weightInKg / (heightInMeters * heightInMeters)).toFixed(1);
  };

  const analyzePCOSRisk = () => {
    let riskFactors = 0;
    
    if (!formData.periodRegular || Number(formData.menstrualCycle) > 35) riskFactors++;
    if (formData.acne) riskFactors++;
    if (formData.hairGrowth) riskFactors++;
    if (formData.hairLoss) riskFactors++;
    if (calculateBMI() > 25) riskFactors++;
    if (formData.insulin_resistance) riskFactors++;
    if (formData.skinDarkening || formData.acanthosisNigricans) riskFactors++;
    if (formData.difficulty_conceiving) riskFactors++;
    if (formData.pelvicPain) riskFactors++;

    return {
      riskLevel: riskFactors >= 3 ? 'High' : riskFactors >= 2 ? 'Moderate' : 'Low',
      riskFactors
    };
  };

  const DietRecommendations = () => (
    <div className="p-4 bg-green-50 rounded-lg">
      <div className="flex items-center mb-4">
        <Salad className="h-6 w-6 text-green-600 mr-2" />
        <h3 className="text-lg font-semibold">Recommended Diet Plan</h3>
      </div>
      <div className="space-y-4">
        <div>
          <h4 className="font-medium mb-2">Foods to Include:</h4>
          <ul className="list-disc list-inside text-gray-700 space-y-1">
            <li>High-fiber vegetables (broccoli, cauliflower, Brussels sprouts)</li>
            <li>Lean proteins (chicken, fish, tofu)</li>
            <li>Anti-inflammatory foods (berries, leafy greens, nuts)</li>
            <li>Healthy fats (avocados, olive oil, nuts)</li>
            <li>Low glycemic index fruits</li>
          </ul>
        </div>
        <div>
          <h4 className="font-medium mb-2">Foods to Limit:</h4>
          <ul className="list-disc list-inside text-gray-700 space-y-1">
            <li>Refined carbohydrates</li>
            <li>Sugary beverages</li>
            <li>Processed foods</li>
            <li>Excessive dairy products</li>
            <li>Foods high in saturated fats</li>
          </ul>
        </div>
      </div>
    </div>
  );

  const LifestyleRecommendations = () => (
    <div className="p-4 bg-blue-50 rounded-lg">
      <div className="flex items-center mb-4">
        <Activity className="h-6 w-6 text-blue-600 mr-2" />
        <h3 className="text-lg font-semibold">Lifestyle Changes</h3>
      </div>
      <div className="space-y-8">
        <div>
          <h4 className="font-medium mb-4">Exercise Recommendations:</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ExerciseCard
              title="Morning Yoga"
              description="Start your day with gentle stretching and yoga poses to improve flexibility and reduce stress."
              imageUrl="https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80"
              duration="30 mins"
              intensity="Low"
            />
            <ExerciseCard
              title="Cardio Walking"
              description="Take a brisk walk after meals to help regulate blood sugar levels and improve cardiovascular health."
              imageUrl="https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80"
              duration="20 mins"
              intensity="Moderate"
            />
            <ExerciseCard
              title="Strength Training"
              description="Build muscle and improve insulin sensitivity with bodyweight exercises or light weights."
              imageUrl="https://images.unsplash.com/photo-1534258936925-c58bed479fcb?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80"
              duration="45 mins"
              intensity="High"
            />
            <ExerciseCard
              title="Swimming"
              description="Low-impact cardio that's gentle on your joints while providing a full-body workout."
              imageUrl="https://images.unsplash.com/photo-1530549387789-4c1017266635?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80"
              duration="40 mins"
              intensity="Moderate"
            />
          </div>
        </div>
        
        <div>
          <h4 className="font-medium mb-2">Stress Management:</h4>
          <ul className="list-disc list-inside text-gray-700 space-y-1">
            <li>Practice meditation or deep breathing exercises</li>
            <li>Maintain a regular sleep schedule</li>
            <li>Join support groups</li>
            <li>Consider counseling if needed</li>
          </ul>
        </div>

        <div>
          <h4 className="font-medium mb-2">Daily Habits:</h4>
          <ul className="list-disc list-inside text-gray-700 space-y-1">
            <li>Track menstrual cycles</li>
            <li>Monitor blood sugar levels</li>
            <li>Keep a symptom diary</li>
            <li>Stay hydrated (8-10 glasses of water daily)</li>
          </ul>
        </div>
      </div>
    </div>
  );

  const AuthForm = () => {
    const titles = {
      login: 'Login to Continue',
      signup: 'Create an Account',
      forgot: 'Reset Password'
    };

    return (
      <div className="max-w-md mx-auto mt-16 p-6 bg-white rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-center mb-8">{titles[authMode]}</h2>
        
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
            {error}
          </div>
        )}
        
        {success && (
          <div className="mb-4 p-3 bg-green-100 text-green-700 rounded">
            {success}
          </div>
        )}

        <form className="space-y-4" onSubmit={
          authMode === 'login' ? handleLogin :
          authMode === 'signup' ? handleSignUp :
          handleForgotPassword
        }>
          <div>
            <label className="block text-gray-700 mb-2">Email</label>
            <input
              type="email"
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Enter your email"
              value={loginData.email}
              onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
              required
            />
          </div>

          {authMode !== 'forgot' && (
            <div>
              <label className="block text-gray-700 mb-2">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 pr-10"
                  placeholder="Enter your password"
                  value={loginData.password}
                  onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                  required
                />
                <button
                  type="button"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {authMode === 'signup' && <PasswordStrengthIndicator password={loginData.password} />}
            </div>
          )}

          {authMode === 'signup' && (
            <div>
              <label className="block text-gray-700 mb-2">Confirm Password</label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 pr-10"
                  placeholder="Confirm your password"
                  value={loginData.confirmPassword}
                  onChange={(e) => setLoginData({ ...loginData, confirmPassword: e.target.value })}
                  required
                />
                <button
                  type="button"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-purple-600 text-white py-2 rounded-md hover:bg-purple-700 transition-colors"
          >
            {authMode === 'login' ? 'Login' : 
             authMode === 'signup' ? 'Sign Up' : 
             'Send Reset Instructions'}
          </button>

          <div className="flex flex-col space-y-2 text-sm text-center">
            {authMode === 'login' && (
              <>
                <button
                  type="button"
                  onClick={() => {
                    resetMessages();
                    setAuthMode('signup');
                  }}
                  className="text-purple-600 hover:text-purple-800"
                >
                  Don't have an account? Sign up
                </button>
                <button
                  type="button"
                  onClick={() => {
                    resetMessages();
                    setAuthMode('forgot');
                  }}
                  className="text-purple-600 hover:text-purple-800"
                >
                  Forgot password?
                </button>
              </>
            )}
            {(authMode === 'signup' || authMode === 'forgot') && (
              <button
                type="button"
                onClick={() => {
                  resetMessages();
                  setAuthMode('login');
                }}
                className="text-purple-600 hover:text-purple-800"
              >
                Back to login
              </button>
            )}
          </div>
        </form>
      </div>
    );
  };

  if (!isLoggedIn) {
    return <AuthForm />;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowResults(true);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <div className="bg-white rounded-lg shadow-lg p-8">
        {!showResults ? (
          <>
            <div className="flex items-center mb-6">
              <ClipboardCheck className="h-8 w-8 text-purple-600 mr-3" />
              <h2 className="text-2xl font-semibold">PCOS Assessment Form</h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-700 mb-2">Age</label>
                  <input
                    type="number"
                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    value={formData.age}
                    onChange={(e) => setFormData({...formData, age: e.target.value})}
                    placeholder="Years"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-700 mb-2">Weight</label>
                  <input
                    type="number"
                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    value={formData.weight}
                    onChange={(e) => setFormData({...formData, weight: e.target.value})}
                    placeholder="kg"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-700 mb-2">Height</label>
                  <input
                    type="number"
                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    value={formData.height}
                    onChange={(e) => setFormData({...formData, height: e.target.value})}
                    placeholder="cm"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-700 mb-2">Menstrual Cycle Length</label>
                  <input
                    type="number"
                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    value={formData.menstrualCycle}
                    onChange={(e) => setFormData({...formData, menstrualCycle: e.target.value})}
                    placeholder="Days"
                    required
                  />
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Symptoms & Health History</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <label className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={formData.periodRegular}
                      onChange={(e) => setFormData({...formData, periodRegular: e.target.checked})}
                      className="form-checkbox h-5 w-5 text-purple-600"
                    />
                    <span>Regular Periods</span>
                  </label>

                  <label className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={formData.acne}
                      onChange={(e) => setFormData({...formData, acne: e.target.checked})}
                      className="form-checkbox h-5 w-5 text-purple-600"
                    />
                    <span>Acne</span>
                  </label>

                  <label className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={formData.hairGrowth}
                      onChange={(e) => setFormData({...formData, hairGrowth: e.target.checked})}
                      className="form-checkbox h-5 w-5 text-purple-600"
                    />
                    <span>Excess Hair Growth</span>
                  </label>

                  <label className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={formData.hairLoss}
                      onChange={(e) => setFormData({...formData, hairLoss: e.target.checked})}
                      className="form-checkbox h-5 w-5 text-purple-600"
                    />
                    <span>Hair Loss</span>
                  </label>

                  <label className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={formData.skinDarkening}
                      onChange={(e) => setFormData({...formData, skinDarkening: e.target.checked})}
                      className="form-checkbox h-5 w-5 text-purple-600"
                    />
                    <span>Skin Darkening</span>
                  </label>

                  <label className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={formData.weightGain}
                      onChange={(e) => setFormData({...formData, weightGain: e.target.checked})}
                      className="form-checkbox h-5 w-5 text-purple-600"
                    />
                    <span>Unexplained Weight Gain</span>
                  </label>

                  <label className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={formData.pelvicPain}
                      onChange={(e) => setFormData({...formData, pelvicPain: e.target.checked})}
                      className="form-checkbox h-5 w-5 text-purple-600"
                    />
                    <span>Pelvic Pain</span>
                  </label>

                  <label className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={formData.difficulty_conceiving}
                      onChange={(e) => setFormData({...formData, difficulty_conceiving: e.target.checked})}
                      className="form-checkbox h-5 w-5 text-purple-600"
                    />
                    <span>Difficulty Conceiving</span>
                  </label>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-purple-600 text-white py-3 rounded-md hover:bg-purple-700 transition-colors"
              >
                Submit Assessment
              </button>
            </form>
          </>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center mb-6">
              <AlertCircle className="h-8 w-8 text-purple-600 mr-3" />
              <h2 className="text-2xl font-semibold">Assessment Results</h2>
            </div>

            <div className="space-y-4">
              <div className="p-4 bg-purple-50 rounded-lg">
                <h3 className="text-lg font-semibold mb-2">BMI Calculation</h3>
                <p>Your BMI: {calculateBMI()}</p>
                <p className="text-sm text-gray-600 mt-1">
                  BMI Categories: Underweight (≤18.5) | Normal (18.5-24.9) | Overweight (25-29.9) | Obese (≥30)
                </p>
              </div>

              <div className="p-4 bg-purple-50 rounded-lg">
                <h3 className="text-lg font-semibold mb-2">PCOS Risk Assessment</h3>
                <p className="mb-2">Risk Level: <span className="font-semibold">{analyzePCOSRisk().riskLevel}</span></p>
                <p className="text-sm text-gray-600">
                  This is not a diagnosis. Please consult with a healthcare provider for proper evaluation and diagnosis.
                </p>
              </div>

              {analyzePCOSRisk().riskLevel !== 'Low' && (
                <>
                  <DietRecommendations />
                  <LifestyleRecommendations />
                </>
              )}

              <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                <h3 className="text-lg font-semibold mb-2">Next Steps</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li>Schedule an appointment with a healthcare provider for proper evaluation</li>
                  <li>Keep track of your menstrual cycles</li>
                  <li>Maintain a healthy lifestyle with regular exercise and balanced diet</li>
                  <li>Consider getting hormonal blood tests as recommended by your doctor</li>
                </ul>
              </div>

              <button
                onClick={() => setShowResults(false)}
                className="w-full bg-purple-600 text-white py-3 rounded-md hover:bg-purple-700 transition-colors"
              >
                Start New Assessment
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Consultation;