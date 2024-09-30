// ConfirmScreen.js
import React, { useContext } from 'react';
import { View, Image, Button, StyleSheet, Alert } from 'react-native';
import { PunchContext } from './PunchContext';
import { submitPunch } from '../Api/Api';

const ConfirmScreen = ({ route, navigation }) => {
  const { imageUri, punchType } = route.params;
  const { setIsPunchedIn } = useContext(PunchContext);

  const handleConfirm = async () => {
    setIsPunchedIn(punchType === 'Out');
    navigation.navigate('Dashboard');
  };

  const handleRetake = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Image source={{ uri: imageUri }} style={styles.image} />
      <View style={styles.row}>
        <Button title="Confirm" onPress={handleConfirm} />
        <Button title="Retake" onPress={handleRetake} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:'#fff',
    padding: 20,
  },
  image: {
    width: '100%',
    height: '80%',
    marginBottom: 20,
  },
  row:{
    flexDirection:'row',
    justifyContent:'space-between'
  }
});

export default ConfirmScreen;
