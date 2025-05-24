import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { ArrowLeft, Camera, Edit } from 'lucide-react';

// Mock data for stamp details
const stampDetails = {
  'abu-dhabi': {
    1: {
      name: 'Sheikh Zayed Grand Mosque',
      description: 'One of the world\'s largest mosques and an architectural masterpiece.',
      image: 'https://images.unsplash.com/photo-1466442929976-97f336a657be?auto=format&fit=crop&w=800&q=80',
      collectedDate: '2023-05-18',
      notes: 'Amazing architecture and peaceful atmosphere. The white marble against the blue sky was stunning!',
      memory: 'https://images.unsplash.com/photo-1466442929976-97f336a657be?auto=format&fit=crop&w=800&q=80'
    },
    2: {
      name: 'Louvre Abu Dhabi',
      description: 'An art and civilization museum located on Saadiyat Island.',
      image: 'https://images.unsplash.com/photo-1482938289607-e9573fc25ebb?auto=format&fit=crop&w=800&q=80',
      collectedDate: '2023-06-02',
      notes: 'The building design is as impressive as the art inside!',
      memory: 'https://images.unsplash.com/photo-1482938289607-e9573fc25ebb?auto=format&fit=crop&w=800&q=80'
    }
  },
  'dubai': {
    1: {
      name: 'Burj Khalifa',
      description: 'The tallest building in the world and a global icon.',
      image: 'https://images.unsplash.com/photo-1469041797191-50ace28483c3?auto=format&fit=crop&w=800&q=80',
      collectedDate: '2023-04-10',
      notes: 'The view from the top was breathtaking!',
      memory: 'https://images.unsplash.com/photo-1469041797191-50ace28483c3?auto=format&fit=crop&w=800&q=80'
    },
    2: {
      name: 'Dubai Mall',
      description: 'One of the world\'s largest shopping malls.',
      image: 'https://images.unsplash.com/photo-1472396961693-142e6e269027?auto=format&fit=crop&w=800&q=80',
      collectedDate: '2023-04-12',
      notes: 'Spent the whole day shopping and watching the fountain show!',
      memory: 'https://images.unsplash.com/photo-1472396961693-142e6e269027?auto=format&fit=crop&w=800&q=80'
    },
    3: {
      name: 'Palm Jumeirah',
      description: 'An artificial archipelago shaped like a palm tree.',
      image: 'https://images.unsplash.com/photo-1469041797191-50ace28483c3?auto=format&fit=crop&w=800&q=80',
      collectedDate: '2023-04-15',
      notes: 'Beautiful beaches and luxury hotels everywhere!',
      memory: 'https://images.unsplash.com/photo-1469041797191-50ace28483c3?auto=format&fit=crop&w=800&q=80'
    }
  },
  'ajman': {
    1: {
      name: 'Ajman Museum',
      description: 'A historic 18th-century fort that served as the ruler\'s residence.',
      image: 'https://images.unsplash.com/photo-1482938289607-e9573fc25ebb?auto=format&fit=crop&w=800&q=80',
      collectedDate: '2023-07-22',
      notes: 'Learned so much about the history of Ajman!',
      memory: 'https://images.unsplash.com/photo-1482938289607-e9573fc25ebb?auto=format&fit=crop&w=800&q=80'
    }
  }
};
const StampDetailScreen = () => {
  const {
    emirateId,
    stampId
  } = useParams();
  const [isEditing, setIsEditing] = useState(false);
  const [notes, setNotes] = useState('');
  const navigate = useNavigate();
  if (!emirateId || !stampId || !stampDetails[emirateId as keyof typeof stampDetails]) {
    return <div>Stamp not found</div>;
  }
  const stampData = stampDetails[emirateId as keyof typeof stampDetails][Number(stampId) as keyof typeof stampDetails[keyof typeof stampDetails]];
  if (!stampData) {
    return <div>Stamp not found</div>;
  }
  const handleStartEditing = () => {
    setNotes(stampData.notes);
    setIsEditing(true);
  };
  const handleSaveNotes = () => {
    // In a real app, we would save the notes to the database
    setIsEditing(false);
    // For demo purposes, just navigate back
    navigate(`/passport/${emirateId}`);
  };
  return <div className="min-h-screen bg-masar-cream">
      {/* Header */}
      <div className="text-white p-4 bg-masar-blue">
        <div className="flex items-center">
          <Button variant="ghost" className="text-white p-2 h-auto" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-6 h-6" />
          </Button>
          <h1 className="text-xl font-bold ml-2">{stampData.name}</h1>
        </div>
      </div>
      
      {/* Stamp Content */}
      <div className="p-6">
        {/* Stamp Image */}
        <div className="mb-6">
          <div className="aspect-video rounded-xl overflow-hidden bg-masar-teal/10 relative">
            <img src={stampData.image} alt={stampData.name} className="w-full h-full object-cover" />
            <div className="absolute bottom-0 left-0 px-3 py-1 rounded-tr-lg bg-masar-red">
              <p className="text-white text-sm">Collected on {stampData.collectedDate}</p>
            </div>
          </div>
        </div>
        
        {/* Stamp Description */}
        <div className="mb-6">
          <h2 className="text-lg font-bold mb-2 text-masar-blue">About</h2>
          <p className="text-masar-blue">{stampData.description}</p>
        </div>
        
        {/* Memory */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-lg font-bold text-masar-blue">My Memory</h2>
            {!isEditing && <Button variant="ghost" size="sm" onClick={handleStartEditing} className="text-masar-teal">
                <Edit className="w-4 h-4 mr-1" /> Edit
              </Button>}
          </div>
          
          {stampData.memory && <div className="mb-4 aspect-video rounded-lg overflow-hidden bg-masar-teal/10">
              <img src={stampData.memory} alt="Memory" className="w-full h-full object-cover" />
            </div>}
          
          {isEditing ? <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-masar-teal mb-1">
                  Upload Photo
                </label>
                <div className="border-2 border-dashed border-masar-mint rounded-lg p-4 flex flex-col items-center justify-center">
                  <Camera className="w-8 h-8 text-masar-teal/50" />
                  <p className="text-sm text-masar-teal/70 mt-2">Tap to add or change photo</p>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-masar-teal mb-1">
                  Notes
                </label>
                <textarea value={notes} onChange={e => setNotes(e.target.value)} className="w-full h-32 p-3 rounded-lg border-2 border-masar-mint focus:border-masar-teal outline-none" />
              </div>
              
              <Button onClick={handleSaveNotes} className="w-full bg-masar-teal hover:bg-masar-teal/90 text-white">
                Save Memory
              </Button>
            </div> : <div className="bg-white p-4 rounded-lg shadow-sm">
              <p className="text-masar-blue">
                {stampData.notes || "No notes added yet."}
              </p>
            </div>}
        </div>
        
        {/* Share Button */}
        {!isEditing && <Button variant="outline" className="w-full border-masar-teal text-masar-teal mb-6">
            Share This Achievement
          </Button>}
      </div>
    </div>;
};
export default StampDetailScreen;