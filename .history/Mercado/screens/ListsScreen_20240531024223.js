import React, { useState, useEffect, useRef } from 'react';
import { View, Text, FlatList, TouchableOpacity, Modal, StyleSheet, Animated } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { formatCurrency } from "react-native-format-currency";

const ListsScreen = () => {
  const [lists, setLists] = useState([]);
  const [selectedList, setSelectedList] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loadLists = async () => {
      const storedLists = await AsyncStorage.getItem('savedLists');
      if (storedLists) {
        setLists(JSON.parse(storedLists));
      }
    };
    loadLists();

    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, []);

  const openList = (list) => {
    setSelectedList(list);
    setModalVisible(true);
  };

  const formatPrice = (value) => {
    const [formattedValue] = formatCurrency({ amount: value, code: "BRL" });
    return formattedValue;
  };

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <FlatList
        data={lists}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => openList(item)} style={styles.listItem}>
            <Text style={styles.listItemText}>Lista {item.id}</Text>
            <Text style={styles.listItemText}>Total: {formatPrice(item.total)}</Text>
          </TouchableOpacity>
        )}
      />
      {selectedList && (
        <Modal visible={modalVisible} animationType="slide">
          <View style={styles.modalContainer}>
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
          </View>
        </Modal>
      )}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000', // Cor de fundo preto
    padding: 16,
  },
  listItem: {
    padding: 16,
    borderBottomColor: '#FFD700', // Borda amarela
    borderBottomWidth: 1,
    backgroundColor: '#333', // Fundo cinza escuro
    borderRadius: 8, // Bordas arredondadas
    marginVertical: 5,
  },
  listItemText: {
    fontSize: 16,
    color: '#fff', // Texto branco
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    padding: 16,
    backgroundColor: '#222', // Fundo escuro
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
    color: '#FFD700', // Cor amarela
  },
  modalTotal: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
    color: '#FFD700', // Cor amarela
  },
  productItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomColor: '#FFD700', // Borda amarela
    borderBottomWidth: 1,
    borderRadius: 8, // Bordas arredondadas
  },
  productName: {
    fontSize: 16,
    color: '#fff', // Texto branco
    fontWeight: 'bold',
  },
  productPrice: {
    fontSize: 16,
    color: '#FFD700', // Texto amarelo
    fontWeight: 'bold',
  },
  button: {
    backgroundColor: '#FFD700', // Cor amarela
    padding: 12,
    borderRadius: 8, // Bordas arredondadas
    alignItems: 'center',
    marginTop: 16,
  },
  buttonText: {
    color: '#000', // Texto preto
    fontWeight: 'bold',
  },
});

export default ListsScreen;
