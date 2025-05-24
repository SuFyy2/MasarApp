import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, User, Map, Compass, Star, Edit, Save } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Progress } from "@/components/ui/progress";

const emitatesData = [{
  id: 'abu-dhabi',
  name: 'Abu Dhabi',
  collected: 2,
  total: 5
}, {
  id: 'dubai',
  name: 'Dubai',
  collected: 3,
  total: 5
}, {
  id: 'sharjah',
  name: 'Sharjah',
  collected: 0,
  total: 5
}, {
  id: 'ajman',
  name: 'Ajman',
  collected: 1,
  total: 5
}, {
  id: 'umm-al-quwain',
  name: 'Umm Al Quwain',
  collected: 0,
  total: 5
}, {
  id: 'fujairah',
  name: 'Fujairah',
  collected: 0,
  total: 5
}, {
  id: 'ras-al-khaimah',
  name: 'Ras Al Khaimah',
  collected: 0,
  total: 5
}];

// User profile default values
const defaultUserProfile = {
  fullName: '',
  email: '',
  bio: '',
  favoriteEmiratesPlace: '',
  hometown: ''
};

// Helper function to get user-specific storage key
const getUserStorageKey = (key: string): string => {
  const currentUserEmail = localStorage.getItem('currentUserEmail');
  if (!currentUserEmail) return key; // Fallback
  return `${currentUserEmail}_${key}`;
};

const ProfileScreen = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [userName, setUserName] = useState('Explorer');
  const [isNewOrDemoUser, setIsNewOrDemoUser] = useState(false);
  const [isDemoUser, setIsDemoUser] = useState(false);
  
  // Profile editing state
  const [isEditing, setIsEditing] = useState(false);
  const [userProfile, setUserProfile] = useState(defaultUserProfile);
  
  // Get stamps collected from localStorage or default to 0 for new/demo users
  const [stampsCollected, setStampsCollected] = useState({});
  
  // Add points state
  const [userPoints, setUserPoints] = useState(0);
  
  // Function to load stamps data from localStorage
  const loadStampsData = () => {
    if (isDemoUser || isNewOrDemoUser) {
      setStampsCollected({});
      return;
    }
    
    const storedStamps = localStorage.getItem(getUserStorageKey('collectedStamps'));
    if (storedStamps) {
      setStampsCollected(JSON.parse(storedStamps));
    } else {
      setStampsCollected({});
    }
  };
  
  // Function to load points data from localStorage
  const loadPointsData = () => {
    if (isDemoUser) {
      setUserPoints(0);
      return;
    }
    
    const storedPoints = localStorage.getItem(getUserStorageKey('userPoints'));
    setUserPoints(storedPoints ? parseInt(storedPoints) : 0);
  };
  
  useEffect(() => {
    // Get the current username from localStorage whenever component mounts
    const storedUserName = localStorage.getItem('userName');
    if (storedUserName) {
      setUserName(storedUserName);
      
      // Check if demo user
      if (storedUserName === 'Demo User') {
        setIsDemoUser(true);
        setIsNewOrDemoUser(true);
      } else {
        // Check if new user (first time viewing profile)
        const hasViewedProfileBefore = localStorage.getItem(getUserStorageKey('hasViewedProfileBefore'));
        if (!hasViewedProfileBefore) {
          localStorage.setItem(getUserStorageKey('hasViewedProfileBefore'), 'true');
          setIsNewOrDemoUser(true);
        }
      }
    }
    
    // Load saved profile data if it exists
    if (!isDemoUser) {
      const savedProfile = localStorage.getItem(getUserStorageKey('userProfile'));
      if (savedProfile) {
        setUserProfile(JSON.parse(savedProfile));
      } else {
        // Initialize with username if available
        setUserProfile({
          ...defaultUserProfile,
          fullName: storedUserName || 'Explorer'
        });
      }
    }
    
    // Load initial data
    loadStampsData();
    loadPointsData();
    
  }, [isDemoUser, isNewOrDemoUser]);

  useEffect(() => {
    // Add event listeners for real-time updates
    const handleStampsUpdate = () => {
      console.log('Stamps updated - reloading data');
      loadStampsData();
    };
    
    const handlePointsUpdate = () => {
      console.log('Points updated - reloading data');
      loadPointsData();
    };
    
    // Listen for custom events dispatched when stamps/points change
    window.addEventListener('stampsUpdated', handleStampsUpdate);
    window.addEventListener('pointsUpdated', handlePointsUpdate);
    
    return () => {
      window.removeEventListener('stampsUpdated', handleStampsUpdate);
      window.removeEventListener('pointsUpdated', handlePointsUpdate);
    };
  }, [isDemoUser, isNewOrDemoUser]);

  // Calculate collected stamps based on the stored data or use 0 for new/demo users
  const calculateEmiratesProgress = () => {
    if (isNewOrDemoUser || isDemoUser) {
      return emitatesData.map(emirate => ({
        ...emirate,
        collected: 0
      }));
    }
    
    // If we have stored stamps data, use it to calculate progress
    if (Object.keys(stampsCollected).length > 0) {
      return emitatesData.map(emirate => {
        const emirateStamps = stampsCollected[emirate.id] || [];
        return {
          ...emirate,
          collected: emirateStamps.length
        };
      });
    }
    
    // Otherwise use 0 for all
    return emitatesData.map(emirate => ({
      ...emirate,
      collected: 0
    }));
  };
  
  const emiratesWithProgress = calculateEmiratesProgress();
  
  // For new/demo users, show 0 collected stamps
  const totalCollected = isNewOrDemoUser || isDemoUser ? 0 : 
    emiratesWithProgress.reduce((sum, emirate) => sum + emirate.collected, 0);
  const totalStamps = emitatesData.reduce((sum, emirate) => sum + emirate.total, 0);
  
  const completionPercentage = isNewOrDemoUser || isDemoUser ? 0 : 
    totalCollected > 0 ? Math.round((totalCollected / totalStamps) * 100) : 0;

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userName');
    localStorage.removeItem('hasViewedHomeScreen');
    localStorage.removeItem(getUserStorageKey('hasViewedProfileBefore'));
    navigate('/login');
  };
  
  const handleLogin = () => {
    navigate('/login');
  };
  
  const toggleEditMode = () => {
    setIsEditing(!isEditing);
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setUserProfile(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const saveProfile = () => {
    // Don't save for demo users
    if (isDemoUser) {
      toast({
        title: "Demo Mode",
        description: "Profile changes aren't saved in demo mode. Please log in to save your profile.",
        variant: "destructive"
      });
      return;
    }
    
    // Save to localStorage with user-specific key
    localStorage.setItem(getUserStorageKey('userProfile'), JSON.stringify(userProfile));
    setIsEditing(false);
    
    toast({
      title: "Profile Updated",
      description: "Your profile information has been saved.",
    });
  };

  return (
    <div className="min-h-screen bg-masar-cream pb-20">
      {/* Header */}
      <div className="text-white p-4 bg-masar-blue">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Button variant="ghost" className="text-white p-2 h-auto" onClick={() => navigate(-1)}>
              <ArrowLeft className="w-6 h-6" />
            </Button>
            <h1 className="text-xl font-bold ml-2">My Profile</h1>
          </div>
          {/* Points Display */}
          {!isDemoUser && (
            <div className="flex items-center bg-masar-gold/20 rounded-full px-3 py-1">
              <Star className="w-4 h-4 text-masar-gold mr-1" />
              <span className="text-sm font-medium text-white">
                {userPoints} Points
              </span>
            </div>
          )}
        </div>
      </div>
      
      {/* Profile Info */}
      <div className="p-6">
        <div className="flex items-center mb-6">
          <div className="w-20 h-20 bg-masar-mint rounded-full flex items-center justify-center mr-4">
            <User className="w-10 h-10 text-masar-teal" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-masar-gold">{userName}</h2>
            <p className="text-masar-red">
              {completionPercentage}% Explorer
            </p>
          </div>
          
          {/* Edit button - only shown for logged in users */}
          {!isDemoUser && (
            <Button 
              variant="ghost" 
              onClick={toggleEditMode} 
              className="ml-auto p-2 h-auto"
            >
              {isEditing ? <Save className="w-5 h-5 text-masar-teal" /> : <Edit className="w-5 h-5 text-masar-teal" />}
            </Button>
          )}
        </div>
        
        {/* User Profile Fields */}
        <Card className="mb-6 p-4 bg-white shadow-sm">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input 
                id="fullName"
                name="fullName"
                value={userProfile.fullName}
                onChange={handleInputChange}
                disabled={!isEditing || isDemoUser}
                className={isEditing ? "bg-masar-cream/50" : "bg-transparent"}
                placeholder="Your full name"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email"
                name="email"
                type="email"
                value={userProfile.email}
                onChange={handleInputChange}
                disabled={!isEditing || isDemoUser}
                className={isEditing ? "bg-masar-cream/50" : "bg-transparent"}
                placeholder="Your email address"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="hometown">Hometown</Label>
              <Input 
                id="hometown"
                name="hometown"
                value={userProfile.hometown}
                onChange={handleInputChange}
                disabled={!isEditing || isDemoUser}
                className={isEditing ? "bg-masar-cream/50" : "bg-transparent"}
                placeholder="Where are you from?"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="favoriteEmiratesPlace">Favorite Place in UAE</Label>
              <Input 
                id="favoriteEmiratesPlace"
                name="favoriteEmiratesPlace"
                value={userProfile.favoriteEmiratesPlace}
                onChange={handleInputChange}
                disabled={!isEditing || isDemoUser}
                className={isEditing ? "bg-masar-cream/50" : "bg-transparent"}
                placeholder="Your favorite place in UAE"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea 
                id="bio"
                name="bio"
                value={userProfile.bio}
                onChange={handleInputChange}
                disabled={!isEditing || isDemoUser}
                className={isEditing ? "bg-masar-cream/50" : "bg-transparent"}
                placeholder="Tell us about yourself"
                rows={3}
              />
            </div>
            
            {/* Save button - only visible in edit mode and for logged in users */}
            {isEditing && !isDemoUser && (
              <Button 
                variant="default" 
                onClick={saveProfile}
                className="w-full bg-masar-teal hover:bg-masar-teal/90 mt-2"
              >
                Save Profile
              </Button>
            )}
          </div>
        </Card>
        
        {/* Stats Cards */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <Card className="p-4 bg-masar-mint/30">
            <div className="flex items-center mb-2">
              <Map className="w-5 h-5 text-masar-teal mr-2" />
              <h3 className="font-medium text-masar-teal">Total Stamps</h3>
            </div>
            <p className="text-2xl font-bold text-masar-teal">{totalCollected}/{totalStamps}</p>
          </Card>
          
          <Card className="p-4 bg-masar-gold/20">
            <div className="flex items-center mb-2">
              <Compass className="w-5 h-5 text-masar-gold mr-2" />
              <h3 className="font-medium text-masar-teal">Emirates</h3>
            </div>
            <p className="text-2xl font-bold text-masar-teal">
              {isNewOrDemoUser || isDemoUser ? 0 : emiratesWithProgress.filter(e => e.collected > 0).length}/{emitatesData.length}
            </p>
          </Card>
        </div>
        
        {/* Progress By Emirate */}
        <h3 className="text-lg font-bold mb-3 text-masar-gold">Progress by Emirate</h3>
        <div className="space-y-4 mb-8">
          {emiratesWithProgress.map(emirate => <div key={emirate.id} className="rounded-lg p-4 shadow-sm bg-masar-cream">
              <div className="flex justify-between items-center mb-2">
                <h4 className="font-medium text-masar-blue">{emirate.name}</h4>
                <span className="text-sm text-masar-gold">
                  {emirate.collected}/{emirate.total} stamps
                </span>
              </div>
              <Progress value={emirate.collected / emirate.total * 100} className="h-2" />
            </div>)}
        </div>
        
        {/* Show Login button for demo users, Logout button for regular users */}
        {isDemoUser ? (
          <Button variant="outline" onClick={handleLogin} className="w-full border-masar-teal text-masar-teal">
            Log In
          </Button>
        ) : (
          <Button variant="outline" onClick={handleLogout} className="w-full border-masar-teal text-masar-teal">
            Log Out
          </Button>
        )}
      </div>
      
      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4">
        <div className="flex justify-around">
          <Button variant="ghost" className="flex flex-col items-center text-gray-400" onClick={() => navigate('/home')}>
            <Map className="w-6 h-6" />
            <span className="text-xs mt-1">Explore</span>
          </Button>
          <Button variant="ghost" className="flex flex-col items-center text-gray-400" onClick={() => navigate('/scan')}>
            <div className="bg-gray-200 rounded-full p-3 -mt-8 border-4 border-white">
              <Compass className="w-6 h-6 text-gray-500" />
            </div>
            <span className="text-xs mt-1">Scan</span>
          </Button>
          <Button variant="ghost" className="flex flex-col items-center text-masar-teal">
            <User className="w-6 h-6" />
            <span className="text-xs mt-1">Profile</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProfileScreen;
