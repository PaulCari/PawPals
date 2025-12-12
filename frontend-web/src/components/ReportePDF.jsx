import React from 'react';
import { Page, Text, View, Document, StyleSheet, Image } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    padding: 40,
    backgroundColor: '#FFFFFF',
    fontFamily: 'Helvetica',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    borderBottomWidth: 2,
    borderBottomColor: '#875686', // Paw Purple
    paddingBottom: 10,
  },
  brand: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#875686',
  },
  subBrand: {
    fontSize: 10,
    color: '#A0AEC0',
  },
  dateInfo: {
    textAlign: 'right',
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FF8C42', // Paw Orange
    marginTop: 15,
    marginBottom: 5,
    textTransform: 'uppercase',
  },
  text: {
    fontSize: 11,
    color: '#333333',
    lineHeight: 1.5,
    textAlign: 'justify',
  },
  patientBox: {
    backgroundColor: '#F3F4F6',
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  patientInfo: {
    fontSize: 12,
    color: '#2A1B4E',
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 40,
    right: 40,
    textAlign: 'center',
    fontSize: 10,
    color: '#9ca3af',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    paddingTop: 10,
  },
});

// Este es el componente que recibe los datos y dibuja el PDF
const ReportePDF = ({ data, consulta }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      
      {/* HEADER */}
      <View style={styles.header}>
        <View>
          <Text style={styles.brand}>PawPals</Text>
          <Text style={styles.subBrand}>Nutrición Especializada</Text>
        </View>
        <View style={styles.dateInfo}>
          <Text style={{ fontSize: 10, color: '#666' }}>Fecha de Consulta</Text>
          <Text style={{ fontSize: 12 }}>{new Date(consulta.fecha).toLocaleDateString()}</Text>
        </View>
      </View>

      {/* DATOS DEL PACIENTE */}
      <View style={styles.patientBox}>
        <View>
          <Text style={{ fontSize: 10, color: '#875686', marginBottom: 2 }}>PACIENTE</Text>
          <Text style={{ fontSize: 14, fontWeight: 'bold' }}>{data.nombre}</Text>
        </View>
        <View>
          <Text style={{ fontSize: 10, color: '#875686', marginBottom: 2 }}>ESPECIE / RAZA</Text>
          <Text style={styles.patientInfo}>{data.especie} - {data.raza}</Text>
        </View>
        <View>
          <Text style={{ fontSize: 10, color: '#875686', marginBottom: 2 }}>EDAD</Text>
          <Text style={styles.patientInfo}>{data.edad} años</Text>
        </View>
        <View>
          <Text style={{ fontSize: 10, color: '#875686', marginBottom: 2 }}>PESO</Text>
          <Text style={styles.patientInfo}>{data.peso} kg</Text>
        </View>
      </View>

      {/* CUERPO DEL INFORME */}
      <View>
        <Text style={styles.sectionTitle}>Diagnóstico y Observaciones</Text>
        <Text style={styles.text}>{consulta.diagnostico}</Text>
      </View>

      <View style={{ marginTop: 10 }}>
        <Text style={styles.sectionTitle}>Plan Nutricional Recomendado</Text>
        <Text style={styles.text}>{consulta.plan_nutricional}</Text>
      </View>

      <View style={{ marginTop: 20 }}>
        <Text style={styles.sectionTitle}>Indicaciones Adicionales</Text>
        <Text style={styles.text}>
          Recuerda realizar la transición a la dieta BARF de forma gradual. 
          Si observas alguna reacción adversa, suspende y contáctanos.
        </Text>
      </View>

      {/* FOOTER */}
      <Text style={styles.footer}>
        Atendido por: {consulta.nutricionista} • PawPals Veterinary Services • www.pawpals.com
      </Text>

    </Page>
  </Document>
);

export default ReportePDF;