import React, { useState, useEffect, useRef } from 'react';
import { View, Text, FlatList, TouchableOpacity, Modal, StyleSheet, Animated } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { formatCurrency } from "react-native-format-currency";
import { bounceIn } from 'react-native-animatable';

const ListsScreen = () => {
  const [lists, setLists] = useState([]);
  const [selectedList, setSelectedList] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const modalAnim = useRef(new Animated.Value(0)).current;

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
  };

  const formatPrice = (value) => {
    const [formattedValue] = formatCurrency({ amount: value, code: "BRL" });
    return formattedValue;
  };

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <Text style={styles.title}>Minhas Listas Salvas</Text>
      <FlatList
        data={lists}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => openList(item)} style={styles.listItem} animation="bounceIn">
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
    backgroundColor: '#333', // Fundo cinza escuro
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    paddingTop: 20, // Adicionado paddingTop
    color: '#FFD700', // Cor amarela
    textAlign: 'center', // Centraliza o título
  },
  listItem: {
    padding: 16,
    borderBottomColor: '#FFD700', // Borda amarela
    borderBottomWidth: 1,
    backgroundColor: '#444', // Fundo cinza um pouco mais claro
    borderRadius: 8, // Bordas arredondadas
    marginVertical: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  listItemText: {
    fontSize: 16,
    color: '#fff', // Texto branco
    fontWeight: 'bold',
  },
  deleteButton: {
    backgroundColor: '#FFD7', // Cor vermelha
    padding: 8,
    borderRadius: 5, // Bordas arredondadas
  },
  deleteButtonText: {
    color: '#fff', // Texto branco
    fontWeight: 'bold',
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
      modalBackground: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
      },
      modalContainer: {
        width: '80%',
        padding: 16,
        backgroundColor: '#333', // Fundo escuro
        borderRadius: 8, // Bordas arredondadas
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
    });
    
    export default ListsScreen;
    