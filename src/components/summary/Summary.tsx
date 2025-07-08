import React, { useEffect } from 'react'
import { Dimensions, ScrollView, Text, View, Button } from 'react-native'
import { LineChart, PieChart, StackedBarChart } from 'react-native-chart-kit';
import { getCategoryWiseExpenseQuery, yearlyExpenseQuery } from '../../db/queries/analyticsQueries';
import { parse } from 'uuid';


const screenWidth = Dimensions.get('window').width;

const Summary: React.FC = () => {

  const [monthlySpending, setMonthlySpending] = React.useState({});
  const [categorySpending, setCategorySpending] = React.useState([]);


  useEffect(() => {
    getMonthlySpendData();
    getCategoryWiseSpendData();
  }, []);

  const getMonthlySpendData = async () => {
    try {
      const result = await yearlyExpenseQuery(2025);
      setMonthlySpending({
        labels: result.map(row => row.year_month),
        data: result.map(row => row.total_spent)
      });
    } catch (error) {
      console.error("Error fetching monthly spend data:", error);
    }
  };

  const getCategoryWiseSpendData = async () => {
    try {
      const result = await getCategoryWiseExpenseQuery(2025);
      console.log("Category Wise Spend Data:", result);
      const formattedData = result.map(row => ({
        name: row.category_name,
        amount: row.total_spent,
        color: `#${Math.floor(Math.random()*16777215).toString(16)}`, // Random color
        legendFontColor: '#333',
        legendFontSize: 14
      }));
      setCategorySpending(formattedData);
    } catch (error) {
      console.error("Error fetching monthly spend data:", error);
    }
  }

  const sampleData = [
    { category: 'Necessities', budget: 10000, spent: 8500 },
    { category: 'Enjoyment', budget: 3000, spent: 3500 },
    { category: 'Savings', budget: 5000, spent: 4500 },
    { category: 'Education', budget: 4000, spent: 1500 }
  ];

  const chartData = {
      labels: ['January', 'February', 'March', 'April', 'May', 'June'],
      datasets: [
        {
          data: [20, 45, 28, 80, 99, 43], // Dataset 1
          color: (opacity = 1) => `rgba(134, 65, 244, ${opacity})`, // Optional: color for dataset 1
        },
        {
          data: [50, 20, 70, 30, 60, 90], // Dataset 2
          color: (opacity = 1) => `rgba(255, 99, 132, ${opacity})`, // Optional: color for dataset 2
        },
      ],
    };

  const monthAbbr = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const data = {
  labels: ['Necessities', 'Enjoyment', 'Savings', 'Education'],
  legend: ["Spent", "Budget"],
  data: [
    [8500],  // Necessities
    [3500],   // Enjoyment
    [4500],   // Savings
    [1500],   // Education
  ],
  barColors: ["#66ccff", "#006699"]
};

  return (
    <ScrollView
  style={[styles.container, { flex: 1 }]}
  contentContainerStyle={{ flexGrow: 1 }}
>
      {/* Chart 1: Month vs amount spent */}
      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>Monthly spending Trend</Text>
        { monthlySpending.labels && monthlySpending.data ? (
          <LineChart 
            data={{
              labels: monthlySpending.labels.map(lbl => parseInt(lbl.split("-")[1], 10) - 1).map(monthIndex => monthAbbr[monthIndex]),
              datasets: [ { data: monthlySpending.data } ]
            }}
            width={screenWidth - 32}
            height={220}
            chartConfig={chartConfig}
            bezier
          />
        ) : (
          <Text>No data available</Text>
        )}
      </View>

      {/* Chart 2: Category vs amount spent */}
      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>Category-wise expense</Text>
        { categorySpending.length > 0 ? (
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
        ) : (
          <Text>No data available</Text>
        )}
      </View>


      {/* Chart 3: Budget vs amount spent */}
      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>Budget vs Spent</Text>
        { data ? (
          <StackedBarChart
            // style={graphStyle}
            data={data}
            width={screenWidth}
            height={220}
            chartConfig={chartConfig}
            hideLegend={false}
          />
        ) : (
          <Text>No data available</Text>
        )}
      </View>
     </ScrollView>
  )
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
