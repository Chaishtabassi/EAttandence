import React, { useEffect } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import * as Animatable from 'react-native-animatable';
import { useNavigation } from '@react-navigation/native';

const Splashscreen = () => {
  const navigation = useNavigation();

  useEffect(() => {
    setTimeout(() => {
      navigation.replace('Crousal');
    }, 3000); 
  }, []);

  return (
    <View style={styles.container}>
      <Animatable.Image
        animation="zoomIn"
        duration={2000}
        source={require('../Assets/logo.png')}
        style={styles.logo}
        resizeMode="contain"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 200,
    height: 200,
  },
});

export default Splashscreen;
