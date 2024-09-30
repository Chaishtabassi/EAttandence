import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const base_url = "https://hrm-api.jithvar.com/api/";

export const isValidToken = async () => {
  try {
    const token = await AsyncStorage.getItem('authToken');
    if (!token) {
      console.log('Token not found');
      return false;
    }
    console.log('Token found:', token);
    return true;
  } catch (error) {
    console.error('Token validation error:', error);
    return false;
  }
};

/**
 * @param {string} email 
 * @param {string} password 
 */
export const login = async (email, password) => {
  try {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const body = JSON.stringify({
      email: email,
      password: password,
    });

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: body,
      redirect: "follow",
    };

    const response = await fetch(`${base_url}v1/auth/login`, requestOptions);

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP error! Status: ${response.status} - ${errorText}`);
    }

    const result = await response.json();
    console.log('Login Result:', result);

    if (result && result.data && result.data.token) {
      await AsyncStorage.setItem('authToken', result.data.token);
      console.log('Token saved successfully:', result.data.token);
    } else {
      throw new Error('No valid token received from server');
    }

    return result;
  } catch (error) {
    console.error('Login Error:', error);
    throw error;
  }
};

/**
 * @param {string} imageUri 
 * @returns {Promise<string>} 
 */
export const uploadImageToS3 = async (imageUri) => {
    try {
        const token = await AsyncStorage.getItem('authToken');
        if (!token) {
          throw new Error('Authentication token not found');
        }
    
        const formdata = new FormData();
        formdata.append("files", {
          uri: imageUri,
          type: 'image/jpeg',
          name: 'punchImage.jpg',
        });
    
        const response = await axios.post("https://hrm-api.jithvar.com/api/v1/upload-files/file/s3", formdata, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data', 
          },
        });
    
        console.log('Success:', response.data);
    
        return response.data.fileUrl; 
      } catch (error) {
        console.error('Upload Error:', error);
        throw error;
      }
};

