import React, { useState, useEffect, useRef } from 'react';
import { View, Text, FlatList, TouchableOpacity, Modal, StyleSheet, Animated, TextInput } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FontAwesome } from '@expo/vector-icons';
import { formatCurrency } from "react-native-format-currency";

const ListsScreen = () => {
  const [lists, setLists] = useState([]);
  const [filteredLists, setFilteredLists] = useState([]);
  const [selectedList, setSelectedList] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [searchText, setSearchText] = useState('');
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const modalAnim = useRef(new Animated.Value(0)).current;

  const loadLists = async () => {
    const storedLists = await AsyncStorage.getItem('savedLists');
    if (storedLists) {
      const parsedLists = JSON.parse(storedLists);
      setLists(parsedLists);
      setFilteredLists(parsedLists);
    }
  };

  useEffect(() => {
    loadLists();

    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, []);

  useEffect(() => {
    if (modalVisible) {
      Animated.timing(modalAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start();
    } else {
      modalAnim.setValue(0);
    }
  }, [modalVisible]);

  const openList = (list) => {
    setSelectedList(list);
    setModalVisible(true);
  };

  const deleteList = async (id) => {
    const updatedLists = lists.filter(list => list.id !== id);
    await AsyncStorage.setItem('savedLists', JSON.stringify(updatedLists));
    setLists(updatedLists);
    setFilteredLists(updatedLists);
  };

  const formatPrice = (value) => {
    const [formattedValue] = formatCurrency({ amount: value, code: "BRL" });
    return formattedValue;
  };

  const reloadLists = () => {
    loadLists();
  };

  const handleSearch = (text) => {
    setSearchText(text);
    const filtered = lists.filter(list => list.name.toLowerCase().includes(text.toLowerCase()));
    setFilteredLists(filtered);
  };

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <View style={styles.header}>
        <Text style={styles.title}>Minhas Listas Salvas</Text>
        <TouchableOpacity onPress={reloadLists} style={styles.reloadButton}>
          <FontAwesome name="refresh" size={24} color="#FFD700" />
        </TouchableOpacity>
      </View>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar lista..."
          placeholderTextColor="#888"
          value={searchText}
          onChangeText={handleSearch}
        />
        <Text style={styles.listCount}>{filteredLists.length} listas</Text>
      </View>
      <FlatList
        data={filteredLists}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => openList(item)} style={styles.listItem}>
            <Text style={styles.listItemText}>{item.name}</Text>
            <Text style={styles.listItemText}>Total: {formatPrice(item.total)}</Text>
            <TouchableOpacity onPress={() => deleteList(item.id)} style={styles.deleteButton}>
              <Text style={styles.deleteButtonText}>Excluir</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        )}
      />
      {selectedList && (
        <Modal visible={modalVisible} animationType="fade" transparent={true}>
          <View style={styles.modalBackground}>
            <Animated.View style={[styles.modalContainer, { transform: [{ scale: modalAnim }]}]}>
              <Text style={styles.modalTitle}>Detalhes da Lista</Text>
              <Text style={styles.modalTotal}>Total: {formatPrice(selectedList.total)}</Text>
              <FlatList
                data={selectedList.products}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => (
                  <View style={styles.productItem}>
                    <Text style={styles.productName}>{item.name}</Text>
                    <Text style={styles.productPrice}>{formatPrice(item.price)}</Text>
                  </View>
                )}
              />
              <TouchableOpacity style={styles.button} onPress={() => setModalVisible(false)}>
                <Text style={styles.buttonText}>Fechar</Text>
              </TouchableOpacity>
            </Animated.View>
          </View>
        </Modal>
      )}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#333',
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 40,
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFD700',
  },
  reloadButton: {
    padding: 8,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  searchInput: {
    flex: 1,
    height: 40,
    backgroundColor: '#444',
    borderRadius: 8,
    paddingHorizontal: 10,
    color: '#fff',
  },
  listCount: {
    marginLeft: 10,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFD700',
  },
  listItem: {
    padding: 16,
    borderBottomColor: '#FFD700',
    borderBottomWidth: 2,
    backgroundColor: '#444',
    borderRadius: 8,
    marginVertical: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  listItemText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
  },
  deleteButton: {
    backgroundColor: '#FF0000',
    padding: 8,
    borderRadius: 5,
  },
  deleteButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  productItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomColor: '#FFD700',
    borderBottomWidth: 1,
    borderRadius: 8,
  },
  productName: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
  },
  productPrice: {
    fontSize: 16,
    color: '#FFD700',
    fontWeight: 'bold',
  },
  button: {
    backgroundColor: '#FFD700',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  buttonText: {
    color: '#000',
    fontWeight: 'bold',
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    width: '80%',
    padding: 16,
    backgroundColor: '#333',
    borderRadius: 8,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
    color: '#FFD700',
  },
  modalTotal: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
    color: '#FFD700',
  },
});

export default ListsScreen;
