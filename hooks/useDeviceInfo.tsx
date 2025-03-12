import { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

const useDeviceInfo = () => {
  // State to store device token, device name, and browser name
  const [deviceInfo, setDeviceInfo] = useState({ deviceToken: '', deviceName: '', browserName: '' });

  useEffect(() => {
    const getDeviceInfo = () => {
      // Generate a unique device token
      let deviceToken = '';
      if (typeof window !== "undefined") {
        deviceToken = localStorage.getItem('deviceToken') || uuidv4(); // Create a new UUID if it doesn't exist
        if (!localStorage.getItem('deviceToken')) {
          localStorage.setItem('deviceToken', deviceToken); // Store the token in localStorage
        }
      }

      // Retrieve platform and user agent information
      const platform = navigator.platform || "Unknown Platform";
      const userAgent = navigator.userAgent || "Unknown User Agent";
      const screenResolution = `${screen.width}x${screen.height}`; // Screen resolution
      const creationTime = new Date().toISOString(); // ISO formatted timestamp

      // Determine the browser name from the user agent string
      let browserName = "Unknown";
      if (userAgent.includes("Chrome")) {
        browserName = "Chrome";
      } else if (userAgent.includes("Firefox")) {
        browserName = "Firefox";
      } else if (userAgent.includes("Safari")) {
        browserName = "Safari";
      } else if (userAgent.includes("MSIE") || userAgent.includes("Trident")) {
        browserName = "Internet Explorer"; // For older IE versions
      }

      // Construct device name with multiple attributes
      const deviceName = `Platform: ${platform}, Browser: ${browserName}, Screen: ${screenResolution}, Created: ${creationTime}`;

      return { deviceToken, deviceName, browserName }; // Return the device info
    };

    setDeviceInfo(getDeviceInfo()); // Update state with device info
  }, []); // Empty dependency array to run once on mount

  return deviceInfo; // Return the device info for use in components
};

export default useDeviceInfo;