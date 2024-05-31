import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet, Alert, Animated } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { formatCurrency } from "react-native-format-currency";

const HomeScreen = () => {
  const [productName, setProductName] = useState('');
  const [productPrice, setProductPrice] = useState('');
  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const fadeAnim = useRef(new Animated.Value(0)).current;

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

  const addProduct = () => {
    if (productName === '' || productPrice === '') {
      Alert.alert('Erro', 'Por favor, preencha todos os campos');
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
      Alert.alert('Erro', 'Adicione produtos antes de salvar a lista');
      return;
    }

    const newList = { id: Date.now(), total, products };
    const storedLists = await AsyncStorage.getItem('savedLists');
    const lists = storedLists ? JSON.parse(storedLists) : [];
    lists.push(newList);
    await AsyncStorage.setItem('savedLists', JSON.stringify(lists));

    Alert.alert('Sucesso', 'Lista salva com sucesso');
    setProducts([]);
    await AsyncStorage.removeItem('products');
    setTotal(0);
  };

  const formatPrice = (value) => {
    const [formattedValue] = formatCurrency({ amount: value, code: "BRL" });
    return formattedValue;
  }

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <Text style={styles.title}>Lista de Compras</Text>
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
      <Button title="Adicionar Produto" onPress={addProduct} />
      <FlatList
        data={products}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.productItem}>
            <Text style={styles.productText}>{item.name}</Text>
            <Text style={styles.productText}>{formatPrice(item.price)}</Text>
          </View>
        )}
      />
      <View style={styles.bottomBar}>
        <Text style={styles.totalText}>Total: {formatPrice(total)}</Text>
        <Button title="Salvar Lista" onPress={saveList} />
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000', // Cor de fundo preto
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#FFD700', // Cor amarela
  },
  input: {
    height: 40,
    borderColor: '#FFD700', // Borda amarela
    borderWidth: 1,
    marginBottom: 16,
    paddingHorizontal: 8,
    color: '#fff', // Texto branco
    fontWeight: 'bold',
  },
  productItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomColor: '#FFD700', // Borda inferior amarela
    borderBottomWidth: 1,
  },
  productText: {
    color: '#fff', // Texto branco
    fontWeight: 'bold',
  },
  bottomBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderTopColor: '#FFD700', // Borda superior amarela
    borderTopWidth: 1,
  },
  totalText: {
    color: '#fff', // Texto branco
    fontWeight: 'bold',
  },
});

export default HomeScreen;
