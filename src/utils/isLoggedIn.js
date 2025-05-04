// frontend/src/utils/isLoggedIn.js
export const isLoggedIn = async () => {
    try {
      const res = await fetch('http://localhost:3000/api/admin/check-auth', {
        method: 'GET',
        credentials: 'include', // Very important to send cookies
      });
  
      const data = await res.json();
      return data.success;
    } catch (err) {
      return false;
    }
  };
  