// Get token from Clerk and store it
export const getClerkToken = async () => {
  try {
    // If we already have a token, return it
    const existingToken = localStorage.getItem('clerk-user-token');
    
    // For development purposes, return a dummy token if needed
    if (!existingToken) {
      console.log('No existing token, generating placeholder for dev');
      const dummyToken = 'dev_token_placeholder';
      localStorage.setItem('clerk-user-token', dummyToken);
      return dummyToken;
    }
    
    return existingToken;
  } catch (error) {
    console.error('Error getting auth token:', error);
    return null;
  }
};

// Get headers for authenticated API requests
export const getAuthHeaders = (token = null) => {
  const authToken = token || localStorage.getItem('clerk-user-token');
  
  return {
    headers: {
      Authorization: `Bearer ${authToken}`,
      'Content-Type': 'application/json'
    }
  };
};

// Clear auth token when user logs out
export const clearAuthToken = () => {
  localStorage.removeItem('clerk-user-token');
}; 