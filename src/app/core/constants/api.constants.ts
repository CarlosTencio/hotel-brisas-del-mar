export const API_PORTS = {
    MAC_PORT: 5119,
    WINDOWS_PORT: 7075
};

// Change these values based on your environment
export const IS_MAC_ENVIRONMENT = true;
export const USE_HTTPS = false; // Set to false if your backend uses HTTP

// Function to get the current port based on environment
export const getCurrentPort = () => IS_MAC_ENVIRONMENT ? API_PORTS.MAC_PORT : API_PORTS.WINDOWS_PORT;

// Base URL construction with protocol handling
export const getBaseUrl = () => `http${USE_HTTPS ? 's' : ''}://localhost:${getCurrentPort()}/api`; 