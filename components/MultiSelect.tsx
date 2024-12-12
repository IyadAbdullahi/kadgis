import React from 'react';
import { Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from '@expo/vector-icons/Octicons';

interface MultiSelectItemProps {
  label: string;
  value: string | number;
  selectedValues: Array<string | number>;
  onSelect: (value: string | number) => void;
}

const MultiSelectItem: React.FC<MultiSelectItemProps> = ({
  label,
  value,
  selectedValues,
  onSelect,
}) => {
  const isSelected = selectedValues.includes(value);

  return (
    <TouchableOpacity
      style={[styles.container, isSelected ? styles.selected : styles.unselected]}
      onPress={() => onSelect(value)}
    >
      <Icon
        name="check-circle"
        size={15}
        color={isSelected ? 'green' : '#fff'}
      />
      <Text
        style={styles.label}
        numberOfLines={1}
        ellipsizeMode="tail"
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 5,
    alignItems: 'center',
    borderRadius: 24, // Equivalent to rounded-3xl
    paddingVertical: 10,
    paddingLeft: 12,
    paddingRight: 16,
    marginRight: 12,
  },
  selected: {
    backgroundColor: '#E5E7EB', // Equivalent to bg-slate-300
  },
  unselected: {
    backgroundColor: '#F3F4F6', // Equivalent to bg-slate-100
  },
  label: {
    fontWeight: 'bold',
    fontSize: 12, // Equivalent to text-sm
    color: '#6B7280', // Equivalent to text-slate-500
  },
});

export default MultiSelectItem;
