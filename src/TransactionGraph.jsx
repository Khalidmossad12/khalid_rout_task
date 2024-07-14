import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { getData } from './dataService';

export default function TransactionGraph({ selectedCustomerId }) {
  const [data, setData] = useState({ customers: [], transactions: [] });
  const [graphData, setGraphData] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      const result = await getData();
      setData(result);
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (selectedCustomerId) {
      const customerTransactions = data.transactions.filter(transaction =>
        transaction.customer_id === selectedCustomerId
      );

      const groupedByDate = customerTransactions.reduce((acc, transaction) => {
        acc[transaction.date] = (acc[transaction.date] || 0) + transaction.amount;
        return acc;
      }, {});

      setGraphData({
        labels: Object.keys(groupedByDate),
        datasets: [{
          label: 'Transaction Amount',
          data: Object.values(groupedByDate),
          backgroundColor: 'rgba(75, 192, 192, 0.6)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1
        }]
      });
    }
  }, [selectedCustomerId, data.transactions]);

  return (
    <div>
      {selectedCustomerId ? <Bar data={graphData} /> : <p>Select a customer to see the graph.</p>}
    </div>
  );
}
