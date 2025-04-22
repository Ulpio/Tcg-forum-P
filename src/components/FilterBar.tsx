import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const categories = ['Todos', 'Magic', 'Yu-Gi-Oh!', 'Pokémon'];

type Props = {
  filter: string;
  setFilter: (value: string) => void;
};

const FilterBar = ({ filter, setFilter }: Props) => {
  return (
    <View style={styles.container}>
      {categories.map((cat) => (
        <TouchableOpacity
          key={cat}
          style={[styles.button, filter === cat && styles.activeButton]}
          onPress={() => setFilter(cat)}
        >
          <Text style={[styles.buttonText, filter === cat && styles.activeText]}>{cat}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 10,
  },
  button: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    backgroundColor: '#333',
  },
  activeButton: {
    backgroundColor: '#556b2f',
  },
  buttonText: {
    color: '#ccc',
    fontSize: 14,
  },
  activeText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default FilterBar;
