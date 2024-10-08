export const refreshAccessToken = async () => {
    const refreshToken = localStorage.getItem('refresh_token');
    if (!refreshToken) return null; 

    try {
        const response = await fetch('http://127.0.0.1:8000/api/token/refresh/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ refresh: refreshToken }),
        });

        if (response.ok) {
            const data = await response.json();
            localStorage.setItem('access_token', data.access); 
            return data.access; 
        } else {
            console.error('Failed to refresh access token');
            localStorage.removeItem('access_token'); 
            localStorage.removeItem('refresh_token'); 
            return null; 
        }
    } catch (error) {
        console.error('Error refreshing access token:', error);
        return null; 
    }
};