import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { supabase } from '../src/services/supabase';

export default function HomeScreen() {
  const router = useRouter();
  const [materias, setMaterias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    cargarDatos();
  }, []);

  async function cargarDatos() {
    setLoading(true);
    try {
      // 1. Intentamos obtener el usuario (pero no frenamos si no hay)
      const { data: { user } } = await supabase.auth.getUser();
      if (user) setUserId(user.id);

      // 2. Traemos TODAS las materias (Esto se hace SIEMPRE)
      const { data: materiasData, error: errorMat } = await supabase
        .from('materias')
        .select('*')
        .order('id', { ascending: true });

      if (errorMat) throw errorMat;

      let avancesData = [];

      // 3. Si hay usuario, buscamos sus avances. Si no, lista vacía.
      if (user) {
        const { data, error: errorAva } = await supabase
          .from('avances')
          .select('*')
          .eq('user_id', user.id);
          
        if (!errorAva) avancesData = data;
      }

      // 4. Fusionamos los datos
      const materiasCombinadas = materiasData.map(materia => {
        const avance = avancesData.find(a => a.materia_id === materia.id);
        return {
          ...materia,
          estado: avance ? avance.estado : 'pendiente'
        };
      });

      setMaterias(materiasCombinadas);

    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Ocurrió un problema cargando las materias");
    } finally {
      setLoading(false);
    }
  }

  // Función para cambiar estado (con protección para invitados)
  async function toggleMateria(materiaId, estadoActual) {
    if (!userId) {
      Alert.alert("Modo Invitado", "Necesitas iniciar sesión para guardar tu progreso.");
      return;
    }

    // 1. Ciclo de estados: Pendiente -> Cursando -> Aprobada -> Pendiente
    let nuevoEstado = 'pendiente';
    if (estadoActual === 'pendiente') nuevoEstado = 'cursando';
    else if (estadoActual === 'cursando') nuevoEstado = 'aprobada';
    else if (estadoActual === 'aprobada') nuevoEstado = 'pendiente';

    // 2. Actualización visual inmediata (Optimistic UI)
    const materiasActualizadas = materias.map(m => 
      m.id === materiaId ? { ...m, estado: nuevoEstado } : m
    );
    setMaterias(materiasActualizadas);

    // 3. Guardar en Supabase
    try {
      const { error } = await supabase
        .from('avances')
        .upsert({ 
          user_id: userId, 
          materia_id: materiaId, 
          estado: nuevoEstado 
        }, { onConflict: 'user_id, materia_id' });

      if (error) throw error;
    } catch (error) {
      Alert.alert("Error guardando", error.message);
      cargarDatos(); // Si falla, recargamos para deshacer el cambio visual
    }
  }

  const getColor = (estado) => {
    switch(estado) {
      case 'aprobada': return '#4CAF50';
      case 'cursando': return '#2196F3';
      case 'pendiente': return '#333';
      default: return '#333';
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Mi Progreso 🚀</Text>
        <Text style={styles.subtitle}>
            {userId ? "Guardando en la nube" : "Modo Invitado (Solo lectura)"}
        </Text>
      </View>

      {loading ? (
        <View style={styles.center}><ActivityIndicator size="large" color="#fff" /></View>
      ) : (
        <ScrollView style={styles.list}>
          {materias.map((materia) => (
            <TouchableOpacity 
              key={materia.id} 
              style={[styles.card, { borderColor: getColor(materia.estado), borderWidth: 1 }]}
              onPress={() => toggleMateria(materia.id, materia.estado)}
            >
              <View style={[styles.statusIndicator, { backgroundColor: getColor(materia.estado) }]} />
              <View style={styles.cardContent}>
                <Text style={styles.materiaName}>{materia.nombre}</Text>
                <Text style={[styles.materiaInfo, { color: getColor(materia.estado) }]}>
                   {materia.estado.toUpperCase()}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
      
      <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
        <Text style={{color: '#aaa'}}>Volver</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000', padding: 20, paddingTop: 60 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { marginBottom: 20 },
  title: { color: '#fff', fontSize: 28, fontWeight: 'bold' },
  subtitle: { color: '#666', fontSize: 16 },
  list: { flex: 1 },
  card: { 
    backgroundColor: '#111', 
    marginBottom: 12, 
    borderRadius: 12, 
    flexDirection: 'row',
    height: 75,
    overflow: 'hidden'
  },
  statusIndicator: { width: 8, height: '100%' },
  cardContent: { padding: 15, justifyContent: 'center' },
  materiaName: { color: '#fff', fontSize: 16, fontWeight: '600' },
  materiaInfo: { fontSize: 12, fontWeight: 'bold', marginTop: 4, letterSpacing: 1 },
  backButton: { padding: 20, alignItems: 'center' }
});