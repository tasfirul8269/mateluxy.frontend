// Create API URL constant
const API_URL = `${import.meta.env.VITE_API_URL}/api`;

// Property API functions using fetch instead of axios
const propertyApi = {
  // Get all properties
  getProperties: async () => {
    try {
      const response = await fetch(`${API_URL}/properties`);
      if (!response.ok) {
        throw new Error('Failed to fetch properties');
      }
      return response.json();
    } catch (error) {
      console.error('Error fetching properties:', error);
      throw error;
    }
  },

  // Get single property by ID
  getPropertyById: async (id) => {
    try {
      const response = await fetch(`${API_URL}/properties/${id}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch property with id ${id}`);
      }
      return response.json();
    } catch (error) {
      console.error(`Error fetching property with id ${id}:`, error);
      throw error;
    }
  },

  // Create new property
  createProperty: async (propertyData) => {
    try {
      const response = await fetch(`${API_URL}/properties/add-property`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(propertyData),
      });

      if (!response.ok) {
        throw new Error('Failed to create property');
      }

      return response.json();
    } catch (error) {
      console.error('Error creating property:', error);
      throw error;
    }
  },

  // Update property
  updateProperty: async (id, propertyData) => {
    try {
      const response = await fetch(`${API_URL}/properties/update-property/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(propertyData),
      });

      if (!response.ok) {
        throw new Error(`Failed to update property with id ${id}`);
      }

      return response.json();
    } catch (error) {
      console.error(`Error updating property with id ${id}:`, error);
      throw error;
    }
  },

  // Delete property
  deleteProperty: async (id) => {
    try {
      const response = await fetch(`${API_URL}/properties/delete-property/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error(`Failed to delete property with id ${id}`);
      }

      return response.json();
    } catch (error) {
      console.error(`Error deleting property with id ${id}:`, error);
      throw error;
    }
  },
};

// Export API URL for convenience
const apiUrl = API_URL;

export { propertyApi, apiUrl };