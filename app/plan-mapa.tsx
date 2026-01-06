import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Dimensions, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { supabase } from '../src/services/supabase';

const { width } = Dimensions.get('window');

// Interfaces para TypeScript
interface Materia {
  id: number;
  nombre: string;
  anio?: number;
  año?: number;
  estado: 'aprobada' | 'cursando' | 'pendiente';
}

interface Correlativa {
  materia_id: number;
  requisito_id: number;
}

export default function PlanMapaScreen() {
  const router = useRouter();
  const [materias, setMaterias] = useState<Materia[]>([]);
  const [correlativas, setCorrelativas] = useState<Correlativa[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cargarDatos();
  }, []);

  async function cargarDatos() {
    try {
      const nombre = await AsyncStorage.getItem('usuario_nombre');

      // 1. Materias
      const { data: materiasData } = await supabase.from('materias').select('*').order('id');
      // 2. Avances
      const { data: avancesData } = await supabase.from('avances').select('*').eq('user_id', nombre || '');
      // 3. Correlativas (Reglas)
      const { data: reglasData } = await supabase.from('correlativas').select('*');

      setCorrelativas(reglasData || []);

      const materiasProcesadas = (materiasData || []).map(mat => {
        const avance = avancesData?.find(a => a.materia_id === mat.id);
        return { ...mat, estado: avance ? avance.estado : 'pendiente' };
      });

      setMaterias(materiasProcesadas);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  // --- 🧠 LÓGICA DE VIDEOJUEGO (VALIDACIÓN) ---
  const handlePressNode = (materia: Materia) => {
    // Si está desbloqueada, pasamos
    if (materia.estado === 'aprobada' || materia.estado === 'cursando') {
      // Por ahora solo mostramos alerta, después implementaremos detalle-materia
      Alert.alert("Materia desbloqueada", `Has seleccionado: ${materia.nombre}`);
      return;
    }

    // Si está GRIS (Pendiente), verificamos requisitos
    const requisitos = correlativas.filter(r => r.materia_id === materia.id);
    const faltantes = requisitos.filter(req => {
      const matReq = materias.find(m => m.id === req.requisito_id);
      return !matReq || matReq.estado !== 'aprobada';
    });

    if (faltantes.length > 0) {
      // 🔒 SONIDO DE ERROR / ALERTA DE JUEGO
      const nombres = faltantes.map(f => {
        const m = materias.find(mat => mat.id === f.requisito_id);
        return m ? m.nombre : '???';
      }).join('\n🔒 ');

      Alert.alert(
        "🚫 HABILIDAD BLOQUEADA",
        `No puedes desbloquear "${materia.nombre}".\n\nRequisitos faltantes:\n🔒 ${nombres}`
      );
    } else {
      // Si no tiene requisitos faltantes, la dejamos abrir para ver info
      Alert.alert("Información", `Materia: ${materia.nombre}\nEstado: ${materia.estado}`);
    }
  };

  // Renderiza un NODO del árbol (Hexágono o Cuadrado Tecnológico)
  const SkillNode = ({ materia }: { materia: Materia }) => {
    const color =
      materia.estado === 'aprobada' ? '#4CAF50' : // Verde Éxito
      materia.estado === 'cursando' ? '#2196F3' : // Azul Energía
      '#424242'; // Gris Apagado

    const isLocked = materia.estado === 'pendiente';

    return (
      <View style={styles.nodeWrapper}>
        {/* Línea conectora horizontal (Visual) */}
        <View style={styles.connectorLine} />

        <TouchableOpacity
          style={[styles.node, { borderColor: color, backgroundColor: isLocked ? '#1a1a1a' : '#000' }]}
          onPress={() => handlePressNode(materia)}
          activeOpacity={0.7}
        >
          {/* Icono de Estado */}
          <View style={[styles.iconCircle, { backgroundColor: isLocked ? '#333' : color }]}>
            <Ionicons
              name={materia.estado === 'aprobada' ? "checkmark" : materia.estado === 'cursando' ? "flash" : "lock-closed"}
              size={16}
              color="#fff"
            />
          </View>

          <Text style={[styles.nodeText, { color: isLocked ? '#666' : '#fff' }]} numberOfLines={3}>
            {materia.nombre}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  // Renderiza una COLUMNA (Año)
  const YearColumn = ({ anio }: { anio: number }) => {
    const materiasDelAnio = materias.filter(m => (m.anio || m.año) === anio); // Manejo de ñ/n
    return (
      <View style={styles.columnContainer}>
        <View style={styles.yearHeader}>
          <Text style={styles.yearTitle}>NIVEL {anio}</Text>
        </View>
        <ScrollView style={styles.columnScroll} showsVerticalScrollIndicator={false}>
          {materiasDelAnio.map(mat => (
            <SkillNode key={mat.id} materia={mat} />
          ))}
          <View style={{height: 100}} />
        </ScrollView>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar hidden />

      {/* HUD HEADER */}
      <View style={styles.hudHeader}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color="#00ffcc" />
        </TouchableOpacity>
        <Text style={styles.hudTitle}>SKILL TREE / INGENIERÍA</Text>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#00ffcc" style={{marginTop: 50}} />
      ) : (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.mainScroll}>
          <YearColumn anio={1} />
          <YearColumn anio={2} />
          <YearColumn anio={3} />
          <YearColumn anio={4} />
          <YearColumn anio={5} />
          <View style={{width: 50}} />
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#050505' }, // Fondo Cyberpunk casi negro

  // HUD
  hudHeader: {
    flexDirection: 'row', alignItems: 'center', padding: 20, paddingTop: 40,
    borderBottomWidth: 1, borderBottomColor: '#333', backgroundColor: '#000'
  },
  backBtn: { marginRight: 15, padding: 5, borderWidth: 1, borderColor: '#00ffcc', borderRadius: 5 },
  hudTitle: { color: '#00ffcc', fontSize: 16, fontWeight: 'bold', letterSpacing: 2, fontFamily: 'monospace' },

  // Scroll Principal Horizontal
  mainScroll: { flex: 1 },

  // Columnas (Años)
  columnContainer: {
    width: 160,
    borderRightWidth: 1,
    borderRightColor: '#222',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.02)'
  },
  yearHeader: {
    width: '100%', padding: 15, backgroundColor: '#111', borderBottomWidth: 2, borderBottomColor: '#333', alignItems: 'center'
  },
  yearTitle: { color: '#888', fontWeight: 'bold', letterSpacing: 1 },
  columnScroll: { width: '100%', paddingVertical: 20 },

  // Nodos (Materias)
  nodeWrapper: { alignItems: 'center', marginBottom: 25, position: 'relative' },
  connectorLine: {
    position: 'absolute', top: -15, width: 2, height: 15, backgroundColor: '#333', zIndex: -1
  },
  node: {
    width: 130, height: 110,
    borderRadius: 10, borderWidth: 2,
    padding: 10, alignItems: 'center', justifyContent: 'center',
    shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.5, shadowRadius: 5, elevation: 5
  },
  iconCircle: {
    width: 30, height: 30, borderRadius: 15, marginBottom: 8,
    justifyContent: 'center', alignItems: 'center',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.3)'
  },
  nodeText: {
    fontSize: 12, fontWeight: 'bold', textAlign: 'center', fontFamily: 'monospace'
  },
});