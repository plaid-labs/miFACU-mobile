import { useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function HomeScreen() {
  const router = useRouter();

  // Datos falsos (MOCK) para probar el diseño
  const materias = [
    { id: 1, nombre: 'Análisis Matemático I', estado: 'aprobada' },
    { id: 2, nombre: 'Álgebra y Geometría', estado: 'aprobada' },
    { id: 3, nombre: 'Sistemas y Organizaciones', estado: 'aprobada' },
    { id: 4, nombre: 'Arquitectura de Computadoras', estado: 'cursada' },
    { id: 5, nombre: 'Programación I', estado: 'cursando' },
    { id: 6, nombre: 'Física I', estado: 'pendiente' },
  ];

  const getColor = (estado) => {
    switch(estado) {
      case 'aprobada': return '#4CAF50'; // Verde
      case 'cursada': return '#FFC107';  // Amarillo
      case 'cursando': return '#2196F3'; // Azul
      default: return '#333';            // Gris
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Hola, Futuro Ingeniero 👷</Text>
        <Text style={styles.subtitle}>Tu progreso en Sistemas</Text>
      </View>

      <ScrollView style={styles.list}>
        {materias.map((materia) => (
          <TouchableOpacity key={materia.id} style={styles.card}>
            <View style={[styles.statusIndicator, { backgroundColor: getColor(materia.estado) }]} />
            <View style={styles.cardContent}>
              <Text style={styles.materiaName}>{materia.nombre}</Text>
              <Text style={styles.materiaStatus}>{materia.estado.toUpperCase()}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <TouchableOpacity onPress={() => router.back()} style={styles.logoutButton}>
        <Text style={styles.logoutText}>Cerrar Sesión</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000', padding: 20, paddingTop: 60 },
  header: { marginBottom: 30 },
  title: { color: '#fff', fontSize: 24, fontWeight: 'bold' },
  subtitle: { color: '#888', fontSize: 16 },
  list: { flex: 1 },
  card: { 
    backgroundColor: '#1A1A1A', 
    marginBottom: 15, 
    borderRadius: 12, 
    flexDirection: 'row',
    overflow: 'hidden',
    height: 80
  },
  statusIndicator: { width: 6, height: '100%' },
  cardContent: { padding: 15, justifyContent: 'center' },
  materiaName: { color: '#fff', fontSize: 18, fontWeight: '600' },
  materiaStatus: { color: '#aaa', fontSize: 12, marginTop: 5, letterSpacing: 1 },
  logoutButton: { marginTop: 20, alignItems: 'center', padding: 10 },
  logoutText: { color: '#ef4444' }
});