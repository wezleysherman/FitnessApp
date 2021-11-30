import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View, SafeAreaView, FlatList } from 'react-native';
import { Stack, HStack, Center, Box, Progress, Heading, NativeBaseProvider, Icon } from 'native-base';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'

const devices = [
{
	id: "UUID-1234-1234-1234",
	title: "Test Device 1"
}];

const Item = ({ title }) => (
	<View style={styles.item}>
		<Text style={styles.title}>{title}</Text>
	</View>
)

const DeviceList = () => {
	const renderItem = ({ item }) => <Item title={item.title} />;

	return (
		<Center
	    flex={1}
	    bg="dark.100"
	    alignItems="center"
	    justifyContent="center"
	  	>
	  		<FlatList data={devices} renderItem={renderItem} keyExtractor={item => item.id} />
	  	</Center>
	);
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: StatusBar.currentHeight || 0,
  },
  item: {
    backgroundColor: '#f9c2ff',
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
  },
  title: {
    fontSize: 32,
  },
});

export default DeviceList;