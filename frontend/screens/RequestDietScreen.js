import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { createSpecializedRequest } from '../services/petService';

const RequestDietScreen = ({ navigation, route }) => {
  const { clienteId, petId, petName } = route.params || {};

  const [objetivo, setObjetivo] = useState('');
  const [frecuencia, setFrecuencia] = useState('');
  const [observaciones, setObservaciones] = useState('');
  const [archivo, setArchivo] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSelectFile = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert("Permiso requerido", "Necesitamos acceso a la galería.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: 'Images', // ✅ CORREGIDO: Usar string para evitar warning
      quality: 0.8,
      allowsEditing: false, // Recomendado para evitar problemas de conversión
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const selectedAsset = result.assets[0];
      console.log("📸 Imagen seleccionada:", selectedAsset.uri);
      setArchivo(selectedAsset);
    }
  };

  const handleSubmit = async () => {
    if (!objetivo.trim() || !frecuencia.trim()) {
      Alert.alert("Campos requeridos", "Por favor completa el objetivo y la alimentación actual.");
      return;
    }

    setLoading(true);
    try {
      const data = {
        mascotaId: petId,
        objetivo,
        frecuencia,
        observaciones
      };

      console.log("🚀 Enviando solicitud para:", petName);

      await createSpecializedRequest(clienteId, data, archivo);

      Alert.alert(
        "¡Solicitud Enviada!",
        "Tu nutricionista revisará el caso y te enviará un plan personalizado pronto.",
        [{ text: "Entendido", onPress: () => navigation.popToTop() }] 
      );
    } catch (error) {
      console.error("Error en pantalla:", error);
      Alert.alert("Error", "No se pudo enviar la solicitud. Intenta nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{flex:1}}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={28} color="#333" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Nueva Solicitud</Text>
          <View style={{width: 28}} />
        </View>

        <ScrollView contentContainerStyle={styles.content}>
          <View style={styles.petBadge}>
            <Ionicons name="paw" size={20} color="white" />
            <Text style={styles.petBadgeText}>Para: {petName || 'Tu Mascota'}</Text>
          </View>

          <Text style={styles.sectionTitle}>1. Objetivo Nutricional</Text>
          <TextInput
            style={styles.input}
            placeholder="Ej: Bajar de peso, mejorar pelaje, ganar masa..."
            value={objetivo}
            onChangeText={setObjetivo}
          />

          <Text style={styles.sectionTitle}>2. Alimentación Actual</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Ej: Come croquetas marca X, 2 veces al día..."
            value={frecuencia}
            onChangeText={setFrecuencia}
            multiline
            numberOfLines={4}
          />

          <Text style={styles.sectionTitle}>3. Observaciones Adicionales</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Ej: Tiene alergia al pollo, sufre de gastritis..."
            value={observaciones}
            onChangeText={setObservaciones}
            multiline
            numberOfLines={3}
          />

          <Text style={styles.sectionTitle}>4. Exámenes o Recetas (Opcional)</Text>
          <TouchableOpacity style={styles.uploadBtn} onPress={handleSelectFile}>
            {archivo ? (
              <View style={styles.fileSelected}>
                <Ionicons name="image" size={24} color="#4CAF50" />
                <Text style={styles.fileName} numberOfLines={1}>Imagen seleccionada</Text>
                <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
              </View>
            ) : (
              <View style={styles.filePlaceholder}>
                <Ionicons name="cloud-upload-outline" size={30} color="#875686" />
                <Text style={styles.uploadText}>Subir foto o documento</Text>
              </View>
            )}
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.submitBtn, loading && styles.disabledBtn]} 
            onPress={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={styles.submitText}>ENVIAR SOLICITUD</Text>
            )}
          </TouchableOpacity>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F9F9F9' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, backgroundColor: 'white' },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#333' },
  content: { padding: 25 },
  
  petBadge: { backgroundColor: '#875686', alignSelf: 'flex-start', paddingHorizontal: 15, paddingVertical: 8, borderRadius: 20, flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 25 },
  petBadgeText: { color: 'white', fontWeight: 'bold' },

  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: '#555', marginBottom: 10, marginTop: 10 },
  input: { backgroundColor: 'white', padding: 15, borderRadius: 12, borderWidth: 1, borderColor: '#eee', fontSize: 16, color: '#333' },
  textArea: { height: 100, textAlignVertical: 'top' },

  uploadBtn: { marginTop: 5, marginBottom: 30 },
  filePlaceholder: { backgroundColor: 'white', borderStyle: 'dashed', borderWidth: 2, borderColor: '#d1d1d1', borderRadius: 15, height: 80, justifyContent: 'center', alignItems: 'center', flexDirection: 'row', gap: 10 },
  uploadText: { color: '#875686', fontWeight: '600' },
  fileSelected: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#e8f5e9', padding: 15, borderRadius: 12, gap: 10, borderWidth: 1, borderColor: '#4CAF50' },
  fileName: { flex: 1, color: '#2e7d32', fontWeight: 'bold' },

  submitBtn: { backgroundColor: '#FF8C42', padding: 18, borderRadius: 15, alignItems: 'center', shadowColor: '#FF8C42', shadowOpacity: 0.3, shadowRadius: 5, elevation: 5 },
  disabledBtn: { backgroundColor: '#ccc' },
  submitText: { color: 'white', fontWeight: 'bold', fontSize: 18 }
});

export default RequestDietScreen;