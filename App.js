import React, { useState, useEffect } from 'react';
import {
  TouchableOpacity,
  Alert,
  TextInput,
  Button,
  TouchableWithoutFeedback,
  Keyboard,
  TouchableHighlight,
  Modal,
  View,
  Text,
  Image,
  SectionList,
  Switch,
  StyleSheet,
  ScrollView,
  FlatList,
  Animated,
} from 'react-native';

const App = () => {
  // State for AQI data
  const [aqiData, setAqiData] = useState([
    { id: '1', city: 'Kathmandu', aqi: 158, status: 'Unhealthy', color: '#FF5252' },
    { id: '2', city: 'Pokhara', aqi: 65, status: 'Moderate', color: '#FFBF00' },
    { id: '3', city: 'Lalitpur', aqi: 42, status: 'Good', color: '#7BBD00' },
    { id: '4', city: 'Bhaktapur', aqi: 92, status: 'Moderate', color: '#FFBF00' },
    { id: '5', city: 'Biratnagar', aqi: 120, status: 'Unhealthy for Sensitive Groups', color: '#FF9E01' },
  ]);

  // State for modal visibility
  const [modalVisible, setModalVisible] = useState(false);
  
  // State for search query
  const [searchQuery, setSearchQuery] = useState('');
  
  // State for new city entry
  const [newCity, setNewCity] = useState('');
  const [newAqi, setNewAqi] = useState('');
  
  // State for dark mode
  const [darkMode, setDarkMode] = useState(false);
  
  // Animation value for header
  const headerAnimation = new Animated.Value(0);

  // Animate header on component mount
  useEffect(() => {
    Animated.timing(headerAnimation, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, []);

  // Function to determine status and color based on AQI value
  const getAqiInfo = (value) => {
    const numValue = Number(value);
    if (numValue <= 50) {
      return { status: 'Good', color: '#7BBD00' };
    } else if (numValue <= 100) {
      return { status: 'Moderate', color: '#FFBF00' };
    } else if (numValue <= 150) {
      return { status: 'Unhealthy for Sensitive Groups', color: '#FF9E01' };
    } else if (numValue <= 200) {
      return { status: 'Unhealthy', color: '#FF5252' };
    } else if (numValue <= 300) {
      return { status: 'Very Unhealthy', color: '#8F3F97' };
    } else {
      return { status: 'Hazardous', color: '#7E0023' };
    }
  };

  // Function to add new city
  const addCity = () => {
    if (newCity && newAqi && !isNaN(Number(newAqi))) {
      const { status, color } = getAqiInfo(newAqi);
      const newCityData = {
        id: String(aqiData.length + 1),
        city: newCity,
        aqi: Number(newAqi),
        status: status,
        color: color,
      };
      
      setAqiData([...aqiData, newCityData]);
      setNewCity('');
      setNewAqi('');
      setModalVisible(false);
      
      Alert.alert('Success', `${newCity} has been added to the list.`);
    } else {
      Alert.alert('Error', 'Please enter a valid city name and AQI value.');
    }
  };

  // Filter cities based on search query
  const filteredData = aqiData.filter(item => 
    item.city.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Render item for FlatList
  const renderItem = ({ item }) => (
    <TouchableHighlight
      onPress={() => Alert.alert(item.city, `AQI: ${item.aqi}\nStatus: ${item.status}`)}
      underlayColor="#DDDDDD"
    >
      <View style={[styles.itemContainer, { backgroundColor: darkMode ? '#333' : '#fff' }]}>
        <View style={[styles.aqiCircle, { backgroundColor: item.color }]}>
          <Text style={styles.aqiText}>{item.aqi}</Text>
        </View>
        <View style={styles.itemInfo}>
          <Text style={[styles.cityName, { color: darkMode ? '#fff' : '#000' }]}>{item.city}</Text>
          <Text style={[styles.statusText, { color: item.color }]}>{item.status}</Text>
        </View>
      </View>
    </TouchableHighlight>
  );

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={[styles.container, { backgroundColor: darkMode ? '#121212' : '#f5f5f5' }]}>
        {/* Header */}
        <Animated.View style={[
          styles.header,
          { 
            backgroundColor: darkMode ? '#222' : '#4169E1',
            opacity: headerAnimation,
            transform: [{ translateY: headerAnimation.interpolate({
              inputRange: [0, 1],
              outputRange: [-50, 0]
            })}]
          }
        ]}>
          <Text style={styles.headerText}>Air Quality Index</Text>
          <View style={styles.headerRight}>
            <Text style={styles.darkModeText}>Dark</Text>
            <Switch
              value={darkMode}
              onValueChange={() => setDarkMode(!darkMode)}
              trackColor={{ false: "#767577", true: "#4169E1" }}
              thumbColor={darkMode ? "#fff" : "#f4f3f4"}
            />
          </View>
        </Animated.View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <TextInput
            style={[styles.searchInput, { backgroundColor: darkMode ? '#333' : '#fff', color: darkMode ? '#fff' : '#000' }]}
            placeholder="Search cities..."
            placeholderTextColor={darkMode ? '#aaa' : '#888'}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        {/* AQI Scale */}
        <ScrollView horizontal style={styles.scaleContainer}>
          <View style={[styles.scaleItem, { backgroundColor: '#7BBD00' }]}>
            <Text style={styles.scaleText}>0-50</Text>
            <Text style={styles.scaleDesc}>Good</Text>
          </View>
          <View style={[styles.scaleItem, { backgroundColor: '#FFBF00' }]}>
            <Text style={styles.scaleText}>51-100</Text>
            <Text style={styles.scaleDesc}>Moderate</Text>
          </View>
          <View style={[styles.scaleItem, { backgroundColor: '#FF9E01' }]}>
            <Text style={styles.scaleText}>101-150</Text>
            <Text style={styles.scaleDesc}>Sensitive</Text>
          </View>
          <View style={[styles.scaleItem, { backgroundColor: '#FF5252' }]}>
            <Text style={styles.scaleText}>151-200</Text>
            <Text style={styles.scaleDesc}>Unhealthy</Text>
          </View>
          <View style={[styles.scaleItem, { backgroundColor: '#8F3F97' }]}>
            <Text style={styles.scaleText}>201-300</Text>
            <Text style={styles.scaleDesc}>Very Unhealthy</Text>
          </View>
          <View style={[styles.scaleItem, { backgroundColor: '#7E0023' }]}>
            <Text style={styles.scaleText}>300+</Text>
            <Text style={styles.scaleDesc}>Hazardous</Text>
          </View>
        </ScrollView>

        {/* City List */}
        <FlatList
          data={filteredData}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          style={styles.list}
          contentContainerStyle={styles.listContent}
        />

        {/* Add City Button */}
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setModalVisible(true)}
        >
          <Text style={styles.addButtonText}>+</Text>
        </TouchableOpacity>

        {/* Modal for adding new city */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={[styles.modalContent, { backgroundColor: darkMode ? '#333' : '#fff' }]}>
              <Text style={[styles.modalTitle, { color: darkMode ? '#fff' : '#000' }]}>Add New City</Text>
              
              <TextInput
                style={[styles.input, { backgroundColor: darkMode ? '#444' : '#f0f0f0', color: darkMode ? '#fff' : '#000' }]}
                placeholder="City Name"
                placeholderTextColor={darkMode ? '#aaa' : '#888'}
                value={newCity}
                onChangeText={setNewCity}
              />
              
              <TextInput
                style={[styles.input, { backgroundColor: darkMode ? '#444' : '#f0f0f0', color: darkMode ? '#fff' : '#000' }]}
                placeholder="AQI Value"
                placeholderTextColor={darkMode ? '#aaa' : '#888'}
                keyboardType="numeric"
                value={newAqi}
                onChangeText={setNewAqi}
              />
              
              <View style={styles.modalButtons}>
                <Button
                  title="Cancel"
                  onPress={() => setModalVisible(false)}
                  color="#FF5252"
                />
                <Button
                  title="Add"
                  onPress={addCity}
                  color="#4169E1"
                />
              </View>
            </View>
          </View>
        </Modal>

        {/* Footer */}
        <View style={[styles.footer, { backgroundColor: darkMode ? '#222' : '#4169E1' }]}>
          <Text style={styles.footerText}>Developed by Prasidha Nepal</Text>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    height: 60,
    backgroundColor: '#4169E1',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
  },
  headerText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  darkModeText: {
    color: '#fff',
    marginRight: 5,
  },
  searchContainer: {
    padding: 10,
  },
  searchInput: {
    height: 40,
    borderRadius: 20,
    paddingHorizontal: 15,
    backgroundColor: '#fff',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.5,
  },
  scaleContainer: {
    flexDirection: 'row',
    paddingVertical: 10,
    marginBottom: 5,
  },
  scaleItem: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginHorizontal: 5,
    borderRadius: 5,
    minWidth: 70,
    alignItems: 'center',
  },
  scaleText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  scaleDesc: {
    color: '#fff',
    fontSize: 12,
  },
  list: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: 10,
    paddingBottom: 20,
  },
  itemContainer: {
    flexDirection: 'row',
    padding: 15,
    marginVertical: 5,
    borderRadius: 10,
    backgroundColor: '#fff',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.5,
  },
  aqiCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#FF5252',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  aqiText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  itemInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  cityName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  statusText: {
    fontSize: 14,
  },
  addButton: {
    position: 'absolute',
    right: 20,
    bottom: 80,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#4169E1',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 30,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    padding: 20,
    borderRadius: 10,
    backgroundColor: '#fff',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  input: {
    height: 40,
    borderRadius: 5,
    paddingHorizontal: 10,
    backgroundColor: '#f0f0f0',
    marginBottom: 15,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  footer: {
    height: 50,
    backgroundColor: '#4169E1',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerText: {
    color: '#fff',
    fontSize: 14,
  },
});

export default App;