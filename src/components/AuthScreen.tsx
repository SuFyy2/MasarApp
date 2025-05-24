
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from '@/hooks/use-toast';

// Helper function to get user-specific storage key
const getUserStorageKey = (key: string, userEmail: string): string => {
  return `${userEmail}_${key}`;
};

const AuthScreen = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const navigate = useNavigate();
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Simple validation
    if (!email || !password || (!isLogin && !name)) {
      toast({
        title: "Please fill in all fields",
        variant: "destructive"
      });
      return;
    }

    if (isLogin) {
      // Check if this user has signed up before
      const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
      const foundUser = registeredUsers.find((user: any) => user.email === email);
      
      if (!foundUser) {
        toast({
          title: "Account not found",
          description: "Please sign up first",
          variant: "destructive"
        });
        return;
      }
      
      // User exists, proceed with login and set the userName from the stored user data
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('currentUserEmail', email);
      localStorage.setItem('userName', foundUser.name); // Set the username from the found user
      
      toast({
        title: "Login successful!",
        description: "Welcome back to Masar"
      });
      
      navigate('/home');
    } else {
      // This is a sign up
      const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
      const userExists = registeredUsers.some((user: any) => user.email === email);
      
      if (userExists) {
        toast({
          title: "Email already registered",
          description: "Please log in instead",
          variant: "destructive"
        });
        return;
      }
      
      // Register the new user
      const now = new Date();
      const registeredAt = now.toISOString();
      const joinDate = `${now.toLocaleString('default', { month: 'long' })} ${now.getFullYear()}`;
      
      registeredUsers.push({
        email,
        name,
        password, // Note: In a real app, never store passwords in plaintext
        registeredAt
      });
      
      localStorage.setItem('registeredUsers', JSON.stringify(registeredUsers));
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('currentUserEmail', email);
      localStorage.setItem('userName', name);
      
      // Initialize user join date
      localStorage.setItem(getUserStorageKey('userJoinDate', email), joinDate);
      
      toast({
        title: "Account created!",
        description: "Welcome to Masar"
      });
      
      navigate('/home');
    }
  };

  return <div className="min-h-screen flex flex-col bg-masar-cream">
      <div className="flex-1 flex flex-col justify-center items-center px-8 pt-8">
        <div className="mb-8 animate-fade-in">
          <img alt="Masar Logo" className="w-40 h-auto" src="/lovable-uploads/e30f278e-11ed-4334-a4ec-e8f6bc9f837e.png" />
        </div>
        
        <div className="w-full max-w-md">
          <h1 className="text-2xl font-bold mb-6 text-center text-masar-blue">
            {isLogin ? 'Welcome Back!' : 'Create Account'}
          </h1>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && <div>
                <Input type="text" placeholder="Your Name" value={name} onChange={e => setName(e.target.value)} className="bg-white border-masar-mint focus:border-masar-teal rounded-xl py-6 text-black placeholder:text-gray-500" />
              </div>}
            
            <div>
              <Input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} className="bg-white border-masar-mint focus:border-masar-teal rounded-xl py-6 text-black placeholder:text-gray-500" />
            </div>
            
            <div>
              <Input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} className="bg-white border-masar-mint focus:border-masar-teal rounded-xl py-6 text-black placeholder:text-gray-500" />
            </div>
            
            <Button type="submit" className="w-full bg-masar-teal hover:bg-masar-teal/90 text-white rounded-xl py-6 h-auto font-medium text-lg">
              {isLogin ? 'Log In' : 'Sign Up'}
            </Button>
          </form>
          
          <div className="mt-6 text-center">
            <Button variant="link" onClick={() => setIsLogin(!isLogin)} className="text-masar-teal hover:text-masar-teal/80">
              {isLogin ? "Don't have an account? Sign up" : "Already have an account? Log in"}
            </Button>
          </div>

          <div className="mt-4 text-center">
            <Button variant="link" onClick={() => {
            // For demo purposes, skip login
            localStorage.setItem('isAuthenticated', 'true');
            localStorage.setItem('userName', 'Demo User');
            
            // Reset progress tracking for demo user
            localStorage.removeItem('hasViewedHomeScreen');
            localStorage.removeItem('hasViewedProfileBefore');
            
            toast({
              title: "Welcome, Demo User!",
              description: "You're using a demo account with no progress"
            });
            
            navigate('/home');
          }} className="text-masar-gold hover:text-masar-gold/80">
              Continue as Demo User
            </Button>
          </div>
        </div>
      </div>
      
      <div className="bg-masar-teal h-1/4 rounded-t-3xl mt-8 flex items-center justify-center">
        <div className="max-w-xs text-center px-8">
          <h3 className="text-white text-lg font-medium mb-2">Ready for adventure?</h3>
          <p className="text-masar-mint text-sm">
            Join Masar and start collecting stamps across the Emirates
          </p>
        </div>
      </div>
    </div>;
};
export default AuthScreen;
