import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { ArrowLeft, Camera, MapPin, ChevronRight, ChevronLeft, Lock } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// Define a consistent interface for location objects
interface Location {
  id: number;
  name: string;
  collected: boolean;
  collectedDate?: string;
  icon: string;
}

interface Emirate {
  id: string;
  name: string;
  image: string;
  locations: Location[];
}

// Helper function to get user-specific storage key
const getUserStorageKey = (key: string): string => {
  const currentUserEmail = localStorage.getItem('currentUserEmail');
  if (!currentUserEmail) return key; // Fallback
  return `${currentUserEmail}_${key}`;
};

const emitatesData: Emirate[] = [{
  id: 'abu-dhabi',
  name: 'Abu Dhabi',
  image: '/uploads/099f147b-9369-493d-998c-178a3529981f.jpg',
  locations: [{
    id: 1,
    name: 'Sheikh Zayed Mosque',
    collected: false,
    icon: '🕌'
  }, {
    id: 2,
    name: 'Louvre Abu Dhabi',
    collected: false,
    icon: '🖼️'
  }, {
    id: 3,
    name: 'Ferrari World',
    collected: false,
    icon: '🏎️'
  }, {
    id: 4,
    name: 'Yas Island',
    collected: false,
    icon: '🏝️'
  }, {
    id: 5,
    name: 'Qasr Al Watan',
    collected: false,
    icon: '🏛️'
  }]
}, {
  id: 'dubai',
  name: 'Dubai',
  image: '/uploads/6968950d-668c-4473-916a-a9c71594902e.jpg',
  locations: [{
    id: 1,
    name: 'Burj Khalifa',
    collected: false,
    icon: '🏢'
  }, {
    id: 2,
    name: 'Dubai Mall',
    collected: false,
    icon: '🛍️'
  }, {
    id: 3,
    name: 'Dubai Marina',
    collected: false,
    icon: '🛥️'
  }, {
    id: 4,
    name: 'Dubai Creek',
    collected: false,
    icon: '🏞️'
  }, {
    id: 5,
    name: 'The Palm Jumeirah',
    collected: false,
    icon: '🌴'
  }]
}, {
  id: 'sharjah',
  name: 'Sharjah',
  image: '/uploads/e935a959-54c7-49a7-9914-4c5a9927294b.jpg',
  locations: [{
    id: 1,
    name: 'Sharjah Arts Museum',
    collected: false,
    icon: '🎨'
  }, {
    id: 2,
    name: 'Al Qasba',
    collected: false,
    icon: '🎡'
  }, {
    id: 3,
    name: 'Sharjah Heritage Area',
    collected: false,
    icon: '🏺'
  }, {
    id: 4,
    name: 'Khorfakkan Beach',
    collected: false,
    icon: '🏖️'
  }, {
    id: 5,
    name: 'Mleiha Archaeological Center',
    collected: false,
    icon: '🪨'
  }]
}, {
  id: 'ajman',
  name: 'Ajman',
  image: '/uploads/6010950f-4f4f-469b-b416-132398199f60.jpg',
  locations: [{
    id: 1,
    name: 'Ajman Beach',
    collected: false,
    icon: '🌊'
  }, {
    id: 2,
    name: 'Ajman Museum',
    collected: false,
    icon: '🏰'
  }, {
    id: 3,
    name: 'Al Zorah Natural Reserve',
    collected: false,
    icon: '🐦'
  }, {
    id: 4,
    name: 'City Centre Ajman',
    collected: false,
    icon: '🛍️'
  }, {
    id: 5,
    name: 'Masfout Castle',
    collected: false,
    icon: '🏯'
  }]
}, {
  id: 'umm-al-quwain',
  name: 'Umm Al Quwain',
  image: '/uploads/099f147b-9369-493d-998c-178a3529981f.jpg',
  locations: [{
    id: 1,
    name: 'Umm Al Quwain Fort',
    collected: false,
    icon: '🛡️'
  }, {
    id: 2,
    name: 'Dreamland Aqua Park',
    collected: false,
    icon: '🎢'
  }, {
    id: 3,
    name: 'Al Sinniyah Island',
    collected: false,
    icon: '🏝️'
  }, {
    id: 4,
    name: 'Umm Al Quwain Corniche',
    collected: false,
    icon: '🚶'
  }, {
    id: 5,
    name: 'Umm Al Quwain National Museum',
    collected: false,
    icon: '🏛️'
  }]
}, {
  id: 'fujairah',
  name: 'Fujairah',
  image: '/uploads/6968950d-668c-4473-916a-a9c71594902e.jpg',
  locations: [{
    id: 1,
    name: 'Al Bidya Mosque',
    collected: false,
    icon: '🕌'
  }, {
    id: 2,
    name: 'Fujairah Fort',
    collected: false,
    icon: '🏰'
  }, {
    id: 3,
    name: 'Snoopy Island',
    collected: false,
    icon: '🏝️'
  }, {
    id: 4,
    name: 'Al Aqah Beach',
    collected: false,
    icon: '🏖️'
  }, {
    id: 5,
    name: 'Wadi Wurayah National Park',
    collected: false,
    icon: '🏞️'
  }]
}, {
  id: 'ras-al-khaimah',
  name: 'Ras Al Khaimah',
  image: '/uploads/e935a959-54c7-49a7-9914-4c5a9927294b.jpg',
  locations: [{
    id: 1,
    name: 'Dhayah Fort',
    collected: false,
    icon: '🛡️'
  }, {
    id: 2,
    name: 'Jebel Jais',
    collected: false,
    icon: '⛰️'
  }, {
    id: 3,
    name: 'National Museum of Ras Al Khaimah',
    collected: false,
    icon: '🏛️'
  }, {
    id: 4,
    name: 'Al Marjan Island',
    collected: false,
    icon: '🏝️'
  }, {
    id: 5,
    name: 'Khatt Springs',
    collected: false,
    icon: '⛲'
  }]
}];

const PassportScreen = () => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [activeEmirateId, setActiveEmirateId] = useState('abu-dhabi');
  const [currentPage, setCurrentPage] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const [userName, setUserName] = useState('Explorer');
  const [userJoinDate, setUserJoinDate] = useState('');
  const [collectedStampsData, setCollectedStampsData] = useState<Record<string, any[]>>({});
  const { emirateId } = useParams();
  const navigate = useNavigate();

  // Load user data and stamps on component mount
  useEffect(() => {
    // Load user name from localStorage
    const storedUserName = localStorage.getItem('userName') || 'Explorer';
    setUserName(storedUserName);
    
    // Load or create join date
    let joinDate = localStorage.getItem(getUserStorageKey('userJoinDate'));
    if (!joinDate) {
      // If no join date, set it to current date
      const now = new Date();
      joinDate = `${now.toLocaleString('default', { month: 'long' })} ${now.getFullYear()}`;
      localStorage.setItem(getUserStorageKey('userJoinDate'), joinDate);
    }
    setUserJoinDate(joinDate);
    
    // Load collected stamps
    const storedStamps = localStorage.getItem(getUserStorageKey('collectedStamps'));
    if (storedStamps) {
      setCollectedStampsData(JSON.parse(storedStamps));
    }
  }, []);

  // Set the active emirate based on the URL param or default
  useEffect(() => {
    if (emirateId) {
      setActiveEmirateId(emirateId);
      setCurrentPage(emitatesData.findIndex(emirate => emirate.id === emirateId) || 0);
    }
  }, [emirateId]);

  // Apply collected stamps data to emiratesData
  const getUpdatedEmiratesData = () => {
    return emitatesData.map(emirate => {
      // Create a deep copy of the emirate object
      const updatedEmitate = { ...emirate };
      
      // Update locations based on collected stamps
      updatedEmitate.locations = emirate.locations.map(location => {
        // Check if this location has been collected by the user
        const emirateStamps = collectedStampsData[emirate.id] || [];
        const collected = emirateStamps.some(stamp => stamp.locationId === location.id);
        const stamp = emirateStamps.find(s => s.locationId === location.id);
        
        return {
          ...location,
          collected: collected,
          collectedDate: stamp ? new Date(stamp.collectedAt).toLocaleDateString() : undefined
        };
      });
      
      return updatedEmitate;
    });
  };

  const updatedEmiratesData = getUpdatedEmiratesData();
  const emirateData = updatedEmiratesData.find(emirate => emirate.id === activeEmirateId) || updatedEmiratesData[0];
  
  // Calculate total stamps collected
  const totalStampsCollected = Object.values(collectedStampsData).reduce((total: number, stamps: any[]) => {
    return total + stamps.length;
  }, 0);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleScanClick = () => {
    navigate('/scan');
  };

  const handleStampClick = (locationId: number) => {
    if (emirateData && emirateData.locations) {
      const location = emirateData.locations.find(l => l.id === locationId);
      if (location?.collected) {
        navigate(`/stamp/${emirateData.id}/${locationId}`);
      }
    }
  };

  const handleAddMemory = (locationId: number) => {
    navigate(`/stamp-earned`);
  };

  const handlePrevEmirate = () => {
    const currentIndex = emitatesData.findIndex(e => e.id === activeEmirateId);
    if (currentIndex > 0) {
      const newEmirate = emitatesData[currentIndex - 1];
      setActiveEmirateId(newEmirate.id);
      setCurrentPage(currentIndex - 1);
      navigate(`/passport/${newEmirate.id}`);
    }
  };

  const handleNextEmirate = () => {
    const currentIndex = emitatesData.findIndex(e => e.id === activeEmirateId);
    if (currentIndex < emitatesData.length - 1) {
      const newEmirate = emitatesData[currentIndex + 1];
      setActiveEmirateId(newEmirate.id);
      setCurrentPage(currentIndex + 1);
      navigate(`/passport/${newEmirate.id}`);
    }
  };

  // Touch event handlers for swiping
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (touchStart - touchEnd > 100) {
      // Swipe left
      handleNextEmirate();
    }
    if (touchEnd - touchStart > 100) {
      // Swipe right
      handlePrevEmirate();
    }
  };

  return (
    <div className="min-h-screen bg-masar-cream pb-20">
      {/* Header */}
      <div className="bg-masar-gold text-white p-4">
        <div className="flex items-center">
          <Button 
            variant="ghost" 
            className="text-white p-2 h-auto" 
            onClick={() => navigate('/home')}
          >
            <ArrowLeft className="w-6 h-6" />
          </Button>
          <h1 className="text-xl font-serif ml-2">Digital Passport</h1>
        </div>
      </div>
      
      {/* Passport Book */}
      <div className="px-4 py-8">
        <div className={`flip-card mx-auto max-w-md aspect-[3/4] ${isFlipped ? 'flip-active' : ''}`}>
          <div className="flip-card-inner w-full h-full" onClick={!isFlipped ? handleFlip : undefined}>
            {/* Front Cover - UAE Passport Style */}
            <div className="flip-card-front w-full h-full bg-masar-blue rounded-2xl shadow-lg overflow-hidden">
              <div className="w-full h-full flex flex-col items-center justify-center p-6 relative bg-gradient-to-b from-masar-blue to-masar-blue/90">
                <div className="absolute top-0 left-0 w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxwYXR0ZXJuIGlkPSJwYXR0ZXJuLWNpcmNsZXMiIHg9IjAiIHk9IjAiIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgcGF0dGVyblRyYW5zZm9ybT0icm90YXRlKDQ1KSI+PGNpcmNsZSBjeD0iMTAiIGN5PSIxMCIgcj0iMiIgZmlsbD0icmdiYSgyNTUsMjU1LDI1NSwwLjEpIiAvPjwvcGF0dGVybj48cmVjdCB4PSIwIiB5PSIwIiB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI3BhdHRlcm4tY2lyY2xlcykiIC8+PC9zdmc+')] opacity-50"></div>
                
                <div className="absolute top-8 w-full flex justify-center my-0 rounded-none bg-gray-700 px-0">
                  <img alt="Masar Logo" className="w-32 h-auto" src="/uploads/9806cfd2-6d28-48d4-8e1c-c7117acbde65.png" />
                </div>
                
                <div className="text-center mt-24 relative">
                  <h2 className="text-white font-serif text-3xl font-bold tracking-wider mb-2">
                </h2>
                  <p className="text-white/90 text-lg mb-8">United Arab Emirates</p>
                  <p className="text-white/80 text-sm uppercase tracking-widest">Digital Explorer Passport</p>
                  
                  <div className="mt-10 border-b-2 border-t-2 border-white/30 py-4 px-6 bg-slate-800">
                    <div className="text-white text-center uppercase tracking-widest text-sm">Passport</div>
                  </div>
                </div>
                
                <div className="absolute bottom-8 w-full flex justify-center">
                  <p className="text-white/70 text-xs">Tap to open</p>
                </div>
              </div>
            </div>
            
            {/* Inside Pages */}
            <div className="flip-card-back w-full h-full flex bg-white rounded-2xl shadow-lg overflow-hidden" onTouchStart={handleTouchStart} onTouchMove={handleTouchMove} onTouchEnd={handleTouchEnd}>
              {/* Left Page - User Profile */}
              <div className="w-1/2 h-full border-r border-masar-gold/20 p-4 flex flex-col bg-masar-teal">
                <h3 className="text-center text-sm font-bold uppercase tracking-wider mb-6 font-serif text-masar-cream">Explorer Profile</h3>
                
                <div className="flex-1 flex flex-col items-center">
                  <div className="relative mb-4">
                    <Avatar className="w-24 h-24 border-2 border-masar-gold">
                      <AvatarImage src="/uploads/984e2ec2-cb8a-4d95-afeb-0e2d2195bd08.png" alt="Explorer Profile" />
                      <AvatarFallback className="bg-masar-teal text-white text-xl">
                        {userName ? userName.charAt(0) : 'E'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="absolute -bottom-2 -right-2 bg-masar-teal text-white text-xs rounded-full w-8 h-8 flex items-center justify-center border-2 border-white">
                      <span>VIP</span>
                    </div>
                  </div>
                  
                  <h4 className="font-bold text-lg mb-1 text-masar-cream">{userName}</h4>
                  <p className="text-sm mb-4 text-masar-cream">Explorer since {userJoinDate}</p>
                  
                  <div className="w-full bg-white rounded-lg p-3 shadow-sm mb-4">
                    <div className="flex items-center justify-between">
                      <span className="text-masar-blue text-sm">Total Stamps</span>
                      <span className="font-bold text-masar-red">{totalStampsCollected}</span>
                    </div>
                  </div>
                  
                  <div className="w-full">
                    <h5 className="text-sm font-medium mb-2 text-masar-blue">Emirates Visited</h5>
                    <div className="space-y-2">
                      {updatedEmiratesData.map(emirate => {
                        const stampsCollected = emirate.locations.filter(l => l.collected).length;
                        if (stampsCollected > 0) {
                          return (
                            <div key={emirate.id} 
                              className={`text-xs flex items-center justify-between p-2 rounded ${
                                emirate.id === activeEmirateId ? 'bg-masar-gold/20 text-masar-blue font-medium' : 'text-masar-blue/70'
                              }`} 
                              onClick={e => {
                                e.stopPropagation();
                                setActiveEmirateId(emirate.id);
                                navigate(`/passport/${emirate.id}`);
                              }}
                            >
                              <span>{emirate.name}</span>
                              <span>{stampsCollected}/{emirate.locations.length}</span>
                            </div>
                          );
                        }
                        return null;
                      })}
                      {totalStampsCollected === 0 && (
                        <div className="text-xs text-masar-blue/70 p-2 text-center italic">
                          No emirates visited yet
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="py-4 relative">
                  <div className="absolute top-0 left-0 right-0 h-8">
                    <svg viewBox="0 0 100 10" preserveAspectRatio="none" className="h-full w-full">
                      <path d="M0,10 C30,0 70,0 100,10 L100,0 L0,0 Z" fill="#00A8A8" fillOpacity="0.3" />
                    </svg>
                  </div>
                </div>
              </div>
              
              {/* Right Page - Stamps */}
              <div className="w-1/2 h-full bg-white p-4 flex flex-col relative">
                <h3 className="text-center font-serif text-lg font-bold text-masar-blue uppercase tracking-wider mb-2">
                  {emirateData?.name || 'Emirates'}
                </h3>
                <p className="text-center text-xs text-masar-blue/60 mb-4">
                  {emirateData ? `${emirateData.locations.filter(l => l.collected).length}/${emirateData.locations.length} Stamps` : '0/0 Stamps'}
                </p>
                
                {/* Navigation buttons */}
                {currentPage > 0 && (
                  <Button 
                    variant="ghost" 
                    className="absolute left-0 top-1/2 -translate-y-1/2 text-masar-blue h-auto p-1" 
                    onClick={e => {
                      e.stopPropagation();
                      handlePrevEmirate();
                    }}
                  >
                    <ChevronLeft className="h-6 w-6" />
                  </Button>
                )}
                
                {currentPage < emitatesData.length - 1 && (
                  <Button 
                    variant="ghost" 
                    className="absolute right-0 top-1/2 -translate-y-1/2 text-masar-blue h-auto p-1" 
                    onClick={e => {
                      e.stopPropagation();
                      handleNextEmirate();
                    }}
                  >
                    <ChevronRight className="h-6 w-6" />
                  </Button>
                )}
                
                <div className="flex-1 overflow-y-auto">
                  {emirateData && (
                    <div className="grid grid-cols-2 gap-4">
                      {emirateData.locations.map(location => (
                        <div 
                          key={location.id} 
                          className={`aspect-square rounded-full flex flex-col items-center justify-center relative overflow-hidden ${
                            location.collected ? 'bg-masar-gold/20 cursor-pointer' : 'bg-gray-100 opacity-80'
                          }`} 
                          onClick={e => {
                            e.stopPropagation();
                            handleStampClick(location.id);
                          }}
                        >
                          {/* Stamp border - dotted circle */}
                          <div className="absolute inset-0 border-4 rounded-full border-dashed border-masar-blue/20 flex items-center justify-center">
                            {!location.collected && <Lock className="h-6 w-6 text-masar-red" />}
                          </div>
                          
                          {location.collected && (
                            <>
                              {/* Stamp background with icon */}
                              <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
                                <div className="absolute inset-0 bg-masar-gold/20"></div>
                                <div className="w-3/4 h-3/4 rounded-full overflow-hidden">
                                  <img src={location.icon} alt={location.name} className="w-full h-full object-cover opacity-90" />
                                </div>
                              </div>
                              
                              {/* Stamp details */}
                              <div className="absolute bottom-0 left-0 right-0 bg-masar-teal/80 py-1 px-2">
                                <div className="text-[10px] text-center text-white font-medium">
                                  {location.name}
                                </div>
                                <div className="text-[8px] text-center text-white/80">
                                  {location.collectedDate}
                                </div>
                              </div>
                              
                              {/* Add memory button */}
                              <div className="absolute top-0 right-0 p-1">
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  className="h-6 w-6 p-0 text-masar-blue bg-white/80 rounded-full" 
                                  onClick={e => {
                                    e.stopPropagation();
                                    handleAddMemory(location.id);
                                  }}
                                >
                                  <Camera className="h-3 w-3" />
                                </Button>
                              </div>
                            </>
                          )}
                          
                          {!location.collected && (
                            <div className="text-xs text-center text-gray-500 mt-8 px-2">
                              {location.name}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                
                {/* Page number */}
                <div className="text-center text-xs text-masar-blue/50 pt-2 pb-1">
                  {currentPage + 1}/{emitatesData.length}
                </div>
                
                <div className="absolute bottom-0 left-0 right-0 h-4">
                  <svg viewBox="0 0 100 10" preserveAspectRatio="none" className="h-full w-full transform rotate-180">
                    <path d="M0,10 C30,0 70,0 100,10 L100,0 L0,0 Z" fill="#00A8A8" fillOpacity="0.3" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Close passport button (only visible when passport is open) */}
        {isFlipped && (
          <div className="text-center mt-4">
            <Button 
              variant="outline" 
              className="text-masar-blue border-masar-blue/50 font-semibold" 
              onClick={handleFlip}
            >
              Close Passport
            </Button>
          </div>
        )}
      </div>
      
      {/* Scan Button */}
      <div className="fixed bottom-4 left-0 right-0 flex justify-center">
        <Button 
          onClick={handleScanClick} 
          className="text-white px-8 py-4 rounded-full h-auto font-semibold bg-masar-red"
        >
          Scan for New Stamp
        </Button>
      </div>
    </div>
  );
};

export default PassportScreen;
