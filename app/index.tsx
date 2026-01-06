import { useRouter } from 'expo-router';
import * as Linking from 'expo-linking'; // Necesario para volver a la app
import * as WebBrowser from 'expo-web-browser'; // Necesario para abrir Chrome/Safari
import React from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { supabase } from '../src/services/supabase';

// Esto le dice a AuthSession que maneje la redirección
WebBrowser.maybeCompleteAuthSession();

export default function LoginScreen() {
  const router = useRouter();
  async function signInWithGoogle() {
    try {
      // 1. Iniciar el proceso de OAuth
      // Esto genera una URL especial de Supabase que redirige a Google
      const redirectUrl = Linking.createURL('/auth/callback'); 
      
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: redirectUrl, // Le decimos a Supabase: "Cuando termine Google, vuelve aquí"
        },
      });

      if (error) throw error;

      // 2. Abrir el navegador del celular con esa URL
      if (data.url) {
        const result = await WebBrowser.openAuthSessionAsync(data.url, redirectUrl);
        
        // Si el usuario cerró el navegador o terminó
        if (result.type === 'success') {
            // Aquí hay un truco: Supabase a veces maneja la sesión automáticamente
            // al volver, pero idealmente deberíamos capturar el token de la URL.
            // Para Expo Go simple, a veces basta con verificar la sesión:
            const { data: { session } } = await supabase.auth.getSession();
            if (session) {
                Alert.alert("¡Éxito!", "Bienvenido con Google 🚀");
            }
        }
      }
    } catch (error) {
      Alert.alert("Error", error instanceof Error ? error.message : "Error desconocido");
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.logo}>PLAID LABS 🚀</Text> 
      <Text style={styles.subtitle}>miFacu Mobile</Text>

      {/* Botón de Google */}
      <TouchableOpacity style={styles.googleButton} onPress={signInWithGoogle}>
        <Text style={styles.googleButtonText}>INGRESAR CON GOOGLE</Text>
      </TouchableOpacity>

      {/* BOTÓN TEMPORAL DE DESARROLLO */}
      <TouchableOpacity
        style={{ marginTop: 20, padding: 10 }}
        onPress={() => router.push('/home')}
      >
        <Text style={{ color: 'yellow', textAlign: 'center' }}>
          🚧 Entrar como Invitado (DEV)
        </Text>
      </TouchableOpacity>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, backgroundColor: '#000', alignItems: 'center', justifyContent: 'center', padding: 20,
  },
  logo: {
    color: '#fff', fontSize: 32, fontWeight: 'bold', marginBottom: 10,
  },
  subtitle: {
    color: '#aaa', fontSize: 18, marginBottom: 50,
  },
  googleButton: {
    backgroundColor: '#fff', // Blanco como Google
    width: '100%',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 10,
  },
  googleButtonText: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 16,
  },
});