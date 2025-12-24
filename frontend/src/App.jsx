import { useState, useEffect } from 'react';
import axios from 'axios';
import TransactionForm from '../components/TransactionForm';
import TransactionList from '../components/TransactionList';
import AlertManager from '../components/AlertManager';

function App() {
  const [transactions, setTransactions] = useState([]);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [notification, setNotification] = useState(null);

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

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const handleNewTransaction = (response) => {
    // Check if response has 'transaction' and 'alerts' structure (new format)
    // or just a transaction object (old format / read format)
    let newTx;
    if (response.transaction) {
        newTx = response.transaction;
        if (response.alerts && response.alerts.length > 0) {
            setNotification({
                type: 'error',
                message: `⚠️ Alert Triggered: ${response.alerts.join(" | ")}`
            });
        }
    } else {
        newTx = response;
    }

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
        
        {notification && (
            <div className="mb-6 p-4 rounded-xl bg-red-100 border border-red-200 text-red-800 flex items-center gap-3 shadow-sm animate-bounce-short">
                <span className="text-2xl">🚨</span>
                <div>
                    <h3 className="font-bold">Incident Response Triggered</h3>
                    <p className="text-sm">{notification.message}</p>
                </div>
            </div>
        )}

        {/* Header Stats */}
        <div className="mb-8 grid grid-cols-1 md:grid-cols-4 gap-6">
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
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex flex-col justify-center">
             <p className="text-slate-500 text-sm font-medium">Health Status</p>
             <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${notification ? 'bg-red-500' : 'bg-emerald-500'} animate-pulse`}></span>
                <p className={`text-lg font-semibold ${notification ? 'text-red-700' : 'text-emerald-700'}`}>
                    {notification ? 'Anomalies Detected' : 'Healthy'}
                </p>
             </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Form & Alerts */}
          <div className="lg:col-span-1 space-y-6">
            <TransactionForm onTransactionAdded={handleNewTransaction} />
            <AlertManager />
            
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