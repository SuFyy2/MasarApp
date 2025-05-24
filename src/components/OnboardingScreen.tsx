import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { ArrowRight } from 'lucide-react';
const onboardingContent = [{
  title: "Explore the Emirates in a fun way",
  description: "Discover hidden gems, popular attractions, and unique experiences across the 7 Emirates of the UAE.",
  image: "https://images.unsplash.com/photo-1482938289607-e9573fc25ebb?auto=format&fit=crop&w=800&q=80"
}, {
  title: "Collect digital stamps on your journey",
  description: "Visit locations, scan QR codes, and collect unique digital stamps in your Masar passport.",
  image: "https://images.unsplash.com/photo-1466442929976-97f336a657be?auto=format&fit=crop&w=800&q=80"
}, {
  title: "Record your memories with photos and notes",
  description: "Capture your adventure with photos and personal notes for each stamp you collect.",
  image: "https://images.unsplash.com/photo-1472396961693-142e6e269027?auto=format&fit=crop&w=800&q=80"
}];
const OnboardingScreen = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const navigate = useNavigate();
  const handleNext = () => {
    if (currentPage < onboardingContent.length - 1) {
      setCurrentPage(currentPage + 1);
    } else {
      // Mark onboarding as seen
      localStorage.setItem('hasSeenOnboarding', 'true');
      navigate('/login');
    }
  };
  const content = onboardingContent[currentPage];
  return <div className="flex flex-col min-h-screen bg-masar-cream">
      <div className="relative flex-1 overflow-hidden">
        <img src={content.image} alt={content.title} className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-masar-teal/90 to-transparent flex items-end">
          <div className="p-8 w-full">
            <h1 className="text-2xl font-bold text-white mb-3">{content.title}</h1>
            <p className="text-white/90 text-lg">{content.description}</p>
          </div>
        </div>
      </div>

      <div className="bg-masar-cream p-8">
        <div className="flex justify-between items-center mb-8">
          <div className="flex space-x-2">
            {onboardingContent.map((_, index) => <div key={index} className={`h-2 rounded-full transition-all ${index === currentPage ? 'w-8 bg-masar-teal' : 'w-2 bg-masar-mint'}`} />)}
          </div>
          <Button onClick={handleNext} className="text-white rounded-full px-6 py-4 h-auto bg-masar-gold">
            {currentPage < onboardingContent.length - 1 ? <>Next <ArrowRight className="ml-2 h-5 w-5" /></> : 'Get Started'}
          </Button>
        </div>

        {currentPage === onboardingContent.length - 1 && <Button variant="link" onClick={() => navigate('/login')} className="text-masar-teal underline underline-offset-4 w-full">
            Skip
          </Button>}
      </div>
    </div>;
};
export default OnboardingScreen;