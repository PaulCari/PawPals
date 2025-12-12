import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Image, Alert, ActivityIndicator, ScrollView } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { getClienteProfile, updateClientProfile } from '../services/authService';
import api from '../api';

const UserProfileScreen = ({ navigation, route }) => {
    // Recibir ID que viene desde SignIn
    const { clienteId } = route.params || {};

    const [loading, setLoading] = useState(true);
    const [photo, setPhoto] = useState(null);
    const [formData, setFormData] = useState({
        nombre: '',
        apellido: '',
        direccion: '',
        telefono: '',
        correo: '',
    });

    // 🔧 Normalizar ruta de imagen del backend
    const buildImageUrl = (path) => {
        if (!path) return null;

        // Limpieza completa: elimina /static/, static/, etc
        const cleanPath = path.replace(/^\/?static\//, "");

        // construir URL final
        return `${api.defaults.baseURL}/static/${cleanPath}`;
    };

    // 🔄 Cargar datos del backend
    const loadData = async () => {
        try {
            if (!clienteId) {
                Alert.alert("Error", "No se pudo identificar al usuario.");
                setLoading(false);
                return;
            }

            const result = await getClienteProfile(clienteId);

            if (result.error) {
                Alert.alert("Error", result.error);
                setLoading(false);
                return;
            }

            const data = result;

            setFormData({
                nombre: data.nombre || '',
                apellido: data.apellido || '',
                direccion: data.direccion || '',
                telefono: data.telefono || '',
                correo: data.correo || '',
            });

            setPhoto(buildImageUrl(data.foto));

        } catch (error) {
            console.error("Error loadData:", error);
            Alert.alert("Error", "Hubo un problema al cargar el perfil.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    // 📸 Seleccionar foto
    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            quality: 0.8,
        });

        if (!result.canceled && result.assets && result.assets.length > 0) {
            setPhoto(result.assets[0].uri);
        }
    };

    // 💾 Guardar cambios
    const handleSave = async () => {
        try {
            const resp = await updateClientProfile(clienteId, formData, photo);

            if (resp.error) {
                Alert.alert("Error", resp.error);
                return;
            }

            Alert.alert("Éxito", "Perfil actualizado correctamente.");
        } catch (err) {
            console.error(err);
            Alert.alert("Error", "No se pudo actualizar el perfil.");
        }
    };

    if (loading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" color="#000" />
            </View>
        );
    }

    return (
        <ScrollView style={styles.container}>
            <TouchableOpacity onPress={pickImage} style={styles.photoContainer}>
                <Image
                    source={photo ? { uri: photo } : require('../assets/user.png')}
                    style={styles.profileImage}
                />
                <Text style={styles.changePhotoText}>Cambiar foto</Text>
            </TouchableOpacity>

            <View style={styles.inputGroup}>
                <Text style={styles.label}>Nombre</Text>
                <TextInput
                    style={styles.input}
                    value={formData.nombre}
                    onChangeText={(text) => setFormData({ ...formData, nombre: text })}
                />

                <Text style={styles.label}>Apellido</Text>
                <TextInput
                    style={styles.input}
                    value={formData.apellido}
                    onChangeText={(text) => setFormData({ ...formData, apellido: text })}
                />

                <Text style={styles.label}>Dirección</Text>
                <TextInput
                    style={styles.input}
                    value={formData.direccion}
                    onChangeText={(text) => setFormData({ ...formData, direccion: text })}
                />

                <Text style={styles.label}>Teléfono</Text>
                <TextInput
                    style={styles.input}
                    value={formData.telefono}
                    onChangeText={(text) => setFormData({ ...formData, telefono: text })}
                />

                <Text style={styles.label}>Correo</Text>
                <TextInput
                    style={styles.input}
                    editable={false} // El correo no se edita
                    value={formData.correo}
                />
            </View>

            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                <Text style={styles.saveButtonText}>Guardar Cambios</Text>
            </TouchableOpacity>
        </ScrollView>
    );
};
const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    photoContainer: {
        alignItems: 'center',
        marginBottom: 20,
    },
    profileImage: {
        width: 130,
        height: 130,
        borderRadius: 100,
        marginBottom: 10,
    },
    changePhotoText: {
        color: '#2e7df6',
        fontSize: 14,
    },
    inputGroup: {
        marginBottom: 20,
    },
    label: {
        fontSize: 14,
        color: '#666',
        marginTop: 10,
    },
    input: {
        backgroundColor: '#f2f2f2',
        borderRadius: 10,
        padding: 10,
        marginTop: 5,
    },
    saveButton: {
        backgroundColor: '#2e7df6',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginBottom: 40,
    },
    saveButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default UserProfileScreen;