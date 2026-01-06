import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function LoginScreen() {
  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <Text style={styles.logo}>PLAID LABS 🚀</Text>
      <Text style={styles.subtitle}>miFacu Mobile</Text>
      
      <TouchableOpacity style={styles.button} onPress={() => alert('Próximamente: Conexión a Supabase')}>
        <Text style={styles.buttonText}>INGRESAR</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    color: '#fff',
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    color: '#aaa',
    fontSize: 18,
    marginBottom: 50,
  },
  button: {
    backgroundColor: '#fff',
    paddingHorizontal: 40,
    paddingVertical: 15,
    borderRadius: 30,
  },
  buttonText: {
    color: '#000',
    fontWeight: 'bold',
  },
});