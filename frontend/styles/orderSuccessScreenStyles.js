// frontend/styles/orderSuccessScreenStyles.js

import { StyleSheet } from 'react-native';

const MAIN_PURPLE = '#875686';
const SECOND_PURPLE = '#732C71';
const ORANGE = '#FF8C42';
const YELLOW = '#FFD100';

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F9F9F9',
  },

  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
    position: 'relative',
  },

  // === ÍCONO DE ÉXITO ===
  iconContainer: {
    marginBottom: 40,
  },

  iconCircle: {
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: "#4CAF50",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 12,
  },

  // === MENSAJE ===
  messageContainer: {
    alignItems: 'center',
    width: '100%',
  },

  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
    textAlign: 'center',
  },

  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 24,
  },

  // === INFORMACIÓN DEL PEDIDO ===
  orderInfoCard: {
    width: '100%',
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 25,
    marginBottom: 25,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
  },

  orderInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  orderInfoLabel: {
    fontSize: 15,
    color: '#666',
    fontWeight: '500',
  },

  orderInfoValue: {
    fontSize: 16,
    color: '#333',
    fontWeight: 'bold',
  },

  orderInfoValueHighlight: {
    fontSize: 20,
    color: SECOND_PURPLE,
    fontWeight: 'bold',
  },

  divider: {
    height: 1,
    backgroundColor: '#E0E0E0',
    marginVertical: 15,
  },

  // === INFORMACIÓN ADICIONAL ===
  additionalInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F0F5',
    borderRadius: 15,
    padding: 15,
    marginBottom: 40,
  },

  additionalInfoText: {
    flex: 1,
    marginLeft: 12,
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },

  // === BOTONES ===
  buttonsContainer: {
    width: '100%',
    gap: 15,
  },

  primaryButton: {
    backgroundColor: ORANGE,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 30,
    shadowColor: ORANGE,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },

  primaryButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
  },

  secondaryButton: {
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: MAIN_PURPLE,
  },

  secondaryButtonText: {
    color: MAIN_PURPLE,
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
  },

  // === DECORACIÓN ===
  decorationCircle1: {
    position: 'absolute',
    top: -50,
    right: -50,
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: YELLOW,
    opacity: 0.15,
  },

  decorationCircle2: {
    position: 'absolute',
    bottom: -80,
    left: -80,
    width: 250,
    height: 250,
    borderRadius: 125,
    backgroundColor: MAIN_PURPLE,
    opacity: 0.1,
  },
});