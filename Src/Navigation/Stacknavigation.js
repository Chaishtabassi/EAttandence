import React,{useState,useEffect} from 'react';
import { View,Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { Provider as PaperProvider } from 'react-native-paper';
import Homescreen from '../Screen/Homescreen';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Drawercontent from '../Navigation/Drawercontent'
import CameraScreen from '../Component/CameraScreen';
import { PunchProvider } from '../Component/PunchContext';
import ConfirmScreen from '../Component/ConfirmScreen';
import Splashscreen from '../Authentication/Splashscreen';
import Crousal1 from '../Authentication/Crousal/Crousal1';
import Crousal2 from '../Authentication/Crousal/Crousal2';
import Loginscreen from '../Authentication/Loginscreen';
import ResetPassword from '../Authentication/ResetPassword';
import Crousal3 from '../Authentication/Crousal/Crousal3';
import LeaveRequest from '../Screen/LeaveRequest';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();
const Tab = createBottomTabNavigator();

const DrawerNavigation = () => {
    const [username, setUsername] = useState(''); 

    useEffect(() => {
        const loadUsername = async () => {
            try {
                const storedUsername = await AsyncStorage.getItem('username');
                if (storedUsername !== null) {
                    setUsername(storedUsername); 
                }
            } catch (error) {
                console.error('Error loading username from AsyncStorage', error);
            }
        };

        loadUsername();
    }, []);

    return (
        <Drawer.Navigator drawerContent={() => <Drawercontent />}>
            <Drawer.Screen
                name="Dashboard"
                component={Homescreen}
                options={{
                    headerShown: true,
                    headerStyle: {
                        backgroundColor: '#e67309',
                    },
                    headerTintColor: '#fff',
                    headerTitle: () => (
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            {/* <Ionicons
                                name="menu"
                                size={30}
                                color="#fff"
                                style={{ marginRight: 10 }}
                                onPress={() => navigation.openDrawer()} // This line needs proper navigation context
                            /> */}
                            <View style={{ marginLeft: 10 }}>
                                <Text style={{ color: '#fff', fontSize: 12 }}>Welcome back!</Text>
                                <Text style={{ color: '#fff', fontSize: 20, fontWeight: 'bold' }}>{username}</Text>
                            </View>
                        </View>
                    ),
                    headerLeft: null, // Optionally remove this if you're already handling the left button in headerTitle
                }}
            />
        </Drawer.Navigator>
    );
};


const Stacknavigation = () => {
    return (
        <PunchProvider>
        <NavigationContainer>
            <PaperProvider>
                <Stack.Navigator>
                <Stack.Screen
                        name="Splash"
                        component={Splashscreen}
                        options={{ headerShown: false }}
                    />
                    <Stack.Screen
                        name="Crousal"
                        component={Crousal1}
                        options={{ headerShown: false }}
                    />
                    <Stack.Screen
                        name="Crousal2"
                        component={Crousal2}
                        options={{ headerShown: false }}
                    />  
                    <Stack.Screen
                        name="Crousal3"
                        component={Crousal3}
                        options={{ headerShown: false }}
                    />
                    <Stack.Screen
                        name="Login"
                        component={Loginscreen}
                        options={{ headerShown: false }}
                    />
                    <Stack.Screen
                        name="Reset"
                        component={ResetPassword}
                        options={{ headerShown: false }}
                    />
                    <Stack.Screen
                        name="AppDrawer"
                        component={DrawerNavigation}
                        options={{ headerShown: false }}
                    />
                       <Stack.Screen
                        name="Camera"
                        component={CameraScreen}
                        options={{
                            headerShown: true,
                            headerStyle: { backgroundColor: '#e67309' },
                            headerTintColor: '#fff',
                            headerTitleStyle: { fontWeight: 'bold' },
                        }}
                    />
                            <Stack.Screen
                        name="Confirm"
                        component={ConfirmScreen}
                        options={{
                            headerShown: true,
                            headerStyle: { backgroundColor: '#e67309' },
                            headerTintColor: '#fff',
                            headerTitleStyle: { fontWeight: 'bold' },
                        }}
                    />
                           <Stack.Screen
                        name="Leave"
                        component={LeaveRequest}
                        options={{
                            headerShown: true,
                            headerStyle: { backgroundColor: '#e67309' },
                            headerTintColor: '#fff',
                            headerTitleStyle: { fontWeight: 'bold' },
                        }}
                    />
                </Stack.Navigator>
            </PaperProvider>
        </NavigationContainer>
        </PunchProvider>
    );
};

export default Stacknavigation;
