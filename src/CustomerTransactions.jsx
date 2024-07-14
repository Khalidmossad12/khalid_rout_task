import React, { useState, useMemo } from 'react';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';

const data = {
  customers: [
      { id: 1, name: "Ahmed Ali" },
      { id: 2, name: "Aya Elsayed" },
      { id: 3, name: "Mina Adel" },
      { id: 4, name: "Sarah Reda" },
      { id: 5, name: "Mohamed Sayed" }
  ],
  transactions: [
      { id: 1, customer_id: 1, date: "2022-01-01", amount: 1000 },
      { id: 2, customer_id: 1, date: "2022-01-02", amount: 2000 },
      { id: 3, customer_id: 2, date: "2022-01-01", amount: 550 },
      { id: 4, customer_id: 3, date: "2022-01-01", amount: 500 },
      { id: 5, customer_id: 2, date: "2022-01-02", amount: 1300 },
      { id: 6, customer_id: 4, date: "2022-01-01", amount: 750 },
      { id: 7, customer_id: 3, date: "2022-01-02", amount: 1250 },
      { id: 8, customer_id: 5, date: "2022-01-01", amount: 2500 },
      { id: 9, customer_id: 5, date: "2022-01-02", amount: 875 }
  ]
};

export default function CustomerTransactions() {
  const [filterName, setFilterName] = useState('');
  const [filterAmount, setFilterAmount] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  const filteredData = useMemo(() => {
      return {
          customers: data.customers.filter(customer =>
              customer.name.toLowerCase().includes(filterName.toLowerCase())
          ),
          transactions: data.transactions.filter(transaction => {
              const customer = data.customers.find(c => c.id === transaction.customer_id);
              return (
                  (!filterName || (customer && customer.name.toLowerCase().includes(filterName.toLowerCase()))) &&
                  (!filterAmount || transaction.amount >= parseFloat(filterAmount))
              );
          })
      };
  }, [filterName, filterAmount]);

  const customerTransactions = selectedCustomer
      ? filteredData.transactions.filter(transaction => transaction.customer_id === selectedCustomer.id)
      : [];

  const chartData = useMemo(() => {
      const grouped = customerTransactions.reduce((acc, transaction) => {
          if (!acc[transaction.date]) acc[transaction.date] = 0;
          acc[transaction.date] += transaction.amount;
          return acc;
      }, {});

      return {
          labels: Object.keys(grouped),
          datasets: [
              {
                  label: 'Total Transaction Amount',
                  data: Object.values(grouped),
                  borderColor: 'rgba(75,192,192,1)',
                  backgroundColor: 'rgba(75,192,192,0.2)',
                  fill: true
              }
          ]
      };
  }, [customerTransactions]);

  return (
    <div className='mt-4'>
        <h1 className='head'>Customer Transactions</h1>
        <div className='mt-3 mb-5'>
            <input
                className=' ms-4 search'
                type="text"
                placeholder="Filter by customer name"
                value={filterName}
                onChange={(e) => setFilterName(e.target.value)}
            />
            <input
                className=' ms-4 search'
                type="number"
                placeholder="Filter by transaction amount"
                value={filterAmount}
                onChange={(e) => setFilterAmount(e.target.value)}
            />
        </div>
        <table className='w-75 mx-auto' >
            <thead>
                <tr>
                    <td>Customer Name</td>
                    <td>Transaction Date</td>
                    <td>Transaction Amount</td>
                </tr>
            </thead>
            <tbody>
                {filteredData.transactions.map(transaction => {
                    const customer = data.customers.find(c => c.id === transaction.customer_id);
                    return (
                        <tr key={transaction.id}>
                            <td onClick={() => setSelectedCustomer(customer)} style={{ cursor: 'pointer', color: '#030530' }}>
                                {customer ? customer.name : 'Unknown'}
                            </td>
                            <td>{transaction.date}</td>
                            <td>{transaction.amount}</td>
                        </tr>
                    );
                })}
            </tbody>
        </table>
        {selectedCustomer && (
            <div className='my-5'>
                <h2>{selectedCustomer.name}'s Transactions</h2>
                <Line data={chartData} />
            </div>
        )}
    </div>
  );
}
