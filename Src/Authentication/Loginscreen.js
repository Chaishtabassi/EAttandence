import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { login } from '../Api/Api';
import Toast from 'react-native-toast-message';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Loginscreen = ({ navigation }) => {
  const [username, setUsername] = useState(''); // Updated to username
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const checkLoginStatus = async () => {
      const token = await AsyncStorage.getItem('userToken');
      if (token) {
        navigation.replace('AppDrawer');
      }
    };
    checkLoginStatus();
  }, []);

  const validateUsername = (username) => {
    // Regex to validate email or mobile number
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const mobileRegex = /^[0-9]{10}$/; // Adjust as necessary for your use case
    return emailRegex.test(username) || mobileRegex.test(username);
  };

  const handleLogin = async () => {
    setError('');
  
    if (!username) {
      setError('Username is required');
      return;
    } else if (!validateUsername(username)) {
      setError('Please enter a valid email address or mobile number');
      return;
    }
  
    if (!password) {
      setError('Password is required');
      return;
    } else if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }
  
    try {
      const response = await login(username, password);
      if (response.message === "User Login Successfully") {
        const { token, user } = response.data;
  
        await AsyncStorage.setItem('userToken', token);
        await AsyncStorage.setItem('username', user.name);
        await AsyncStorage.setItem('geoLocation', JSON.stringify(user.geo_location)); 
        await AsyncStorage.setItem('attendanceDistance', user.attendence_distance.toString());
  
        Toast.show({
          text1: 'Login successful!',
          type: 'success',
        });
  
        navigation.replace('AppDrawer');
      }
    } catch (error) {
      console.log(error);
      Toast.show({
        text1: 'Please check your credentials',
        type: 'error',
      });
    }
  };

  const Navigateforgot = () => {
    navigation.navigate('Reset');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.appTitle}>EAttendence App</Text>

      <Image
        source={require('../Assets/vector.png')}
        style={styles.vectorImage}
      />

      <View style={{ top: 40 }}>
        {/* Error Message Display */}
        {error ? (
          <Text style={styles.errorText}>{error}</Text>
        ) : null}

        <View style={styles.inputContainer}>
          <Icon name="at" size={15} color="#000000" style={styles.icon} />
          <TextInput
            style={[styles.input, { color: '#000' }]} 
            value={username}
            onChangeText={setUsername}
            placeholder="Email Address or Mobile Number"
            placeholderTextColor="#A9A9A9"
            keyboardType="default" // Change to default to allow mobile number input
          />
          {username.length > 0 && ( // Show Next button conditionally
            <TouchableOpacity onPress={() => { /* Handle Next */ }}>
              <Text style={styles.nextText}>Next</Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.inputContainer}>
          <Icon name="lock" size={15} color="#000000" style={styles.icon} />
          <TextInput
            style={[styles.input, { color: '#000' }]} 
            value={password}
            onChangeText={setPassword}
            placeholder="Password"
            placeholderTextColor="#A9A9A9"
            secureTextEntry={true} // Correctly hides the password
          />
          <TouchableOpacity onPress={Navigateforgot}>
            <Text style={styles.forgotText}>Forgot?</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
          <Text style={styles.loginButtonText}>Login</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 30,
    paddingVertical: 40,
  },
  appTitle: {
    fontSize: 16,
    fontWeight: '400',
    marginBottom: 40,
    textAlign: 'left',
    color: '#000000',
  },
  vectorImage: {
    width: 250,
    height: 250,
    alignSelf: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 15,
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#000',
  },
  nextText: {
    color: '#e67309',
    fontWeight: '400',
    fontSize: 14,
  },
  forgotText: {
    color: '#e67309',
    fontWeight: '400',
    fontSize: 14,
  },
  loginButton: {
    backgroundColor: '#e67309',
    borderRadius: 30,
    paddingVertical: 11,
    alignItems: 'center',
    marginVertical: 10,
  },
  loginButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '500',
  },
});

export default Loginscreen;
