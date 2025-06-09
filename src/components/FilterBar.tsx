// components/FilterBar.tsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import type { Dispatch, SetStateAction } from 'react';

export type FilterType = 'Todos' | 'Magic' | 'Yu-Gi-Oh!' | 'Pokémon';

type Props = {
  filter: FilterType;
  setFilter: Dispatch<SetStateAction<FilterType>>;  // <- aqui
};

const categories: FilterType[] = ['Todos', 'Magic', 'Yu-Gi-Oh!', 'Pokémon'];

export default function FilterBar({ filter, setFilter }: Props) {
  return (
    <View style={styles.container}>
      {categories.map(cat => (
        <TouchableOpacity
          key={cat}
          style={[styles.button, filter === cat && styles.activeButton]}
          onPress={() => setFilter(cat)}
        >
          <Text style={[styles.text, filter === cat && styles.activeText]}>
            {cat}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

// …styles continuam os mesmos
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
    backgroundColor: '#2a2a2a',
    borderRadius: 10,
    marginBottom: 16,
  },
  button: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 5,
  },
  activeButton: {
    backgroundColor: '#4a90e2',
  },
  text: {
    color: '#fff',
    fontSize: 16,
  },
  activeText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});