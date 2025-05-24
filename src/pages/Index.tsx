
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Index = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    // Redirect to splash screen
    navigate('/');
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-masar-cream">
      <img 
        src="/uploads/21b85797-a307-41e9-bf45-70a8191c7f5c.png" 
        alt="Masar Logo" 
        className="w-64 h-auto animate-pulse"
      />
    </div>
  );
};

export default Index;
