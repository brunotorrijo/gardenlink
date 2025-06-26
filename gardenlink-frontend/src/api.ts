const API_URL = 'http://localhost:4000/api';

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }),
  };
};

// Health check to verify backend is running
export async function checkBackendHealth() {
  try {
    const res = await fetch(`${API_URL}/health`);
    const data = await res.json();
    console.log('Backend health check:', data);
    return res.ok;
  } catch (error) {
    console.error('Backend health check failed:', error);
    return false;
  }
}

// Auth endpoints
export async function signup(email: string, password: string) {
  const requestBody = { email, password };
  console.log('Signup request:', requestBody);
  
  const res = await fetch(`${API_URL}/auth/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(requestBody),
  });
  
  const data = await res.json();
  console.log('Signup response:', { status: res.status, data });
  
  if (!res.ok) {
    // Handle validation errors with details
    if (data.details && Array.isArray(data.details)) {
      const errorMessages = data.details.map((err: any) => `${err.path.join('.')}: ${err.message}`).join(', ');
      throw new Error(errorMessages);
    }
    throw new Error(data.error || 'Signup failed');
  }
  return data;
}

export async function login(email: string, password: string) {
  const requestBody = { email, password };
  console.log('Login request:', requestBody);
  
  const res = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(requestBody),
  });
  
  const data = await res.json();
  console.log('Login response:', { status: res.status, data });
  
  if (!res.ok) {
    // Handle validation errors with details
    if (data.details && Array.isArray(data.details)) {
      const errorMessages = data.details.map((err: any) => `${err.path.join('.')}: ${err.message}`).join(', ');
      throw new Error(errorMessages);
    }
    throw new Error(data.error || 'Login failed');
  }
  return data;
}

export async function getCurrentUser() {
  const res = await fetch(`${API_URL}/auth/me`, {
    headers: getAuthHeaders(),
  });
  
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Failed to get user data');
  }
  return data;
}

// Helper function to check if user is authenticated
export function isAuthenticated(): boolean {
  return !!localStorage.getItem('token');
}

// Helper function to logout
export function logout(): void {
  localStorage.removeItem('token');
}
