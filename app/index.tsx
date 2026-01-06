import { useRouter } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import React, { useEffect, useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { supabase } from '../src/services/supabase';

WebBrowser.maybeCompleteAuthSession();

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  // Verificar si ya hay sesión al entrar
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) router.replace('/home');
    });
  }, []);

  async function signInWithEmail() {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (error) Alert.alert("Error", error.message);
    else router.replace('/home'); // Si entra, vamos al Home
    setLoading(false);
  }

  async function signUpWithEmail() {
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email: email,
      password: password,
    });

    if (error) Alert.alert("Error", error.message);
    else Alert.alert("Cuenta creada", "¡Ya puedes iniciar sesión!");
    setLoading(false);
  }

  return (
    <View style={styles.container}>
      <Text style={styles.logo}>PLAID LABS 🚀</Text> 
      <Text style={styles.subtitle}>miFacu Mobile</Text>

      {/* --- FORMULARIO EMAIL --- */}
      <View style={styles.inputContainer}>
        <TextInput 
          style={styles.input} 
          placeholder="Email" 
          placeholderTextColor="#666"
          onChangeText={setEmail}
          value={email}
          autoCapitalize="none"
          keyboardType="email-address"
        />
        <TextInput 
          style={styles.input} 
          placeholder="Contraseña (min 6 caracteres)" 
          placeholderTextColor="#666"
          secureTextEntry={true}
          onChangeText={setPassword}
          value={password}
        />
      </View>
      
      <View style={styles.rowButtons}>
        <TouchableOpacity style={styles.actionButton} onPress={signInWithEmail} disabled={loading}>
          <Text style={styles.buttonText}>{loading ? "..." : "Ingresar"}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.actionButton, styles.outlineButton]} onPress={signUpWithEmail} disabled={loading}>
          <Text style={styles.outlineText}>Crear Cuenta</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.divider}>
        <View style={styles.line} /><Text style={{color:'#666', marginHorizontal:10}}>O</Text><View style={styles.line} />
      </View>

      {/* --- BOTONES EXTRA --- */}
      <TouchableOpacity style={styles.googleButton} onPress={() => Alert.alert("Pronto","Configuraremos Google en el próximo paso")}>
        <Text style={styles.googleButtonText}>G  Ingresar con Google</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.guestButton} onPress={() => router.push('/home')}>
        <Text style={styles.guestText}>🚧 Entrar como Invitado</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000', alignItems: 'center', justifyContent: 'center', padding: 20 },
  logo: { color: '#fff', fontSize: 32, fontWeight: 'bold', marginBottom: 5 },
  subtitle: { color: '#aaa', fontSize: 18, marginBottom: 40 },
  inputContainer: { width: '100%', marginBottom: 10 },
  input: {
    backgroundColor: '#1A1A1A', color: '#fff', padding: 15, borderRadius: 12, marginBottom: 12, borderWidth: 1, borderColor: '#333',
  },
  rowButtons: { flexDirection: 'row', justifyContent: 'space-between', width: '100%', marginBottom: 20 },
  actionButton: {
    flex: 1, backgroundColor: '#fff', padding: 15, borderRadius: 12, alignItems: 'center', marginHorizontal: 5
  },
  buttonText: { color: '#000', fontWeight: 'bold' },
  outlineButton: { backgroundColor: 'transparent', borderWidth: 1, borderColor: '#fff' },
  outlineText: { color: '#fff', fontWeight: 'bold' },
  divider: { flexDirection: 'row', alignItems: 'center', width: '100%', marginBottom: 20 },
  line: { flex: 1, height: 1, backgroundColor: '#333' },
  googleButton: {
    backgroundColor: '#EA4335', width: '100%', padding: 15, borderRadius: 12, alignItems: 'center', marginBottom: 10,
  },
  googleButtonText: { color: '#fff', fontWeight: 'bold' },
  guestButton: { padding: 10 },
  guestText: { color: 'yellow' }
});