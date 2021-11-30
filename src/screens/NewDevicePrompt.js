import { StatusBar } from 'expo-status-bar';
import React, {useRef, useEffect, useState} from 'react';
import { StyleSheet, Text, View, AppState, Linking, Platform, FlatList, TouchableWithoutFeedback } from 'react-native';
import { Stack, HStack, Center, Box, Progress, Heading, NativeBaseProvider, Icon } from 'native-base';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faHeartbeat, faLungs, faWater, faThermometerThreeQuarters, faRunning, faBed, faBatteryFull, faCog } from '@fortawesome/free-solid-svg-icons'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const devices = [
{
	id: "UUID-1234-1234-1234",
	title: "Test Device 1",
	mac:  "UUID-1234-1234-1234"
},
{
	id: "UUID-1234-1234-1235",
	title: "Test Device 2",
	mac: "UUID-1234-1234-1235"
}];

const PERSISTENCE_KEY = 'APPLICATION_STATE';

const NewDevicePrompt = ({ navigation }) => {
	const renderItem = ({ item }) => <Item title={item.title} mac={item.mac} />;
	const appState = useRef(AppState.currentState);
  	const [isReady, setIsReady] = useState(false);
  	const [currentState, setCurrentState] = useState();
	
	const Item = ({ title, mac }) => (
		<TouchableWithoutFeedback onPress={ () => actionOnRow(mac)}>
			<View style={styles.item}>
				<Text style={styles.title}>{title}</Text>
				<Text style={styles.title_mac}>{mac}</Text>
			</View>
		</TouchableWithoutFeedback>
	);

	function actionOnRow(mac) {
   		console.log('Selected Item Hardware Address:', mac);
   	    if(isReady) {
   	    	var state = currentState;
   	    	state.bleMAC = mac;
   	    	setCurrentState(state);
   	    	AsyncStorage.setItem(PERSISTENCE_KEY, JSON.stringify(state));
   	    	navigation.navigate("Home");
		}
	};

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
  
  }

	return (
		<View backgroundColor="#27272a" style={styles.container}>
			<Stack space={5} alignItems="center">
	      		<HStack space={1} alignItems="center">
					<Text style={styles.text_header}>Please connect to your NVNT Smart Device to get started!</Text>
				</HStack>
				<HStack space={1} alignItems="center" >
					{isReady &&
					<FlatList data={devices} renderItem={renderItem} keyExtractor={item => item.id} />
					}
				</HStack>
			</Stack>
		</View>
		
	);
}


export default NewDevicePrompt;

const styles = StyleSheet.create({
  text_header: {
    alignItems: 'center',
    justifyContent: 'center',
    color: "#fff",
    fontSize: 16,
    padding: 10
  },
  text_center: {
    alignItems: 'center',
    justifyContent: 'center',
    color: "#fff",
  },
  container: {
      flex: 1,
      marginTop: StatusBar.currentHeight || 0,
    },
    item: {
      backgroundColor: '#0284c7',
      padding: 20,
      marginVertical: 8,
      marginHorizontal: 16,
    },
    title: {
      fontSize: 24,
      color: "#fff",
    },
    title_mac: {
      fontSize: 12,
      color: "#fff",
    },
});

