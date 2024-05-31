import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { formatCurrency } from "react-native-format-currency";

const HomeScreen = () => {
  const [productName, setProductName] = useState('');
  const [productPrice, setProductPrice] = useState('');
  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);

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
    <View style={styles.container}>
      <Text style={styles.title}>Lista de Compras</Text>
      <TextInput
        placeholder="Nome do Produto"
        value={productName}
        onChangeText={setProductName}
        style={styles.input}
      />
      <TextInput
        placeholder="Preço do Produto"
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
            <Text>{item.name}</Text>
            <Text>{formatPrice(item.price)}</Text>
          </View>
        )}
      />
      <View style={styles.bottomBar}>
        <Text>Total: {formatPrice(total)}</Text>
        <Button title="Salvar Lista" onPress={saveList} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 16,
    paddingHorizontal: 8,
  },
  productItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
  },
  bottomBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderTopColor: '#ccc',
    borderTopWidth: 1,
    backgroundColor: '#fff',
  },
});

export default HomeScreen;
