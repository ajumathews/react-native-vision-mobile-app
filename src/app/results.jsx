import { useLocalSearchParams, useRouter } from 'expo-router';
import { Button, ScrollView, StyleSheet, Text, View } from 'react-native';

export default function Results() {
  const { result } = useLocalSearchParams();
  const router = useRouter();

  const handleBack = () => {
    router.back();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Analysis Results</Text>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <Text style={styles.resultText}>{result || 'No results available'}</Text>
      </ScrollView>
      <View style={styles.buttonContainer}>
        <Button title="Back to Home" onPress={handleBack} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    marginTop: 10,
    color: '#333',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  resultText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#666',
  },
  buttonContainer: {
    marginTop: 20,
    marginBottom: 10,
  },
});
