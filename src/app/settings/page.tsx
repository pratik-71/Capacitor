'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Settings() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [locationEnabled, setLocationEnabled] = useState(false);
  const [deviceInfo, setDeviceInfo] = useState<{
    userAgent?: string;
    platform?: string;
    language?: string;
    cookieEnabled?: boolean;
    onLine?: boolean;
    screenWidth?: number;
    screenHeight?: number;
    windowWidth?: number;
    windowHeight?: number;
    devicePixelRatio?: number;
  }>({});

  useEffect(() => {
    // Check current theme
    if (typeof window !== 'undefined') {
      setIsDarkMode(document.documentElement.classList.contains('dark'));
    }

    // Get device information
    if (typeof window !== 'undefined' && navigator) {
      setDeviceInfo({
        userAgent: navigator.userAgent,
        platform: navigator.platform,
        language: navigator.language,
        cookieEnabled: navigator.cookieEnabled,
        onLine: navigator.onLine,
        screenWidth: window.screen.width,
        screenHeight: window.screen.height,
        windowWidth: window.innerWidth,
        windowHeight: window.innerHeight,
        devicePixelRatio: window.devicePixelRatio,
      });
    }

    // Check notification permission
    if ('Notification' in window) {
      setNotificationsEnabled(Notification.permission === 'granted');
    }
  }, []);

  const toggleDarkMode = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    
    if (typeof window !== 'undefined') {
      if (newMode) {
        document.documentElement.classList.add('dark');
        localStorage.setItem('theme', 'dark');
      } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('theme', 'light');
      }
    }
  };

  const toggleNotifications = async () => {
    if ('Notification' in window) {
      if (Notification.permission === 'granted') {
        setNotificationsEnabled(false);
        // Note: You cannot programmatically revoke notification permission
        alert('Notification permission cannot be revoked programmatically. Please disable in browser settings.');
      } else {
        const permission = await Notification.requestPermission();
        setNotificationsEnabled(permission === 'granted');
      }
    }
  };

  const toggleLocation = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        () => {
          setLocationEnabled(true);
          alert('Location access granted!');
        },
        () => {
          setLocationEnabled(false);
          alert('Location access denied!');
        }
      );
    }
  };

  const clearStorage = () => {
    if (typeof window !== 'undefined') {
      localStorage.clear();
      sessionStorage.clear();
      alert('Storage cleared successfully!');
    }
  };

  const exportData = () => {
    if (typeof window !== 'undefined') {
      const data = {
        settings: {
          darkMode: isDarkMode,
          notifications: notificationsEnabled,
          location: locationEnabled,
        },
        deviceInfo,
        timestamp: new Date().toISOString(),
      };
      
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'app-settings.json';
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">C</span>
              </div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">Capacitor App</h1>
            </Link>
            <Link
              href="/"
              className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              ← Back
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Settings
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
            Configure your app preferences and view device information
          </p>
        </div>

        {/* App Settings */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg mb-8">
          <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
            App Settings
          </h3>
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white">Dark Mode</h4>
                <p className="text-gray-600 dark:text-gray-300">Toggle between light and dark themes</p>
              </div>
              <button
                onClick={toggleDarkMode}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  isDarkMode ? 'bg-blue-600' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    isDarkMode ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white">Notifications</h4>
                <p className="text-gray-600 dark:text-gray-300">Enable push notifications</p>
              </div>
              <button
                onClick={toggleNotifications}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  notificationsEnabled ? 'bg-green-600' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    notificationsEnabled ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white">Location Access</h4>
                <p className="text-gray-600 dark:text-gray-300">Allow app to access your location</p>
              </div>
              <button
                onClick={toggleLocation}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  locationEnabled ? 'bg-green-600' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    locationEnabled ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Device Information */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg mb-8">
          <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
            Device Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
              <div className="text-gray-600 dark:text-gray-400 font-medium">Platform</div>
              <div className="text-gray-900 dark:text-white">{deviceInfo.platform || 'Unknown'}</div>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
              <div className="text-gray-600 dark:text-gray-400 font-medium">Language</div>
              <div className="text-gray-900 dark:text-white">{deviceInfo.language || 'Unknown'}</div>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
              <div className="text-gray-600 dark:text-gray-400 font-medium">Screen Resolution</div>
              <div className="text-gray-900 dark:text-white">
                {deviceInfo.screenWidth} x {deviceInfo.screenHeight}
              </div>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
              <div className="text-gray-600 dark:text-gray-400 font-medium">Window Size</div>
              <div className="text-gray-900 dark:text-white">
                {deviceInfo.windowWidth} x {deviceInfo.windowHeight}
              </div>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
              <div className="text-gray-600 dark:text-gray-400 font-medium">Pixel Ratio</div>
              <div className="text-gray-900 dark:text-white">{deviceInfo.devicePixelRatio || 'Unknown'}</div>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
              <div className="text-gray-600 dark:text-gray-400 font-medium">Online Status</div>
              <div className="text-gray-900 dark:text-white">
                {deviceInfo.onLine ? 'Online' : 'Offline'}
              </div>
            </div>
          </div>
        </div>

        {/* Data Management */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg mb-8">
          <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
            Data Management
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              onClick={clearStorage}
              className="flex items-center space-x-3 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
            >
              <div className="w-10 h-10 bg-red-100 dark:bg-red-900 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </div>
              <div className="text-left">
                <div className="font-medium text-gray-900 dark:text-white">Clear Storage</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Clear all app data</div>
              </div>
            </button>

            <button
              onClick={exportData}
              className="flex items-center space-x-3 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
            >
              <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div className="text-left">
                <div className="font-medium text-gray-900 dark:text-white">Export Data</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Download app settings</div>
              </div>
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="text-center">
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/"
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
            >
              Back to Home
            </Link>
            <Link
              href="/about"
              className="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white font-medium py-3 px-6 rounded-lg transition-colors"
            >
              About
            </Link>
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