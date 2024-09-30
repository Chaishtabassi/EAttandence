import React from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity } from 'react-native';

const leaveRequests = [
  {
    id: '1',
    name: 'Robert Fox',
    position: 'Front-end Developer',
    dates: '13 February - 15 February',
    type: 'Full Day',
    days: '3 Days',
  },
  {
    id: '2',
    name: 'Wade Warren',
    position: 'Back-end Developer',
    dates: '9 February - 11 February',
    type: 'Full Day',
    days: '3 Days',
  },
  {
    id: '3',
    name: 'Jane Cooper',
    position: 'Front-end Developer',
    dates: '23 January - 24 January',
    type: 'Full Day',
    days: '2 Days',
  },
];

const LeaveRequest = () => {
  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.name}>{item.name}</Text>
      <Text style={styles.position}>{item.position}</Text>
      <Text style={styles.dates}>{item.dates}</Text>
      <Text style={styles.details}>Category: Casual</Text>
      <Text style={styles.details}>Type: {item.type}</Text>
      <Text style={styles.details}>Apply Days: {item.days}</Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.rejectButton}>
          <Text style={styles.buttonText}>Reject</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.approveButton}>
          <Text style={styles.buttonText}>Approve</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={leaveRequests}
        renderItem={renderItem}
        keyExtractor={item => item.id}
      />
    </View>
  );
};

export default LeaveRequest;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9F9F9',
    padding: 10,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  position: {
    fontSize: 14,
    color: '#6B6B6B',
  },
  dates: {
    fontSize: 16,
    color: '#333',
  },
  details: {
    fontSize: 14,
    color: '#333',
    marginVertical: 2,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  rejectButton: {
    backgroundColor: '#FF4D4D',
    borderRadius: 5,
    padding: 10,
    width: '48%',
    alignItems: 'center',
  },
  approveButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 5,
    padding: 10,
    width: '48%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
});
