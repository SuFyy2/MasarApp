import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Camera, ArrowLeft, Award } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

// Helper function to get user-specific storage key
const getUserStorageKey = (key: string): string => {
  const currentUserEmail = localStorage.getItem('currentUserEmail');
  if (!currentUserEmail) return key; // Fallback
  return `${currentUserEmail}_${key}`;
};

// Default fallback data in case no state is passed
const defaultStampData = {
  emirateId: 'dubai',
  locationId: 2,
  name: 'Dubai Mall',
  emirateName: 'Dubai',
  description: 'Home to over 1,200 retail outlets and 200 food & beverage outlets, Dubai Mall is one of the world\'s largest shopping destinations.',
  icon: '🛍️',
  points: 50
};

// Function to create confetti elements
const createConfetti = (container: HTMLDivElement) => {
  const confettiCount = 100;
  const colors = ['#0D9B8A', '#E1B14C', '#F9F5E7', '#A8E0D1'];
  
  for (let i = 0; i < confettiCount; i++) {
    const confetti = document.createElement('div');
    confetti.className = 'confetti animate-confetti';
    confetti.style.left = `${Math.random() * 100}vw`;
    confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    confetti.style.animationDuration = `${Math.random() * 3 + 2}s`;
    confetti.style.animationDelay = `${Math.random() * 2}s`;
    container.appendChild(confetti);
  }
};

const StampEarnedScreen = () => {
  const [showAddMemory, setShowAddMemory] = useState(false);
  const [note, setNote] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const isDemoUser = localStorage.getItem('userName') === 'Demo User';
  
  // Get stamp data from location state or use default
  const [stampData, setStampData] = useState(defaultStampData);
  
  useEffect(() => {
    // If we have state data from the scanner, use it
    if (location.state?.stampData) {
      const enrichedData = {
        ...location.state.stampData
      };
      
      // Add missing fields if not present
      if (!enrichedData.emirateName) {
        enrichedData.emirateName = getEmirateName(enrichedData.emirateId);
      }
      
      if (!enrichedData.description) {
        enrichedData.description = getLocationDescription(enrichedData.emirateId, enrichedData.locationId);
      }
      
      if (!enrichedData.icon) {
        enrichedData.icon = getLocationIcon(enrichedData.locationId);
      }
      
      setStampData(enrichedData);
    }
  }, [location.state]);
  
  // Reference for confetti container
  const confettiContainerRef = React.useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    // Create confetti when component mounts
    if (confettiContainerRef.current) {
      createConfetti(confettiContainerRef.current);
    }
    
    // Clean up confetti when component unmounts
    return () => {
      if (confettiContainerRef.current) {
        confettiContainerRef.current.innerHTML = '';
      }
    };
  }, []);
  
  // Helper functions to get emirate name, location description and icon
  const getEmirateName = (emirateId: string): string => {
    const emirateNames = {
      'dubai': 'Dubai',
      'abu-dhabi': 'Abu Dhabi',
      'sharjah': 'Sharjah',
      'ajman': 'Ajman',
      'umm-al-quwain': 'Umm Al Quwain',
      'fujairah': 'Fujairah',
      'ras-al-khaimah': 'Ras Al Khaimah'
    };
    
    return emirateNames[emirateId] || emirateId;
  };
  
  const getLocationDescription = (emirateId: string, locationId: number): string => {
    // Default descriptions for popular locations
    if (emirateId === 'dubai') {
      if (locationId === 1) {
        return 'At 828 meters tall, Burj Khalifa is the world\'s tallest building and a global icon.';
      } else if (locationId === 2) {
        return 'Home to over 1,200 retail outlets and 200 food & beverage outlets, Dubai Mall is one of the world\'s largest shopping destinations.';
      }
    } else if (emirateId === 'abu-dhabi') {
      if (locationId === 1) {
        return 'Sheikh Zayed Grand Mosque is one of the world\'s largest mosques and an architectural masterpiece.';
      }
    }
    
    return 'A fascinating destination in the UAE with rich culture and heritage.';
  };
  
  const getLocationIcon = (locationId: number): string => {
    // Simple map of icons for common locations
    const icons = ['🏢', '🛍️', '🏝️', '🏞️', '🌴', '🕌', '🏰', '⛰️', '🏛️', '⛲'];
    return icons[locationId % icons.length];
  };
  
  const handleViewPassport = () => {
    // Navigate to specific emirate in passport if we have the ID
    if (stampData && stampData.emirateId) {
      navigate(`/passport/${stampData.emirateId}`);
    } else {
      navigate('/passport');
    }
  };
  
  const handleAddMemory = () => {
    setShowAddMemory(true);
  };
  
  const handleSaveMemory = () => {
    // In a real app, we would save the memory to the database
    // For now, just show a success toast
    toast({
      title: "Memory Saved",
      description: "Your memory has been added to your collection"
    });
    
    setShowAddMemory(false);
    
    // Navigate to the specific emirate page in passport
    if (stampData && stampData.emirateId) {
      navigate(`/passport/${stampData.emirateId}`);
    } else {
      navigate('/passport');
    }
  };

  return (
    <div className="min-h-screen bg-masar-cream flex flex-col">
      {/* Confetti container */}
      <div ref={confettiContainerRef} className="confetti-container" />
      
      {!showAddMemory ? (
        <>
          <div className="flex-1 flex flex-col items-center justify-center p-6">
            <div className="w-32 h-32 bg-masar-teal rounded-full flex items-center justify-center mb-6 animate-bounce">
              <span className="text-white text-5xl">✓</span>
            </div>
            
            <h1 className="text-2xl font-bold text-masar-teal text-center mb-3 animate-fade-in">
              You earned a new explorer stamp!
            </h1>
            
            {/* Display points earned */}
            {stampData.points && !isDemoUser && (
              <div className="bg-masar-gold/20 rounded-full px-4 py-2 flex items-center mb-4 animate-fade-in">
                <Award className="w-5 h-5 text-masar-gold mr-2" />
                <span className="text-masar-blue font-bold">+{stampData.points} Points!</span>
              </div>
            )}
            
            <p className="text-center text-masar-teal/80 mb-8 animate-fade-in">
              Congratulations on visiting {stampData.name}! This stamp has been added to your digital passport.
            </p>
            
            <div className="w-full max-w-sm bg-white rounded-xl p-5 shadow-md mb-8 animate-zoom-in">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-bold text-masar-teal">{stampData.name}</h3>
                  <p className="text-sm text-masar-teal/70">{stampData.emirateName || getEmirateName(stampData.emirateId)}</p>
                </div>
                <div className="w-16 h-16 bg-masar-gold/20 rounded-full flex items-center justify-center">
                  <span className="text-masar-gold text-xl">{stampData.icon || '🏢'}</span>
                </div>
              </div>
              
              <div className="text-sm text-masar-teal/80">
                <p>{stampData.description || getLocationDescription(stampData.emirateId, stampData.locationId)}</p>
              </div>
            </div>
          </div>
          
          <div className="p-6 space-y-3">
            <Button 
              onClick={handleAddMemory}
              className="w-full bg-masar-teal hover:bg-masar-teal/90 text-white py-6 h-auto"
            >
              <Camera className="mr-2 h-5 w-5" /> Add Photo & Memory
            </Button>
            
            <Button 
              variant="outline"
              onClick={handleViewPassport}
              className="w-full border-masar-teal text-masar-teal py-6 h-auto"
            >
              View in Passport
            </Button>
          </div>
        </>
      ) : (
        <>
          <div className="bg-masar-gold text-white p-4">
            <div className="flex items-center">
              <Button 
                variant="ghost" 
                className="text-white p-2 h-auto" 
                onClick={() => setShowAddMemory(false)}
              >
                <ArrowLeft className="w-6 h-6" />
              </Button>
              <h1 className="text-xl font-bold ml-2">Add Memory</h1>
            </div>
          </div>
          
          <div className="flex-1 p-6">
            <div className="mb-6">
              <h2 className="text-lg font-medium text-masar-teal mb-2">Add Photo</h2>
              <div className="bg-gray-100 rounded-lg aspect-video flex items-center justify-center border-2 border-dashed border-masar-teal/30">
                <div className="text-center">
                  <Camera className="w-12 h-12 text-masar-teal/50 mx-auto mb-2" />
                  <p className="text-masar-teal/70">Tap to add photo</p>
                </div>
              </div>
            </div>
            
            <div className="mb-6">
              <h2 className="text-lg font-medium text-masar-teal mb-2">Add Note</h2>
              <textarea 
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Write your memory here..."
                className="w-full h-32 p-3 rounded-lg border-2 border-masar-mint focus:border-masar-teal outline-none"
              />
            </div>
            
            <Button 
              onClick={handleSaveMemory}
              className="w-full bg-masar-teal hover:bg-masar-teal/90 text-white py-4 h-auto"
            >
              Save Memory
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default StampEarnedScreen;
