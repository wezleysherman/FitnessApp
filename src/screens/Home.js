import { StatusBar } from 'expo-status-bar';
import React, {useRef, useEffect, useState} from 'react';
import { StyleSheet, Text, View, AppState, Linking, Platform  } from 'react-native';
import { Stack, HStack, Center, Box, Progress, Heading, NativeBaseProvider, Icon } from 'native-base';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faHeartbeat, faLungs, faWater, faThermometerThreeQuarters, faRunning, faBed, faBatteryFull, faCog } from '@fortawesome/free-solid-svg-icons'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const PERSISTENCE_KEY = 'APPLICATION_STATE';

const Home = ({ navigation }) => {
  const appState = useRef(AppState.currentState);
  const [isReady, setIsReady] = useState(false);
  const [currentState, setCurrentState] = useState();

  useEffect(() => {
    if(!isReady || currentState == undefined) {
      restoreState();
    } else {
      load();
    }
  }, []);

  useEffect(() => {
    load();
  }, [isReady]);

  async function restoreState() {
    try {
      const initialUrl = await Linking.getInitialURL();

      if(Platform.OS !== 'web') {
        const savedStateString = await AsyncStorage.getItem(PERSISTENCE_KEY);
        var state = savedStateString ? JSON.parse(savedStateString): undefined;
        if(state !== undefined) {
          setCurrentState(state);
        } else if(state == undefined) {
          state = {
            bleConnected: false,
            bleMAC: "null"
          };
          setCurrentState(state);
          AsyncStorage.setItem(PERSISTENCE_KEY, JSON.stringify(state));
        }
      }
    } finally {
      setIsReady(true);
    }
  }

  function load() {
    if(isReady) {
      if(currentState.bleConnected == false) {
        if(currentState.bleMAC == "null") {
          console.log("No BLE Device set up.. Please connect to a device");
          navigation.navigate("NewDevice");
        } else {
          console.log("MAC known. Attempting to connect...");
        }
      }
    }
  }

	return (
		<Center
        flex={1}
        bg="dark.100"
        alignItems="center"
        justifyContent="center"
      	>
    
	    <Stack space={5} alignItems="center">
          <HStack space={5} alignItems="center">
            <Center bg="#fb7185" rounded="md" _text={{ color: "white" }} size={175} alignItems="center" shadow={3} justifyContent="center">
              <FontAwesomeIcon icon={faHeartbeat} size={100} color="#fff1f2" />
              <Text style={{ color: "white", fontSize: 20, fontWeight: "bolder" }}>100 BPM</Text>
            </Center>
            <Center bg="#f97316" rounded="md" _text={{ color: "white" }} size={175} alignItems="center" shadow={3} justifyContent="center">
              <FontAwesomeIcon icon={faThermometerThreeQuarters} size={100} color="#ecfccb" />
              <Text style={{ color: "white", fontSize: 20, fontWeight: "bolder" }}>97F</Text>
            </Center>
          </HStack>
          <HStack space={5} alignItems="center">
            <Center bg="#22d3ee" rounded="md" _text={{ color: "white" }} size={175} alignItems="center" shadow={3} justifyContent="center">
              <FontAwesomeIcon icon={faLungs} size={100} color="#cffafe" />
              <Text style={{ color: "white", fontSize: 20, fontWeight: "bolder" }}>98.5%</Text>
            </Center>
            <Center bg="#84cc16" rounded="md" _text={{ color: "white" }} size={175} alignItems="center" shadow={3} justifyContent="center">
              <FontAwesomeIcon icon={faBed} size={100} color="#ecfccb" />
              <Text style={{ color: "white", fontSize: 20, fontWeight: "bolder" }}>Sleep</Text>
            </Center>
          </HStack>
          <HStack space={5} alignItems="center">
            <Center bg="info.300" rounded="md" _text={{ color: "white" }} size={175} alignItems="center" shadow={3} justifyContent="center">
              <FontAwesomeIcon icon={faWater} size={100} color="#fff1f2" />
              <Text style={{ color: "white", fontSize: 20, fontWeight: "bolder" }}>Hydration</Text>
            </Center>
            <Center bg="#8b5cf6" rounded="md" _text={{ color: "white" }} size={175} alignItems="center" shadow={3} justifyContent="center">
              <FontAwesomeIcon icon={faRunning} size={100} color="#ede9fe" />
              <Text style={{ color: "white", fontSize: 20, fontWeight: "bolder" }}>Activity</Text>
            </Center>
          </HStack>
          <HStack space={5} alignItems="center">
            <Center bg="tertiary.600" rounded="md" _text={{ color: "white" }} size={175} alignItems="center" shadow={3} justifyContent="center">
              <FontAwesomeIcon icon={faBatteryFull} size={100} color="#fff1f2" />
              <Text style={{ color: "white", fontSize: 20, fontWeight: "bolder" }}>Battery: 100%</Text>
            </Center>
            <Center bg="muted.600" rounded="md" _text={{ color: "white" }} size={175} alignItems="center" shadow={3} justifyContent="center">
              <FontAwesomeIcon icon={faCog} size={100} color="#ede9fe" />
              <Text style={{ color: "white", fontSize: 20, fontWeight: "bolder" }}>Settings</Text>
            </Center>
          </HStack>
        </Stack>
	    </Center>
	);
}

export default Home;