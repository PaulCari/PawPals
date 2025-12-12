import { StyleSheet } from 'react-native';

const PRIMARY_PURPLE = '#732C71';
const DISABLED_GREY = '#cccccc';
const SECONDARY_LAVENDER = '#E6E6FA';

export const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    width: '100%',
    padding: 30,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    alignItems: 'center',
    paddingTop: 40,
  },
  // --- FORMULARIO ---
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    alignSelf: 'flex-start',
    marginBottom: 20,
    color: '#333',
  },
  input: {
    width: '100%',
    height: 50,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    marginBottom: 20,
    fontSize: 16,
  },
  // --- BOTONES ---
  button: {
    width: '100%',
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  buttonPrimary: {
    backgroundColor: PRIMARY_PURPLE,
  },
  buttonDisabled: {
    backgroundColor: DISABLED_GREY,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  buttonRow: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  buttonFlex: {
    flex: 1,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonSecondary: {
    backgroundColor: SECONDARY_LAVENDER,
    marginRight: 10,
  },
  buttonSecondaryText: {
    color: PRIMARY_PURPLE,
    fontSize: 18,
    fontWeight: 'bold',
  },
  // --- PICKERS (SELECTORES) ---
  pickerContainer: {
    width: '100%',
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  pickerLabel: {
    color: '#888',
    fontSize: 16,
    paddingTop: 10,
  },
  picker: {
    width: '100%',
    height: 40,
    color: '#000',
  },
  // --- PAGINACIÓN ---
  progressContainer: {
    flexDirection: 'row',
    marginTop: 30,
  },
  progressDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#ccc',
    marginHorizontal: 5,
  },
  progressDotActive: {
    backgroundColor: PRIMARY_PURPLE,
  },
buttonTextDisabled: {
  color: '#666', // gris oscuro visible
  fontSize: 18,
  fontWeight: 'bold',
},

});