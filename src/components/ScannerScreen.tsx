import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { ArrowLeft, Camera, Scan } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import QrScanner from 'qr-scanner';

const getUserStorageKey = (key: string): string => {
  const currentUserEmail = localStorage.getItem('currentUserEmail');
  return currentUserEmail ? `${currentUserEmail}_${key}` : key;
};

const ScannerScreen = () => {
  const [qrScanner, setQrScanner] = useState<QrScanner | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [cameraPermission, setCameraPermission] = useState<'granted' | 'denied' | 'pending'>('pending');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [hasNavigated, setHasNavigated] = useState(false);
  const navigate = useNavigate();
  const processingRef = useRef(false);
  
  useEffect(() => {
    return () => cleanup();
  }, []);
  
  const cleanup = () => {
    if (qrScanner) {
      try {
        qrScanner.stop();
        qrScanner.destroy();
      } catch (error) {
        console.log('Error during cleanup:', error);
      }
      setQrScanner(null);
    }
    setIsScanning(false);
    setIsProcessing(false);
    processingRef.current = false;
  };

  const startCamera = async () => {
    if (!videoRef.current || hasNavigated) return;
    
    try {
      const hasCamera = await QrScanner.hasCamera();
      if (!hasCamera) {
        setCameraPermission('denied');
        toast({
          title: "No Camera Found",
          description: "No camera is available on this device.",
          variant: "destructive"
        });
        return;
      }

      setCameraPermission('pending');
      setIsScanning(true);
      
      const scanner = new QrScanner(
        videoRef.current,
        (result) => {
          if (!processingRef.current && !hasNavigated) {
            handleSuccessfulScan(result.data);
          }
        },
        {
          returnDetailedScanResult: true,
          highlightScanRegion: true,
          highlightCodeOutline: true,
          maxScansPerSecond: 2,
          preferredCamera: 'environment'
        }
      );
      
      await scanner.start();
      setQrScanner(scanner);
      setCameraPermission('granted');
      
    } catch (error) {
      console.error('Error starting camera:', error);
      setCameraPermission('denied');
      setIsScanning(false);
      toast({
        title: "Camera Error",
        description: "Could not access camera. Please ensure you've granted camera permissions.",
        variant: "destructive"
      });
    }
  };

  const stopCamera = () => {
    cleanup();
  };
  
  const handleCancel = () => {
    if (!hasNavigated) {
      setHasNavigated(true);
      stopCamera();
      navigate(-1);
    }
  };
  
  const handleSuccessfulScan = (scannedData: string) => {
    if (processingRef.current || hasNavigated) return;
    
    processingRef.current = true;
    setIsProcessing(true);
    
    // Stop scanner immediately to prevent multiple scans
    if (qrScanner) {
      qrScanner.stop();
    }
    
    try {
      let locationInfo = null;
      
      if (scannedData.includes('Dubai Mall') || scannedData.includes('dubai-mall') || scannedData.includes('Dubai – Home to over 1,200 retail outlets')) {
        locationInfo = {
          emirateId: 'dubai',
          locationId: 2,
          locationName: 'Dubai Mall',
          points: 50
        };
      }
      
      if (locationInfo) {
        const storageKey = getUserStorageKey('collectedStamps');
        const existingStamps = JSON.parse(localStorage.getItem(storageKey) || '{}');
        
        if (!existingStamps[locationInfo.emirateId]) {
          existingStamps[locationInfo.emirateId] = [];
        }
        
        const stampExists = existingStamps[locationInfo.emirateId].some(
          (stamp: any) => stamp.locationId === locationInfo.locationId
        );
        
        if (stampExists) {
          toast({
            title: "Already Scanned!",
            description: `You've already collected the stamp for ${locationInfo.locationName}.`,
            variant: "default"
          });
          
          setTimeout(() => {
            if (!hasNavigated) {
              setHasNavigated(true);
              navigate(-1);
            }
          }, 1500);
        } else {
          toast({
            title: "QR Code Scanned!",
            description: `Welcome to ${locationInfo.locationName}! Stamp collected! +${locationInfo.points} points!`
          });
          
          existingStamps[locationInfo.emirateId].push({
            locationId: locationInfo.locationId,
            locationName: locationInfo.locationName,
            collectedAt: new Date().toISOString(),
            emirateId: locationInfo.emirateId
          });
          
          localStorage.setItem(storageKey, JSON.stringify(existingStamps));
          
          const pointsKey = getUserStorageKey('userPoints');
          const currentPoints = parseInt(localStorage.getItem(pointsKey) || '0');
          const newPoints = currentPoints + locationInfo.points;
          localStorage.setItem(pointsKey, newPoints.toString());
          
          // Dispatch both events to update UI immediately
          window.dispatchEvent(new CustomEvent('stampsUpdated', { detail: { stamps: existingStamps } }));
          window.dispatchEvent(new CustomEvent('pointsUpdated', { detail: { newPoints } }));
          
          setTimeout(() => {
            if (!hasNavigated) {
              setHasNavigated(true);
              navigate('/stamp-earned', { 
                state: { 
                  stampData: {
                    emirateId: locationInfo.emirateId,
                    locationId: locationInfo.locationId,
                    name: locationInfo.locationName,
                    points: locationInfo.points
                  }
                }
              });
            }
          }, 1500);
        }
      } else {
        toast({
          title: "QR Code Scanned!",
          description: `Scanned: ${scannedData}`,
          variant: "default"
        });
        
        setTimeout(() => {
          if (!hasNavigated) {
            setHasNavigated(true);
            navigate(-1);
          }
        }, 1500);
      }
      
    } catch (error) {
      console.error("Error handling QR scan:", error);
      setIsProcessing(false);
      processingRef.current = false;
      
      toast({
        title: "Scan Error",
        description: "Error processing QR code scan.",
        variant: "destructive"
      });
    }
  };

  const getStatusMessage = () => {
    if (isProcessing) return "Processing QR Code...";
    if (isScanning && cameraPermission === 'granted') return "Point camera at QR code";
    if (cameraPermission === 'pending' && isScanning) return "Initializing camera...";
    if (cameraPermission === 'denied') return "Camera access required";
    return "Ready to start scanning";
  };

  const getStatusColor = () => {
    if (isProcessing) return 'bg-masar-gold animate-pulse';
    if (isScanning && cameraPermission === 'granted') return 'bg-masar-teal animate-pulse';
    if (cameraPermission === 'denied') return 'bg-masar-red';
    return 'bg-masar-blue/50';
  };

  return (
    <div className="min-h-screen bg-masar-cream flex flex-col font-sans">
      {/* Header */}
      <div className="bg-masar-blue p-4 shadow-lg">
        <div className="flex items-center">
          <Button 
            variant="ghost" 
            className="text-masar-cream hover:bg-masar-blue/80 p-2 h-auto mr-4" 
            onClick={handleCancel}
            disabled={isProcessing}
          >
            <ArrowLeft className="w-6 h-6" />
          </Button>
          <h1 className="text-masar-cream text-xl font-serif font-bold">QR Scanner</h1>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center p-6">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-masar-teal rounded-full flex items-center justify-center mx-auto mb-4">
            <Scan className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-masar-blue text-2xl font-serif font-bold mb-2">
            Scan QR Code
          </h2>
          <p className="text-masar-blue/70 text-sm">
            Position the QR code within the frame to scan
          </p>
        </div>
        
        {/* Camera Box */}
        <div className="relative w-80 h-80 mb-8">
          <div className="w-full h-full rounded-3xl border-4 border-masar-teal shadow-2xl overflow-hidden relative bg-masar-blue/10">
            
            <video 
              ref={videoRef} 
              className="absolute inset-0 w-full h-full object-cover rounded-2xl"
              playsInline
              muted
              autoPlay
            />
            
            {/* Scanning Frame */}
            {isScanning && cameraPermission === 'granted' && !isProcessing && (
              <div className="absolute inset-0 pointer-events-none flex items-center justify-center z-10">
                <div className="w-48 h-48 border-2 border-masar-gold rounded-2xl relative">
                  <div className="absolute -top-1 -left-1 w-8 h-8 border-l-4 border-t-4 border-masar-gold rounded-tl-lg animate-pulse"></div>
                  <div className="absolute -top-1 -right-1 w-8 h-8 border-r-4 border-t-4 border-masar-gold rounded-tr-lg animate-pulse"></div>
                  <div className="absolute -bottom-1 -left-1 w-8 h-8 border-l-4 border-b-4 border-masar-gold rounded-bl-lg animate-pulse"></div>
                  <div className="absolute -bottom-1 -right-1 w-8 h-8 border-r-4 border-b-4 border-masar-gold rounded-br-lg animate-pulse"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-full h-0.5 bg-masar-gold opacity-75 animate-pulse"></div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Status overlay */}
            {(!isScanning || cameraPermission !== 'granted') && (
              <div className="absolute inset-0 flex items-center justify-center bg-masar-blue/90 backdrop-blur-sm z-20 rounded-2xl">
                <div className="text-center p-6">
                  <div className="w-20 h-20 bg-masar-teal rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <Camera className="w-10 h-10 text-white" />
                  </div>
                  <p className="text-white text-lg font-medium mb-2">
                    {cameraPermission === 'denied' ? "Camera Unavailable" :
                     cameraPermission === 'pending' && isScanning ? "Starting Camera..." :
                     "Ready to Scan"}
                  </p>
                  <p className="text-masar-cream/80 text-sm">
                    {cameraPermission === 'denied' ? "Please check camera permissions" : "Tap Start to begin scanning"}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Status Card */}
        <div className="mb-8">
          <div className="bg-white/80 backdrop-blur-sm border border-masar-teal/20 text-masar-blue px-6 py-4 rounded-2xl shadow-lg">
            <div className="flex items-center space-x-3">
              <div className={`w-3 h-3 rounded-full ${getStatusColor()}`}></div>
              <span className="font-medium">{getStatusMessage()}</span>
            </div>
          </div>
        </div>
        
        {/* Control buttons */}
        <div className="space-y-4 w-80">
          {!isScanning ? (
            <Button 
              onClick={startCamera}
              className="w-full bg-masar-teal hover:bg-masar-teal/90 text-white py-4 rounded-2xl text-lg font-semibold shadow-lg transition-all duration-200 hover:shadow-xl"
              disabled={isProcessing}
            >
              <Camera className="w-5 h-5 mr-2" />
              Start Scanner
            </Button>
          ) : (
            <Button 
              onClick={stopCamera}
              className="w-full bg-masar-red hover:bg-masar-red/90 text-white py-4 rounded-2xl text-lg font-semibold shadow-lg transition-all duration-200"
              disabled={isProcessing}
            >
              {isProcessing ? 'Processing...' : 'Stop Scanner'}
            </Button>
          )}
          
          <Button 
            onClick={handleCancel}
            variant="outline"
            className="w-full border-2 border-masar-blue text-masar-blue hover:bg-masar-blue hover:text-white rounded-2xl py-4 text-lg font-semibold transition-all duration-200"
            disabled={isProcessing}
          >
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ScannerScreen;
