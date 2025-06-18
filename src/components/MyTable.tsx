import * as React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { DataTable } from 'react-native-paper';

const MyComponent = () => {
  const data = [
    { id: 1, name: 'Cupcake', description: 'A delicious cupcake with chocolate frosting.' },
    { id: 2, name: 'Eclair', description: 'A long eclair filled with custard and topped with icing sugar.' },
    { id: 3, name: 'Frozen Yogurt', description: 'Healthy frozen yogurt with fruit toppings and a very long description to demonstrate text wrapping behavior in a table cell.' },
  ];

  return (
    <View style={styles.container}>
      <DataTable>
        {/* Header */}
        <DataTable.Header>
          <DataTable.Title style={styles.headerCell}>
            <Text style={styles.headerText}>ID</Text>
          </DataTable.Title>
          <DataTable.Title style={styles.headerCell}>
            <Text style={styles.headerText}>Name</Text>
          </DataTable.Title>
          <DataTable.Title style={styles.headerCell}>
            <Text style={styles.headerText}>Description</Text>
          </DataTable.Title>
        </DataTable.Header>

        {/* Rows */}
        {data.map((item) => (
          <DataTable.Row key={item.id} style={styles.row}>
            <DataTable.Cell style={styles.cell}>
              <View style={styles.textContainer}>
                <Text style={styles.cellText} numberOfLines={0}>
                  {item.id}
                </Text>
              </View>
            </DataTable.Cell>
            <DataTable.Cell style={styles.cell}>
              <View style={styles.textContainer}>
                <Text style={styles.cellText} numberOfLines={0}>
                  {item.name}
                </Text>
              </View>
            </DataTable.Cell>
            <DataTable.Cell style={styles.cell}>
              <View style={styles.textContainer}>
                <Text style={styles.cellText} numberOfLines={0}>
                  {item.description}
                </Text>
              </View>
            </DataTable.Cell>
          </DataTable.Row>
        ))}
      </DataTable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  headerCell: {
    width: 100, // Fixed width for header
    paddingVertical: 8,
  },
  headerText: {
    textAlign: 'left',
    fontSize: 14,
    fontWeight: 'bold',
  },
  row: {
    // No height to allow dynamic expansion
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  cell: {
    width: 100, // Fixed width for cells
    paddingVertical: 8,
    justifyContent: 'center', // Vertical centering
  },
  textContainer: {
    width: 92, // Slightly less than cell width to account for padding
  },
  cellText: {
    textAlign: 'left',
    fontSize: 14,
  },
});

export default MyComponent;