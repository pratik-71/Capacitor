'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Haptics, ImpactStyle } from '@capacitor/haptics';
import { PushNotifications } from '@capacitor/push-notifications';

export default function Home() {
  const [isMobile, setIsMobile] = useState(false);
  const [platform, setPlatform] = useState('web');
  const [notificationPermission, setNotificationPermission] = useState('default');

  useEffect(() => {
    // Detect if running on mobile
    const checkMobile = () => {
      if (typeof window !== 'undefined' && navigator) {
        const userAgent = navigator.userAgent.toLowerCase();
        const isMobileDevice = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent);
        setIsMobile(isMobileDevice);
        
        // Detect platform
        if (userAgent.includes('android')) {
          setPlatform('android');
        } else if (userAgent.includes('iphone') || userAgent.includes('ipad')) {
          setPlatform('ios');
        } else {
          setPlatform('web');
        }

        // Check notification permission
        if ('Notification' in window) {
          setNotificationPermission(Notification.permission);
        }
      }
    };

    checkMobile();
  }, []);

  const testNotification = async () => {
    // Check if running in a mobile WebView (Capacitor app)
    const isCapacitor = typeof window !== 'undefined' && 'Capacitor' in window;
    
    if (isCapacitor) {
      try {
        // Request permission for push notifications
        const permission = await PushNotifications.requestPermissions();
        
        if (permission.receive === 'granted') {
          // Register for push notifications
          await PushNotifications.register();
          
          // Show a local notification (simulating push)
          alert('📱 Push notification permission granted!\n\nIn a real app, you would receive push notifications from your server.');
        } else {
          alert('📱 Push notification permission denied');
        }
      } catch (error) {
        alert('📱 Error setting up notifications: ' + (error as Error).message);
      }
    } else if ('Notification' in window) {
      // In regular browser
      if (Notification.permission === 'granted') {
        new Notification('Test Notification', {
          body: 'This is a test notification from your app!',
          icon: '/favicon.ico',
          badge: '/favicon.ico'
        });
      } else if (Notification.permission === 'default') {
        const permission = await Notification.requestPermission();
        setNotificationPermission(permission);
        if (permission === 'granted') {
          new Notification('Test Notification', {
            body: 'This is a test notification from your app!',
            icon: '/favicon.ico',
            badge: '/favicon.ico'
          });
        }
      }
    } else {
      alert('📱 Running in mobile WebView - notifications work differently here!\n\nIn a real Capacitor app, you would use @capacitor/push-notifications plugin for native notifications.');
    }
  };

  const testCamera = async () => {
    const isCapacitor = typeof window !== 'undefined' && 'Capacitor' in window;
    
    if (isCapacitor) {
      try {
        const image = await Camera.getPhoto({
          quality: 90,
          allowEditing: true,
          resultType: CameraResultType.Uri,
          source: CameraSource.Camera
        });
        
        alert('📷 Photo captured successfully!\n\nImage URI: ' + image.webPath);
      } catch (error) {
        alert('📷 Camera error: ' + (error as Error).message);
      }
    } else if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ video: true })
        .then(stream => {
          alert('Camera access granted! This would open camera in a real app.');
          // Stop the stream
          stream.getTracks().forEach(track => track.stop());
        })
        .catch(() => {
          alert('Camera access denied or not available');
        });
    } else {
      alert('Camera not supported in this browser');
    }
  };

  const testGallery = async () => {
    const isCapacitor = typeof window !== 'undefined' && 'Capacitor' in window;
    
    if (isCapacitor) {
      try {
        const image = await Camera.getPhoto({
          quality: 90,
          allowEditing: true,
          resultType: CameraResultType.Uri,
          source: CameraSource.Photos
        });
        
        alert('🖼️ Image selected from gallery!\n\nImage URI: ' + image.webPath);
      } catch (error) {
        alert('🖼️ Gallery error: ' + (error as Error).message);
      }
    } else {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
      input.multiple = true;
      
      input.onchange = (e) => {
        const files = (e.target as HTMLInputElement).files;
        if (files && files.length > 0) {
          alert(`Selected ${files.length} image(s) from gallery!`);
          // In a real app, you would process these files
        }
      };
      
      input.click();
    }
  };

  const testGeolocation = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          alert(`Location: ${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
        },
        (error) => {
          alert(`Location error: ${error.message}`);
        }
      );
    } else {
      alert('Geolocation not supported in this browser');
    }
  };

  const testVibration = async () => {
    const isCapacitor = typeof window !== 'undefined' && 'Capacitor' in window;
    
    if (isCapacitor) {
      try {
        await Haptics.impact({ style: ImpactStyle.Medium });
        alert('📳 Native haptic feedback triggered!');
      } catch (error) {
        alert('📳 Haptic error: ' + (error as Error).message);
      }
    } else if ('vibrate' in navigator) {
      navigator.vibrate([200, 100, 200]);
      alert('Vibration pattern triggered!');
    } else {
      alert('Vibration not supported in this browser');
    }
  };

  const testShare = async () => {
    if ('share' in navigator) {
      try {
        await navigator.share({
          title: 'My Capacitor App',
          text: 'Check out this awesome cross-platform app!',
          url: window.location.href
        });
      } catch {
        alert('Share cancelled or not supported');
      }
    } else {
      alert('Web Share API not supported in this browser');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">C</span>
              </div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">Capacitor App</h1>
            </div>
            <div className="flex items-center space-x-2">
              <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs rounded-full font-medium">
                {platform.toUpperCase()}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Cross-Platform App
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
            Built with Next.js, TypeScript, Tailwind CSS, and Capacitor
          </p>
          
          {/* Platform Info */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg mb-8">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Platform Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                <div className="text-blue-600 dark:text-blue-400 font-medium">Platform</div>
                <div className="text-gray-900 dark:text-white">{platform}</div>
              </div>
              <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                <div className="text-green-600 dark:text-green-400 font-medium">Device Type</div>
                <div className="text-gray-900 dark:text-white">{isMobile ? 'Mobile' : 'Desktop'}</div>
              </div>
              <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
                <div className="text-purple-600 dark:text-purple-400 font-medium">Notifications</div>
                <div className="text-gray-900 dark:text-white capitalize">{notificationPermission}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Device Features Testing */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg mb-8">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
            Test Device Features
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <button
              onClick={testNotification}
              className="flex items-center space-x-3 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
            >
              <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM4.5 19.5h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
                </svg>
              </div>
              <div className="text-left">
                <div className="font-medium text-gray-900 dark:text-white">Notifications</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Test push notifications</div>
              </div>
            </button>

            <button
              onClick={testCamera}
              className="flex items-center space-x-3 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors"
            >
              <div className="w-10 h-10 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div className="text-left">
                <div className="font-medium text-gray-900 dark:text-white">Camera</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Access device camera</div>
              </div>
            </button>

            <button
              onClick={testGallery}
              className="flex items-center space-x-3 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors"
            >
              <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="text-left">
                <div className="font-medium text-gray-900 dark:text-white">Gallery</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Upload from gallery</div>
              </div>
            </button>

            <button
              onClick={testGeolocation}
              className="flex items-center space-x-3 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg hover:bg-yellow-100 dark:hover:bg-yellow-900/30 transition-colors"
            >
              <div className="w-10 h-10 bg-yellow-100 dark:bg-yellow-900 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-yellow-600 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div className="text-left">
                <div className="font-medium text-gray-900 dark:text-white">Location</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Get current location</div>
              </div>
            </button>

            <button
              onClick={testVibration}
              className="flex items-center space-x-3 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
            >
              <div className="w-10 h-10 bg-red-100 dark:bg-red-900 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div className="text-left">
                <div className="font-medium text-gray-900 dark:text-white">Vibration</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Test device vibration</div>
              </div>
            </button>

            <button
              onClick={testShare}
              className="flex items-center space-x-3 p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg hover:bg-indigo-100 dark:hover:bg-indigo-900/30 transition-colors"
            >
              <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                </svg>
              </div>
              <div className="text-left">
                <div className="font-medium text-gray-900 dark:text-white">Share</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Share app content</div>
              </div>
            </button>
          </div>
        </div>

        {/* Navigation */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg mb-8">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
            Navigation
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link
              href="/about"
              className="flex items-center space-x-3 p-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all transform hover:scale-105"
            >
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="text-left">
                <div className="font-medium">About Page</div>
                <div className="text-sm opacity-90">Learn more about the app</div>
              </div>
            </Link>

            <Link
              href="/settings"
              className="flex items-center space-x-3 p-4 bg-gradient-to-r from-gray-500 to-gray-600 text-white rounded-lg hover:from-gray-600 hover:to-gray-700 transition-all transform hover:scale-105"
            >
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div className="text-left">
                <div className="font-medium">Settings</div>
                <div className="text-sm opacity-90">App configuration</div>
              </div>
            </Link>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="text-center">
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors">
              Get Started
            </button>
            <button className="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white font-medium py-3 px-6 rounded-lg transition-colors">
              Learn More
            </button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-12">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="text-center text-gray-600 dark:text-gray-400">
            <p>Built with Next.js, TypeScript, Tailwind CSS & Capacitor</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
