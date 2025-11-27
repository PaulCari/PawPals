import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    width: '100%',
    padding: 25,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    alignItems: 'center',
  },
  tabContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    backgroundColor: '#f0f0f0',
    borderRadius: 25,
    padding: 5,
  },
  tab: {
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 20,
  },
  activeTab: {
    backgroundColor: '#FFD100',
  },
  tabText: {
    color: '#888',
    fontWeight: '600',
  },
  activeTabText: {
    color: '#333',
    fontWeight: 'bold',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    alignSelf: 'flex-start',
    marginBottom: 40,
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
  inputError: {
    borderBottomColor: 'red',
  },
  inputSuccess: {
    borderBottomColor: 'green',
  },
  errorMessage: {
    color: 'red',
    alignSelf: 'flex-start',
    marginBottom: 10,
    marginTop: -15,
  },
  successMessage: {
    color: 'green',
    alignSelf: 'flex-start',
    marginBottom: 10,
    marginTop: -15,
  },
  buttonPrimary: {
    width: '100%',
    height: 50,
    backgroundColor: '#732C71',
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  buttonDisabled: {
    backgroundColor: '#cccccc',
  },
  progressContainer: {
    flexDirection: 'row',
    marginTop: 20,
  },
  progressDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#ccc',
    marginHorizontal: 5,
  },
  progressDotActive: {
    backgroundColor: '#732C71',
  },
  buttonRow: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  buttonPrimaryFlex: {
    flex: 1,
    marginRight: 10,
    height: 50,
    backgroundColor: '#732C71',
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonSecondaryFlex: {
    flex: 1,
    marginLeft: 10,
    height: 50,
    backgroundColor: '#E6E6FA',
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonSecondaryText: {
    color: '#732C71',
    fontSize: 18,
    fontWeight: 'bold',
  },
});