import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, Modal, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ListsScreen = () => {
  const [lists, setLists] = useState([]);
  const [selectedList, setSelectedList] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    const loadLists = async () => {
      const storedLists = await AsyncStorage.getItem('savedLists');
      if (storedLists) {
        setLists(JSON.parse(storedLists));
      }
    };
    loadLists();
  }, []);

  const openList = (list) => {
    setSelectedList(list);
    setModalVisible(true);
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={lists}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => openList(item)} style={styles.listItem}>
            <Text>Lista {item.id}</Text>
            <Text>Total: {item.total}</Text>
          </TouchableOpacity>
        )}
      />
      {selectedList && (
        <Modal visible={modalVisible} animationType="slide">
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Detalhes da Lista</Text>
            <Text>Total: {selectedList.total}</Text>
            <FlatList
              data={selectedList.products}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => (
                <View style={styles.productItem}>
                  <Text>{item.name}</Text>
                  <Text>{item.price}</Text>
                </View>
              )}
            />
            <Button title="Fechar" onPress={() => setModalVisible(false)} />
          </View>
        </Modal>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  listItem: {
    padding: 16,
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
  },
  modalContainer: {
    flex: 1,
    padding: 16,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  productItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
  },
});

export default ListsScreen;
