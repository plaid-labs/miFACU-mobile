import { FontAwesome5, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function HomeScreen() {
  const router = useRouter();
  const [usuario, setUsuario] = useState('Estudiante');

  // Cargamos el nombre guardado (Matias)
  useEffect(() => {
    AsyncStorage.getItem('usuario_nombre').then(nombre => {
      if (nombre) setUsuario(nombre.charAt(0).toUpperCase() + nombre.slice(1));
    });
  }, []);

  // Componente para los botones de la grilla
  const GridButton = ({ icon, label, library = "Ionicons" }: { icon: any, label: string, library?: string }) => (
    <TouchableOpacity style={styles.gridButton}>
      <View style={styles.iconContainer}>
        {library === "Ionicons" && <Ionicons name={icon} size={28} color="#2E5EC9" />}
        {library === "Material" && <MaterialCommunityIcons name={icon} size={28} color="#2E5EC9" />}
        {library === "FontAwesome" && <FontAwesome5 name={icon} size={24} color="#2E5EC9" />}
      </View>
      <Text style={styles.gridLabel}>{label}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.mainContainer}>
      <StatusBar barStyle="light-content" backgroundColor="#2E5EC9" />

      {/* 1. HEADER AZUL */}
      <View style={styles.headerContainer}>
        <SafeAreaView>
          <View style={styles.topBar}>
            <TouchableOpacity><Ionicons name="menu" size={30} color="#fff" /></TouchableOpacity>
            <Text style={styles.logoText}>miFacu</Text>
            <TouchableOpacity style={styles.profileIcon}>
               <Ionicons name="person" size={20} color="#2E5EC9" />
               <View style={styles.badge}><Ionicons name="checkmark" size={10} color="#fff" /></View>
            </TouchableOpacity>
          </View>
          <Text style={styles.greetingText}>¡Hola {usuario}!</Text>
        </SafeAreaView>
      </View>

      <ScrollView style={styles.contentContainer} showsVerticalScrollIndicator={false}>

        {/* 2. TARJETAS DE ESTADO */}
        {/* Tarjeta Blanca (Exámenes/Turnos) */}
        <View style={styles.cardWhite}>
          <View style={styles.cardRow}>
            <MaterialCommunityIcons name="ticket-confirmation-outline" size={40} color="#2E5EC9" style={{marginRight: 15}} />
            <View style={{flex: 1}}>
              <Text style={styles.cardTitle}>No tenés exámenes programados.</Text>
              <TouchableOpacity style={styles.smallButton}>
                <Text style={styles.smallButtonText}>Inscribite acá</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Tarjeta Verde (Regularidad) */}
        <View style={styles.cardGreen}>
          <View style={styles.cardRow}>
            <Text style={styles.greenCardText}>¡Tu regularidad está al día!</Text>
            <MaterialCommunityIcons name="card-account-details-outline" size={35} color="#008000" />
            <View style={styles.greenCheckBadge}>
               <Ionicons name="checkmark" size={12} color="#fff" />
            </View>
          </View>
        </View>

        {/* 3. GRILLA DE ACCESOS ("¿Qué necesitás hoy?") */}
        <Text style={styles.sectionTitle}>¿Qué necesitás hoy?</Text>

        <View style={styles.gridContainer}>
          <GridButton icon="document-text-outline" label="Materias" />
          <GridButton icon="car-sport-outline" label="Estacionamiento" />
          <GridButton icon="briefcase-outline" label="Pasantías" />
          <GridButton icon="heart-outline" label="Salud" />
          <GridButton icon="cash-outline" label="Cuotas" />
          <GridButton icon="file-tray-full-outline" label="Trámites" />
          <GridButton icon="calendar-outline" label="Turnos" />
          <GridButton icon="library-outline" label="Biblioteca" />
        </View>

        {/* 4. BANNER INFERIOR */}
        <TouchableOpacity style={styles.bottomBanner}>
          <View style={styles.bannerIconCircle}>
             <Ionicons name="person-outline" size={24} color="#C2185B" />
          </View>
          <View style={{marginLeft: 15}}>
            <Text style={styles.bannerTitle}>Completá tu perfil</Text>
            <Text style={styles.bannerSubtitle}>Mantené todos tus datos actualizados</Text>
          </View>
        </TouchableOpacity>

        {/* Espacio extra abajo para que no se tape con el menú del celular */}
        <View style={{height: 100}} />

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: { flex: 1, backgroundColor: '#F2F2F2' },

  // Header Styles
  headerContainer: {
    backgroundColor: '#2E5EC9', // El azul de miArgentina
    paddingHorizontal: 20,
    paddingBottom: 25,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    paddingTop: 10 // Ajuste para status bar
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 10
  },
  logoText: { color: '#fff', fontSize: 22, fontWeight: '700' },
  profileIcon: {
    width: 35, height: 35, backgroundColor: '#fff', borderRadius: 20,
    justifyContent: 'center', alignItems: 'center', position: 'relative'
  },
  badge: {
    position: 'absolute', bottom: -2, right: -2, backgroundColor: '#2E5EC9',
    borderRadius: 10, width: 14, height: 14, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#fff'
  },
  greetingText: { color: '#fff', fontSize: 26, fontWeight: 'bold', textAlign: 'center' },

  // Content
  contentContainer: { flex: 1, paddingHorizontal: 15, marginTop: -20 }, // marginTop negativo para solapar cards

  // Cards
  cardWhite: {
    backgroundColor: '#fff', borderRadius: 10, padding: 20,
    marginBottom: 15, elevation: 4, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 5, shadowOffset: {width:0, height:2}
  },
  cardGreen: {
    backgroundColor: '#D1F2EB', borderRadius: 10, padding: 20,
    marginBottom: 25, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'
  },
  cardRow: { flexDirection: 'row', alignItems: 'center' },
  cardTitle: { fontSize: 16, color: '#333', fontWeight: '600', marginBottom: 10 },
  smallButton: { backgroundColor: '#2E5EC9', paddingVertical: 8, paddingHorizontal: 15, borderRadius: 20, alignSelf: 'flex-start' },
  smallButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 12 },

  greenCardText: { flex: 1, fontSize: 16, color: '#145A32', fontWeight: '600' },
  greenCheckBadge: { position: 'absolute', top: 0, right: 0, backgroundColor: '#28B463', borderRadius: 10, width: 16, height: 16, justifyContent: 'center', alignItems: 'center' },

  // Grid
  sectionTitle: { fontSize: 20, fontWeight: 'bold', color: '#333', marginBottom: 15 },
  gridContainer: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  gridButton: {
    width: '23%', // 4 columnas aprox
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingVertical: 15,
    alignItems: 'center',
    marginBottom: 10,
    elevation: 2, shadowColor: '#000', shadowOpacity: 0.05
  },
  iconContainer: { marginBottom: 8 },
  gridLabel: { fontSize: 11, color: '#555', textAlign: 'center' },

  // Bottom Banner
  bottomBanner: {
    backgroundColor: '#FADBD8', borderRadius: 12, padding: 15, flexDirection: 'row', alignItems: 'center', marginTop: 10
  },
  bannerIconCircle: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#F5B7B1', justifyContent: 'center', alignItems: 'center' },
  bannerTitle: { fontSize: 16, fontWeight: 'bold', color: '#7B241C' },
  bannerSubtitle: { fontSize: 13, color: '#7B241C' }
});