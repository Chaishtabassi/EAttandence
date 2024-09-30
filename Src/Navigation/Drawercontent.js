import React, { useState } from 'react';
import {
    View,
    Image,
    TouchableOpacity,
    StyleSheet,
    Text,
} from 'react-native';
import { DrawerContentScrollView } from '@react-navigation/drawer';
import { useNavigation } from '@react-navigation/native';
import Entypo from 'react-native-vector-icons/Entypo';

const Drawercontent = props => {
    const navigation = useNavigation();

    return (
        <DrawerContentScrollView {...props}>
            <View style={styles.drawerHeader}>
                <Image
                    style={styles.logo}
                    resizeMode="contain"
                    source={require('../Assets/logo.png')}
                />
            </View>

            <TouchableOpacity
                style={styles.drawerItemsingle}
                onPress={() => navigation.navigate('Dashboard')}>
                <Entypo name="home" size={20} color="#333" style={styles.icon} />
                <Text style={styles.label}>Dashboard</Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={styles.drawerItemsingle}
                onPress={() => navigation.navigate('Leave Request')}>
                <Entypo name="home" size={20} color="#333" style={styles.icon} />
                <Text style={styles.label}>Leave Request</Text>
            </TouchableOpacity>

        </DrawerContentScrollView>
    );
};

const styles = StyleSheet.create({
    drawerHeader: {
        height: 140,
        alignItems: 'center',
        justifyContent: 'center',
    },
    logo: {
        height: '100%',
        width: '90%',
        alignSelf: 'center',
    },
    drawerItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 10,
    },
    drawerItemsingle: {
        flexDirection: 'row',
        padding: 10,
    },
    drawerItem1: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    icon: {
        marginRight: 10,
    },
    label: {
        fontSize: 16,
        marginLeft: 10,
        color: '#000',
    },
});

export default Drawercontent;
