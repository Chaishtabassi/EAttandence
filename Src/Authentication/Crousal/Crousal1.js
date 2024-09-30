import React, { useEffect } from 'react';
import { View, Text, Image, Dimensions, TouchableOpacity, StyleSheet, Pressable } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const Crousal1 = ({ navigation }) => {

  const Navigatelogin = () => {
    navigation.navigate('Crousal2')
  };

  useEffect(() => {
    const checkLoginStatus = async () => {
      const token = await AsyncStorage.getItem('userToken');
      if (token) {
        navigation.replace('AppDrawer');
      }
    };
    checkLoginStatus();
  }, []);

  return (
    <View style={styles.container}>
      <View style={[styles.cardContainer]}>
        <View style={styles.imageContainer}>
          <Image
            source={require('../../Assets/Group1.png')}
            style={styles.image}
            resizeMode="contain"
          />
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.title}>Convenient</Text>
          <Text style={styles.description}>Our team of delivery drivers will make sure your orders are picked up on time and promptly delivered to your customers.</Text>
          <View style={styles.dotsContainer}>
            <Text style={styles.dots}>• • •</Text>
          </View>
          <Pressable style={[styles.button]} onPress={Navigatelogin}>
            <Text style={styles.buttonText}>Next</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  cardContainer: {
    // borderRadius: 20,
    height: '100%',
    width: '100%',
    justifyContent: 'flex-end',
    alignItems: 'center',
    // overflow: 'hidden',
  },
  imageContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  image: {
    width: screenWidth * 1,
    height: screenHeight * 0.50,
  },
  textContainer: {
    backgroundColor: '#e67309',
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    paddingHorizontal: 20,
    paddingVertical: 30,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
    marginBottom: 10,
  },
  dotsContainer: {
    marginVertical: 10,
  },
  dots: {
    fontSize: 20,
    color: '#fff',
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 30,
    marginTop: 15,
    backgroundColor:'#fff',
    width:'80%',
    alignItems:'center'
  },
  buttonText: {
    fontSize: 16,
    color: '#e67309',
    fontWeight: 'bold',
  },
  loginText: {
    fontSize: 14,
    color: '#fff',
    marginTop: 15,
    fontWeight: '500'
  },
});

export default Crousal1;
