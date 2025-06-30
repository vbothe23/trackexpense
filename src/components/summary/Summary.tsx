import React from 'react'
import { Dimensions, ScrollView, Text, View } from 'react-native'
import { LineChart, PieChart } from 'react-native-chart-kit';


const screenWidth = Dimensions.get('window').width;

const monthlySpending = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr'],
    data: [5000, 6500, 4000, 7000]
  };

  const categorySpending = [
    {
      name: 'Necessities',
      amount: 10500,
      color: '#f39c12',
      legendFontColor: '#333',
      legendFontSize: 14
    },
    {
      name: 'Enjoyment',
      amount: 3000,
      color: '#e74c3c',
      legendFontColor: '#333',
      legendFontSize: 14
    }
  ];

const Summary: React.FC = () => {

  return (
    <ScrollView style={styles.container}>
      {/* Chart 1: Month vs amount spent */}
      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>Monthly spending Trend</Text>
        <LineChart 
          data={{
            labels: monthlySpending.labels,
            datasets: [ { data: monthlySpending.data } ]
          }}
          width={screenWidth - 32}
          height={220}
          chartConfig={chartConfig}
          bezier
        />
      </View>

      {/* Chart 2: Category vs amount spent */}
      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>Category-wise expense</Text>
        <PieChart 
          data={categorySpending}
          width={screenWidth - 32}
          height={220}
          accessor='amount'
          backgroundColor='transparent'
          paddingLeft='15'
          chartConfig={chartConfig}
          style={styles.chart}
        />
      </View>

      {/* Chart 3:Budget vs actual spent */}
      {/* <View>
        <Text>Category-wise expense</Text>
      </View> */}

    </ScrollView>
  )



  // return (
  //   <View>
  //       <Text>This is Summary Screen.</Text>
  //   </View>
  // )
}

const chartConfig = {
  backgroundGradientFrom: '#fff',
  backgroundGradientTo: '#fff',
  decimalPlaces: 0,
  color: (opacity = 1) => `rgba(33, 150, 243, ${opacity})`,
   labelColor: (opacity = 1) => `rgba(51, 51, 51, ${opacity})`,
   propsForDots: {
    r: '4',
    strokeWidth: '2',
    stroke: '#2196F3'
  }
};

const styles = {
  container: {
    padding: 16,
    paddingBottom: 32,
    backgroundColor: '#f9f9f9',
  },
  chartContainer: {
    marginBottom: 24
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12
  },
  chart: {
    borderRadius: 12
  }
}

export default Summary;
