const API_BASE_URL = 'https://students.netoservices.ru/fe-diplom';

async function request(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: `Request failed with status ${response.status}` }));
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }
    return response.json();
  } catch (error) {
    console.error(`API call to ${endpoint} failed:`, error);
    throw error;
  }
}

export const fetchCities = (name) => request(`/routes/cities?name=${name}`);

export const fetchRoutes = (params) => {
  const filteredParams = Object.fromEntries(Object.entries(params).filter(([, value]) => value !== null && value !== ''));
  const queryString = new URLSearchParams(filteredParams).toString();
  return request(`/routes?${queryString}`);
};

export const fetchSeats = (id, params) => {
  const queryString = new URLSearchParams(params).toString();
  return request(`/routes/${id}/seats?${queryString}`);
};

export const postOrder = (data) => request('/order', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(data),
});

export const subscribe = (email) => request('/subscribe?email=' + email, {
  method: 'POST',
});