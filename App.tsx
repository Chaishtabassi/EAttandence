import React, { useEffect } from 'react';
import { StyleSheet, Text, View, Alert } from 'react-native';
import Stacknavigation from './Src/Navigation/Stacknavigation';
import 'react-native-gesture-handler';

const App = () => {
  return (
    <View style={styles.container}>
      <Stacknavigation />
    </View>
  );
};

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
