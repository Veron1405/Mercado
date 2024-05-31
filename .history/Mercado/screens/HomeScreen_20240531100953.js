import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, Animated, Modal } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { formatCurrency } from "react-native-format-currency";
import * as Animatable from 'react-native-animatable';

const HomeScreen = () => {
  const [productName, setProductName] = useState('');
  const [productPrice, setProductPrice] = useState('');
  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [listName, setListName] = useState('');
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  useEffect(() => {
    const loadProducts = async () => {
      const storedProducts = await AsyncStorage.getItem('products');
      if (storedProducts) {
        const parsedProducts = JSON.parse(storedProducts);
        setProducts(parsedProducts);
        calculateTotal(parsedProducts);
      }
    };
    loadProducts();
  }, []);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, [products]);

  const calculateTotal = (products) => {
    const totalValue = products.reduce((acc, product) => acc + parseFloat(product.price), 0);
    setTotal(totalValue);
  };

  const showAlert = (message) => {
    setAlertMessage(message);
    setAlertVisible(true);
  };

  const addProduct = () => {
    if (productName === '' || productPrice === '') {
      showAlert('Por favor, preencha todos os campos');
      return;
    }

    const newProduct = { name: productName, price: parseFloat(productPrice) };
    const updatedProducts = [...products, newProduct];
    setProducts(updatedProducts);
    AsyncStorage.setItem('products', JSON.stringify(updatedProducts));
    calculateTotal(updatedProducts);
    setProductName('');
    setProductPrice('');
  };

  const saveList = async () => {
    if (products.length === 0) {
      showAlert('Adicione produtos antes de salvar a lista');
      return;
    }

    if (listName === '') {
      showAlert('Por favor, dê um nome à lista');
      return;
    }

    const newList = { id: Date.now(), name: listName, total, products };
    const storedLists = await AsyncStorage.getItem('savedLists');
    const lists = storedLists ? JSON.parse(storedLists) : [];
    lists.push(newList);
    await AsyncStorage.setItem('savedLists', JSON.stringify(lists));

    showAlert('Lista salva com sucesso');
    setProducts([]);
    await AsyncStorage.removeItem('products');
    setTotal(0);
    setListName('');
  };

  const clearList = () => {
    setProducts([]);
    setTotal(0);
    setProductName('');
    setProductPrice('');
  };

  const formatPrice = (value) => {
    const [formattedValue] = formatCurrency({ amount: value, code: "BRL" });
    return formattedValue;
  }

  return (
    <Animatable.View animation="bounceIn" style={[styles.container, { opacity: fadeAnim }]}>
      <Animatable.Text animation="bounceIn" style={styles.title}>Lista de Compras</Animatable.Text>
      <Animatable.View animation="bounceIn" style={styles.inputContainer}>
        <TextInput
          placeholder="Nome da Lista"
          placeholderTextColor="#ccc"
          value={listName}
          onChangeText={setListName}
          style={styles.input}
        />
        <TextInput
          placeholder="Nome do Produto"
          placeholderTextColor="#ccc"
          value={productName}
          onChangeText={setProductName}
          style={styles.input}
        />
        <TextInput
          placeholder="Preço do Produto"
          placeholderTextColor="#ccc"
          value={productPrice}
          onChangeText={setProductPrice}
          keyboardType="numeric"
          style={styles.input}
        />
        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.button} onPress={addProduct}>
            <Text style={styles.buttonText}>Adicionar Produto</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={clearList}>
            <Text style={styles.buttonText}>Limpar Lista</Text>
          </TouchableOpacity>
        </View>
      </Animatable.View>
      <FlatList
        data={products}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <Animatable.View animation="bounceIn" style={styles.productItem}>
            <Text style={styles.productText}>{item.name}</Text>
            <Text style={styles.productText}>{formatPrice(item.price)}</Text>
          </Animatable.View>
        )}
      />
      <Animatable.View animation="bounceIn" style={styles.bottomBar}>
        <Text style={styles.totalText}>Total: {formatPrice(total)}</Text>
        <TouchableOpacity style={styles.button2} onPress={saveList}>
          <Text style={styles.buttonText}>Salvar Lista</Text>
        </TouchableOpacity>
      </Animatable.View>

      <Modal
        transparent={true}
        animationType="fade"
        visible={alertVisible}
        onRequestClose={() => setAlertVisible(false)}
      >
        <View style={styles.modalBackground}>
          <View style={styles.alertContainer}>
            <Text style={styles.alertText}>{alertMessage}</Text>
            <TouchableOpacity style={styles.closeButton} onPress={() => setAlertVisible(false)}>
              <Text style={styles.closeButtonText}>Fechar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </Animatable.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#333',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    paddingTop: 40,
    color: '#FFD700',
    textAlign: 'center',
  },
  inputContainer: {
    marginTop: 16,
  },
  input: {
    height: 40,
    borderColor: '#FFD700',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 16,
    paddingHorizontal: 8,
    color: '#fff',
    fontWeight: 'bold',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    flex: 1,
    backgroundColor: '#FFD700',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  button2: {
    backgroundColor: '#FFD700', // Cor amarela
    padding: 12,
    borderRadius: 8, // Bordas arredondadas
    alignItems: 'center',
    marginBottom: 0,
  }
  buttonText: {
    color: '#000',
    fontWeight: 'bold',
  },
  productItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#444',
    borderBottomWidth: 1,
    borderRadius: 8,
  },
  productText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  bottomBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#191919',
    borderTopWidth: 1,
    borderRadius: 8,
  },
  totalText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  alertContainer: {
    width: '80%',
    backgroundColor: '#444',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  alertText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  closeButton: {
    backgroundColor: '#FFD700',
    padding: 10,
    borderRadius: 8,
  },
  closeButtonText: {
    color: '#000',
    fontWeight: 'bold',
  },
});

export default HomeScreen;
