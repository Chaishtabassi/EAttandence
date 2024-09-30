import React, { useContext, useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Geolocation from 'react-native-geolocation-service';
import haversine from 'haversine';
import moment from 'moment';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { PermissionsAndroid } from 'react-native';

const Homescreen = () => {
  const navigation = useNavigation();
  const [predefinedLocation, setPredefinedLocation] = useState(null);
  const [attendanceDistance, setAttendanceDistance] = useState(0);
  const [isPunchEnabled, setIsPunchEnabled] = useState(false);
  const [isPunchedIn, setIsPunchedIn] = useState(false); 
  const [punchInTime, setPunchInTime] = useState(null); 
  const [elapsedTime, setElapsedTime] = useState('0.0 Hrs');
  const [punchOutTime, setPunchOutTime] = useState(null)
  const [currentLocation, setCurrentLocation] = useState(null);
  const [distanceToPredefinedLocation, setDistanceToPredefinedLocation] = useState(null);
  

  useEffect(() => {
    let timer;
    if (isPunchedIn && punchInTime) {
      timer = setInterval(() => {
        const now = moment();
        const duration = moment.duration(now.diff(punchInTime));
        const hours = (duration.asHours()).toFixed(1);
        setElapsedTime(`${hours} Hrs`);
      }, 1000); 
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isPunchedIn, punchInTime]);

  useEffect(() => {
    const getLoginData = async () => {
        const geoLocation = await AsyncStorage.getItem('geoLocation');
        const distance = await AsyncStorage.getItem('attendanceDistance');
        if (geoLocation) {
            const parsedLocation = JSON.parse(geoLocation);
            setPredefinedLocation(parsedLocation);
        }
        if (distance) {
            setAttendanceDistance(parseInt(distance, 10));
        }

        const savedPunchInTime = await AsyncStorage.getItem('punchInTime');
        const savedPunchOutTime = await AsyncStorage.getItem('punchOutTime');
        if (savedPunchInTime) {
            setPunchInTime(new Date(savedPunchInTime)); 
            setIsPunchedIn(true); 
        }
        if (savedPunchOutTime) {
            setPunchOutTime(new Date(savedPunchOutTime));
        }
    };

    getLoginData();
}, []);


  const requestLocationPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Location Permission',
          message: 'This app needs access to your location to track attendance.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        }
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch (err) {
      console.warn(err);
      return false;
    }
  };

useEffect(() => {
  const checkLocationPermission = async () => {
    const hasPermission = await requestLocationPermission();
    if (hasPermission && predefinedLocation && attendanceDistance > 0) {
      Geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const currentLoc = { latitude, longitude };
          setCurrentLocation(currentLoc); 
      
          const formattedPredefinedLocation = {
            latitude: predefinedLocation.lat,
            longitude: predefinedLocation.lng,
          };
      
          if (
            typeof formattedPredefinedLocation.latitude === 'number' &&
            typeof formattedPredefinedLocation.longitude === 'number' &&
            typeof currentLoc.latitude === 'number' &&
            typeof currentLoc.longitude === 'number'
          ) {
            const distance = haversine(formattedPredefinedLocation, currentLoc, { unit: 'meter' });
            setDistanceToPredefinedLocation(distance);
            console.log('Distance to Predefined Location:', distance);
            Alert.alert('Distance Info', `Distance to Predefined Location: ${distance.toFixed(2)} meters`);
            
            if (distance <= attendanceDistance) {
              setIsPunchEnabled(true); 
            } else {
              setIsPunchEnabled(false); 
              Alert.alert('Location Error', 'You are too far from your office to punch in.'); 
            }
          } else {
            console.log('Invalid coordinates for distance calculation.');
          }
        },
        (error) => {
          console.log(error);
          Alert.alert('Location Error', 'Unable to retrieve your location. Please enable location services.');
        },
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
      );
    }
  };

  checkLocationPermission();
}, [predefinedLocation, attendanceDistance]);


  const handlePunch = async () => {
    if (!predefinedLocation) {
        Alert.alert('Error', 'Predefined location not available.');
        return;
    }

    if (!isPunchEnabled) {
        Alert.alert('Location Error', 'You are too far from the attendance location to punch in.');
        return;
    }

    const currentTime = new Date();

    if (!isPunchedIn) {
        setPunchInTime(currentTime);
        await AsyncStorage.setItem('punchInTime', currentTime.toString()); 
        setIsPunchedIn(true);
        navigation.navigate('Camera', { punchType: 'In' });
    } else {
        setPunchOutTime(currentTime); 
        await AsyncStorage.setItem('punchOutTime', currentTime.toString()); 
        setIsPunchedIn(false);
        navigation.navigate('Camera', { punchType: 'Out' });
    }
};

  const Navigateleave = () => {
    navigation.navigate('Leave');
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.headerback}></View>
      <View style={styles.header}>
        <Text style={styles.date}>{moment().format('DD-MM-YYYY')}</Text>
        <View style={styles.punchRow}>
          <View style={styles.punchDetails}>
            <View>
              <Text style={styles.label}>Punch In :</Text>
              <Text style={styles.value}>
                {punchInTime ? moment(punchInTime).format('hh:mm a') : '--/--'}
              </Text>
            </View>
            <View>
              <Text style={styles.label}>Punch Out :</Text>
              <Text style={styles.value}>
              {punchOutTime ? moment(punchOutTime).format('hh:mm a') : '--/--'}
              </Text>
            </View>
          </View>

          <View style={styles.circularProgress}>
            <Text style={styles.hours}>{elapsedTime}</Text>
          </View>
        </View>
        <TouchableOpacity
          style={[styles.punchButton, !isPunchEnabled && styles.disabledButton]}
          onPress={handlePunch}
          disabled={!isPunchEnabled}
        >
          <Text style={styles.punchButtonText}>{isPunchedIn ? 'Punch Out' : 'Punch In'}</Text>
        </TouchableOpacity>

      </View>

      <View style={styles.gridContainer}>
        <TouchableOpacity style={styles.gridItem}>
          <Image source={require('../Assets/Attendeance.png')} style={styles.icon} />
          <Text style={styles.gridText}>My Attendance</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.gridItem}>
          <Image source={require('../Assets/Leave.png')} style={styles.icon} />
          <Text style={styles.gridText}>My Leaves</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.gridItem} onPress={Navigateleave}>
          <Image source={require('../Assets/Attendeance.png')} style={styles.icon} />
          <Text style={styles.gridText}>Leave Requests</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.locationInfo}>
      {predefinedLocation && currentLocation && distanceToPredefinedLocation !== null && (
        <>
          <Text style={styles.locationLabel}>Predefined Location:</Text>
          <Text style={styles.locationValue}>
            ({predefinedLocation.lat}, {predefinedLocation.lng})
          </Text>
          <Text style={styles.locationLabel}>Current Location:</Text>
          <Text style={styles.locationValue}>
            ({currentLocation.latitude}, {currentLocation.longitude})
          </Text>
          <Text style={styles.locationLabel}>Distance to Predefined Location:</Text>
          <Text style={styles.locationValue}>
            {distanceToPredefinedLocation.toFixed(2)} meters
          </Text>
        </>
      )}
    </View>


      <View style={{ height: 100 }}></View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f7f6',
  },
  headerback: {
    backgroundColor: '#e67309',
    width: '100%',
    height: '20%',
    position: 'absolute',
    top: 0,
    zIndex: 1,
  },
  header: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 10,
    height: '28%',
    margin: 10, marginTop: '10%',
    zIndex: 2,
    elevation: 3,
  },
  date: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  punchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  punchDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 200
  },
  label: {
    fontSize: 16,
    color: '#333',
  },
  value: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  circularProgress: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#e6f2e9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  hours: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  punchButton: {
    backgroundColor: '#e67309',
    paddingVertical: 7,
    borderRadius: 25,
    alignItems: 'center',
    width: '80%',
  },
  punchButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    padding: 10
  },
  disabledButton: {
    backgroundColor: '#ccc', 
  },
  gridItem: {
    backgroundColor: '#fff',
    width: '48%',
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
    alignItems: 'center',
  },
  icon: {
    width: 50,
    height: 50,
    marginBottom: 10,
  },
  gridText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
});

export default Homescreen;
