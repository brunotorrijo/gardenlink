const API_URL = 'https://yardconnect-backend.onrender.com/api';

// Debug logging
console.log('Using API URL:', API_URL);

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

// Yard Worker profile endpoints
export async function getMyProfile(token: string) {
  const res = await fetch(`${API_URL}/yardworkers/profile`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to load profile');
  return data;
}

export async function saveMyProfile(token: string, profile: any) {
  const res = await fetch(`${API_URL}/yardworkers/profile`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(profile),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to save profile');
  return data;
}

// Search yard workers with filters
export async function searchYardWorkers(params: {
  location?: string;
  service?: string;
  minPrice?: number;
  maxPrice?: number;
  limit?: number;
  offset?: number;
}) {
  const query = new URLSearchParams();
  if (params.location) query.append('location', params.location);
  if (params.service) query.append('service', params.service);
  if (params.minPrice !== undefined) query.append('minPrice', params.minPrice.toString());
  if (params.maxPrice !== undefined) query.append('maxPrice', params.maxPrice.toString());
  if (params.limit !== undefined) query.append('limit', params.limit.toString());
  if (params.offset !== undefined) query.append('offset', params.offset.toString());
  const res = await fetch(`${API_URL}/yardworkers?${query.toString()}`);
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to search yard workers');
  return data;
}

// Get a public yard worker profile by ID
export async function getYardWorkerProfile(id: string) {
  const res = await fetch(`${API_URL}/yardworkers/${id}`);
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to load profile');
  return data;
}

// Get reviews for a yard worker profile
export async function getYardWorkerReviews(profileId: string) {
  const res = await fetch(`${API_URL}/yardworkers/${profileId}/reviews`);
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to load reviews');
  return data;
}
