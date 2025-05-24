
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Award, Gift, Star, Trophy } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// Helper function to get user-specific storage key
const getUserStorageKey = (key: string): string => {
  const currentUserEmail = localStorage.getItem('currentUserEmail');
  if (!currentUserEmail) return key; // Fallback
  return `${currentUserEmail}_${key}`;
};

// Available rewards
const rewards = [
  {
    id: 1,
    name: 'Free Coffee at Emirates Palace',
    points: 50,
    description: 'Enjoy a complimentary coffee at the luxurious Emirates Palace Hotel',
    icon: '☕',
    category: 'Food & Beverage'
  },
  {
    id: 2,
    name: 'Dubai Mall Gift Voucher',
    points: 100,
    description: 'AED 25 gift voucher to use at any store in Dubai Mall',
    icon: '🛍️',
    category: 'Shopping'
  },
  {
    id: 3,
    name: 'Museum Entry Ticket',
    points: 75,
    description: 'Free entry to any participating museum across the UAE',
    icon: '🏛️',
    category: 'Culture'
  },
  {
    id: 4,
    name: 'Desert Safari Discount',
    points: 150,
    description: '25% discount on desert safari experience',
    icon: '🐪',
    category: 'Adventure'
  },
  {
    id: 5,
    name: 'Aquarium Visit',
    points: 80,
    description: 'Free entry to Dubai Aquarium & Underwater Zoo',
    icon: '🐠',
    category: 'Entertainment'
  },
  {
    id: 6,
    name: 'Traditional Meal',
    points: 120,
    description: 'Authentic Emirati meal at a local restaurant',
    icon: '🍽️',
    category: 'Food & Beverage'
  }
];

const RewardsScreen = () => {
  const [userPoints, setUserPoints] = useState(0);
  const [redeemedRewards, setRedeemedRewards] = useState<number[]>([]);
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Check if user is demo user
  const isDemoUser = localStorage.getItem('userName') === 'Demo User';
  
  useEffect(() => {
    // Load user points and redeemed rewards
    if (!isDemoUser) {
      loadUserData();
    }
  }, [isDemoUser]);
  
  const loadUserData = () => {
    try {
      // Load points
      const storedPoints = localStorage.getItem(getUserStorageKey('userPoints'));
      if (storedPoints) {
        setUserPoints(parseInt(storedPoints));
      }
      
      // Load redeemed rewards
      const storedRedeemed = localStorage.getItem(getUserStorageKey('redeemedRewards'));
      if (storedRedeemed) {
        setRedeemedRewards(JSON.parse(storedRedeemed));
      }
    } catch (error) {
      console.error("Error loading user data:", error);
    }
  };
  
  const handleRedeemReward = (reward: typeof rewards[0]) => {
    if (isDemoUser) {
      toast({
        title: "Demo Mode",
        description: "Rewards redemption is not available in demo mode",
        variant: "destructive"
      });
      return;
    }
    
    if (userPoints < reward.points) {
      toast({
        title: "Insufficient Points",
        description: `You need ${reward.points - userPoints} more points to redeem this reward`,
        variant: "destructive"
      });
      return;
    }
    
    if (redeemedRewards.includes(reward.id)) {
      toast({
        title: "Already Redeemed",
        description: "You have already redeemed this reward",
        variant: "destructive"
      });
      return;
    }
    
    // Deduct points
    const newPoints = userPoints - reward.points;
    localStorage.setItem(getUserStorageKey('userPoints'), newPoints.toString());
    
    // Add to redeemed rewards
    const newRedeemed = [...redeemedRewards, reward.id];
    localStorage.setItem(getUserStorageKey('redeemedRewards'), JSON.stringify(newRedeemed));
    
    // Update state
    setUserPoints(newPoints);
    setRedeemedRewards(newRedeemed);
    
    toast({
      title: "Reward Redeemed!",
      description: `You have successfully redeemed ${reward.name}`,
    });
  };
  
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Food & Beverage': return <Gift className="w-4 h-4" />;
      case 'Shopping': return <Star className="w-4 h-4" />;
      case 'Culture': return <Trophy className="w-4 h-4" />;
      case 'Adventure': return <Award className="w-4 h-4" />;
      case 'Entertainment': return <Gift className="w-4 h-4" />;
      default: return <Gift className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-masar-cream pb-20">
      {/* Header */}
      <div className="bg-masar-blue text-white p-6 rounded-b-2xl">
        <div className="flex items-center mb-4">
          <Button 
            variant="ghost" 
            className="text-white p-2 h-auto mr-2" 
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="w-6 h-6" />
          </Button>
          <h1 className="text-xl font-bold">Rewards</h1>
        </div>
        
        {/* Points Display */}
        <div className="bg-masar-gold/20 rounded-xl p-4 flex items-center justify-between">
          <div className="flex items-center">
            <Award className="w-8 h-8 text-masar-gold mr-3" />
            <div>
              <p className="text-sm text-white/80">Your Points</p>
              <p className="text-2xl font-bold text-white">
                {isDemoUser ? 0 : userPoints}
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs text-white/60">Scan QR codes</p>
            <p className="text-xs text-white/60">to earn more points</p>
          </div>
        </div>
      </div>
      
      {/* Demo Message */}
      {isDemoUser && (
        <div className="mx-4 mt-4 p-4 bg-orange-100 rounded-lg border border-orange-200">
          <p className="text-orange-800 text-sm">
            <strong>Demo Mode:</strong> Rewards redemption is not available. Sign up to start earning and redeeming points!
          </p>
        </div>
      )}
      
      {/* Rewards List */}
      <div className="p-4">
        <h2 className="text-xl font-serif font-bold text-masar-blue mb-4">Available Rewards</h2>
        
        <div className="space-y-4">
          {rewards.map((reward) => {
            const isRedeemed = redeemedRewards.includes(reward.id);
            const canRedeem = !isDemoUser && userPoints >= reward.points && !isRedeemed;
            
            return (
              <Card key={reward.id} className={`p-4 ${isRedeemed ? 'bg-gray-50 border-gray-200' : 'bg-white'}`}>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center mb-2">
                      <span className="text-2xl mr-3">{reward.icon}</span>
                      <div>
                        <h3 className={`font-bold ${isRedeemed ? 'text-gray-500' : 'text-masar-blue'}`}>
                          {reward.name}
                        </h3>
                        <div className="flex items-center mt-1">
                          {getCategoryIcon(reward.category)}
                          <span className={`text-xs ml-1 ${isRedeemed ? 'text-gray-400' : 'text-masar-teal'}`}>
                            {reward.category}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <p className={`text-sm mb-3 ${isRedeemed ? 'text-gray-500' : 'text-gray-600'}`}>
                      {reward.description}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Award className={`w-4 h-4 mr-1 ${isRedeemed ? 'text-gray-400' : 'text-masar-gold'}`} />
                        <span className={`font-bold ${isRedeemed ? 'text-gray-500' : 'text-masar-gold'}`}>
                          {reward.points} points
                        </span>
                      </div>
                      
                      {isRedeemed ? (
                        <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-medium">
                          ✓ Redeemed
                        </span>
                      ) : (
                        <Button
                          onClick={() => handleRedeemReward(reward)}
                          disabled={!canRedeem}
                          className={`${canRedeem 
                            ? 'bg-masar-teal hover:bg-masar-teal/90' 
                            : 'bg-gray-300 cursor-not-allowed'
                          } text-white px-4 py-2 text-sm`}
                        >
                          {isDemoUser 
                            ? 'Demo Mode' 
                            : userPoints < reward.points 
                              ? `Need ${reward.points - userPoints} more` 
                              : 'Redeem'
                          }
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
        
        {/* Get More Points CTA */}
        {!isDemoUser && userPoints < 50 && (
          <div className="mt-6 p-4 bg-masar-teal/10 rounded-xl text-center">
            <Award className="w-12 h-12 text-masar-teal mx-auto mb-2" />
            <h3 className="font-bold text-masar-blue mb-2">Need More Points?</h3>
            <p className="text-sm text-masar-teal/80 mb-4">
              Visit locations across the UAE and scan QR codes to earn points!
            </p>
            <Button 
              onClick={() => navigate('/scan')}
              className="bg-masar-teal hover:bg-masar-teal/90 text-white"
            >
              Start Scanning
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default RewardsScreen;
