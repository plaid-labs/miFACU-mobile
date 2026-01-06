import { FontAwesome5, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function HomeScreen() {
  const router = useRouter();
  const [usuario, setUsuario] = useState('Estudiante');

  useEffect(() => {
    AsyncStorage.getItem('usuario_nombre').then(nombre => {
      if (nombre) setUsuario(nombre.charAt(0).toUpperCase() + nombre.slice(1));
    });
  }, []);

  // Componente de Botón de Grilla Reutilizable
  const GridButton = ({ icon, label, route, library = "Ionicons", color = "#2E5EC9", special = false }: {
    icon: string;
    label: string;
    route?: string;
    library?: string;
    color?: string;
    special?: boolean;
  }) => (
    <TouchableOpacity
      style={[styles.gridButton, special && { backgroundColor: '#6200EA' }]}
      onPress={() => route && router.push(route as any)}
    >
      <View style={styles.iconContainer}>
        {library === "Ionicons" && <Ionicons name={icon as any} size={28} color={special ? "#fff" : color} />}
        {library === "Material" && <MaterialCommunityIcons name={icon as any} size={28} color={special ? "#fff" : color} />}
        {library === "FontAwesome" && <FontAwesome5 name={icon as any} size={24} color={special ? "#fff" : color} />}
      </View>
      <Text style={[styles.gridLabel, special && { color: '#fff', fontWeight: 'bold' }]}>{label}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.mainContainer}>
      <StatusBar barStyle="light-content" backgroundColor="#2E5EC9" />
      
      {/* HEADER AZUL */}
      <View style={styles.headerContainer}>
        <SafeAreaView>
          <View style={styles.topBar}>
            <TouchableOpacity><Ionicons name="menu" size={30} color="#fff" /></TouchableOpacity>
            <Text style={styles.logoText}>miFacu</Text>
            <TouchableOpacity style={styles.profileIcon} onPress={() => router.push('/perfil' as any)}>
               <Ionicons name="person" size={20} color="#2E5EC9" />
               <View style={styles.badge}><Ionicons name="checkmark" size={10} color="#fff" /></View>
            </TouchableOpacity>
          </View>
          <Text style={styles.greetingText}>¡Hola {usuario}!</Text>
        </SafeAreaView>
      </View>

      <ScrollView style={styles.contentContainer} showsVerticalScrollIndicator={false}>
        
        {/* Tarjetas de Estado */}
        <TouchableOpacity style={styles.cardWhite} onPress={() => router.push('/finales' as any)}>
          <View style={styles.cardRow}>
            <MaterialCommunityIcons name="ticket-confirmation-outline" size={40} color="#2E5EC9" style={{marginRight: 15}} />
            <View style={{flex: 1}}>
              <Text style={styles.cardTitle}>Inscripción a Finales</Text>
              <View style={styles.smallButton}>
                <Text style={styles.smallButtonText}>Ver Mesas</Text>
              </View>
            </View>
          </View>
        </TouchableOpacity>

        <View style={styles.cardGreen}>
          <View style={styles.cardRow}>
            <Text style={styles.greenCardText}>¡Tu regularidad está al día!</Text>
            <MaterialCommunityIcons name="card-account-details-outline" size={35} color="#008000" />
            <View style={styles.greenCheckBadge}>
               <Ionicons name="checkmark" size={12} color="#fff" />
            </View>
          </View>
        </View>

        {/* SECCIÓN ACADÉMICA (Lo Nuevo) */}
        <Text style={styles.sectionTitle}>Gestión Académica</Text>
        <View style={styles.gridContainer}>
          {/* BOTÓN 1: MIS MATERIAS (Lista Real) */}
          <GridButton 
            icon="list" 
            label="Mis Materias" 
            route="/plan-estudios" 
          />
          
          {/* BOTÓN 2: SIMULADOR (Juego) - Destacado en Violeta */}
          <TouchableOpacity 
            style={[styles.gridButton, { backgroundColor: '#6200EA' }]} 
            onPress={() => router.push('/plan-mapa')}
          >
            <View style={styles.iconContainer}>
              <Ionicons name="game-controller" size={28} color="#fff" />
            </View>
            <Text style={[styles.gridLabel, { color: '#fff', fontWeight: 'bold' }]}>Simulador</Text>
          </TouchableOpacity>

          <GridButton icon="calendar-outline" label="Horarios" route="/horarios" />
          <GridButton icon="library-outline" label="Biblioteca" />
        </View>

        {/* SECCIÓN TRÁMITES */}
        <Text style={styles.sectionTitle}>Trámites y Consultas</Text>
        <View style={styles.gridContainer}>
          <GridButton icon="car-sport-outline" label="Estacionam." />
          <GridButton icon="briefcase-outline" label="Pasantías" />
          <GridButton icon="heart-outline" label="Salud" />
          <GridButton icon="cash-outline" label="Cuotas" />
        </View>

        <View style={{height: 50}} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: { flex: 1, backgroundColor: '#F2F2F2' },
  headerContainer: { backgroundColor: '#2E5EC9', paddingHorizontal: 20, paddingBottom: 25, borderBottomLeftRadius: 20, borderBottomRightRadius: 20, paddingTop: 10 },
  topBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, marginTop: 10 },
  logoText: { color: '#fff', fontSize: 22, fontWeight: '700' },
  profileIcon: { width: 35, height: 35, backgroundColor: '#fff', borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
  badge: { position: 'absolute', bottom: -2, right: -2, backgroundColor: '#2E5EC9', borderRadius: 10, width: 14, height: 14, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#fff' },
  greetingText: { color: '#fff', fontSize: 26, fontWeight: 'bold', textAlign: 'center' },
  contentContainer: { flex: 1, paddingHorizontal: 15, marginTop: -20 },
  cardWhite: { backgroundColor: '#fff', borderRadius: 10, padding: 20, marginBottom: 15, elevation: 4 },
  cardGreen: { backgroundColor: '#D1F2EB', borderRadius: 10, padding: 20, marginBottom: 25, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  cardRow: { flexDirection: 'row', alignItems: 'center' },
  cardTitle: { fontSize: 16, color: '#333', fontWeight: '600', marginBottom: 10 },
  smallButton: { backgroundColor: '#2E5EC9', paddingVertical: 8, paddingHorizontal: 15, borderRadius: 20, alignSelf: 'flex-start' },
  smallButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 12 },
  greenCardText: { flex: 1, fontSize: 16, color: '#145A32', fontWeight: '600' },
  greenCheckBadge: { position: 'absolute', top: 0, right: 0, backgroundColor: '#28B463', borderRadius: 10, width: 16, height: 16, justifyContent: 'center', alignItems: 'center' },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#333', marginBottom: 10, marginTop: 5 },
  gridContainer: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  gridButton: { width: '23%', backgroundColor: '#fff', borderRadius: 12, paddingVertical: 15, alignItems: 'center', marginBottom: 10, elevation: 2 },
  iconContainer: { marginBottom: 8 },
  gridLabel: { fontSize: 11, color: '#555', textAlign: 'center' },
});