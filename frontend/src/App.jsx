import { useState, useEffect } from 'react';
import axios from 'axios';
import TransactionForm from '../components/TransactionForm';
import TransactionList from '../components/TransactionList';

function App() {
  const [transactions, setTransactions] = useState([]);
  const [totalExpenses, setTotalExpenses] = useState(0);

  const fetchTransactions = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/transactions/');
      setTransactions(response.data);
      calculateTotal(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const calculateTotal = (data) => {
    const total = data.reduce((acc, curr) => acc + curr.amount, 0);
    setTotalExpenses(total);
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const handleNewTransaction = (newTx) => {
    const updatedList = [newTx, ...transactions];
    setTransactions(updatedList);
    calculateTotal(updatedList);
  };

  return (
    <div className="min-h-screen bg-slate-100 font-sans text-slate-900">
      {/* Navbar */}
      <nav className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold">SF</div>
            <h1 className="text-xl font-bold tracking-tight text-slate-800">SmartFinance</h1>
          </div>
          {/* <div className="text-sm font-medium text-slate-500">Intuit Portfolio Project</div> */}
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header Stats */}
        <div className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-6 text-white shadow-lg">
            <p className="text-blue-100 text-sm font-medium mb-1">Total Expenses</p>
            <h2 className="text-3xl font-bold">${totalExpenses.toFixed(2)}</h2>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex flex-col justify-center">
             <p className="text-slate-500 text-sm font-medium">Recent Activity</p>
             <p className="text-2xl font-semibold text-slate-800">{transactions.length} Transactions</p>
          </div>
           <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex flex-col justify-center">
             <p className="text-slate-500 text-sm font-medium">AI Status</p>
             <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                <p className="text-lg font-semibold text-slate-800">Active</p>
             </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Form */}
          <div className="lg:col-span-1 space-y-6">
            <TransactionForm onTransactionAdded={handleNewTransaction} />
            
            <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
              <h4 className="font-semibold text-blue-900 mb-2 text-sm">💡 Pro Tip</h4>
              <p className="text-sm text-blue-800 leading-relaxed">
                Try descriptions like:
                <br/>• "Netflix subscription"
                <br/>• "Uber to airport"
                <br/>• "Grocery shopping at Walmart"
              </p>
            </div>
          </div>

          {/* Right Column: List */}
          <div className="lg:col-span-2">
            <TransactionList transactions={transactions} />
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;