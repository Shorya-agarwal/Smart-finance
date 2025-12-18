import { useState } from 'react';
import axios from 'axios';

function TransactionForm({ onTransactionAdded }) {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!description || !amount) return;

    setLoading(true);
    try {
      // POST to backend
      const response = await axios.post('http://127.0.0.1:8000/transactions/', {
        description: description,
        amount: parseFloat(amount),
        user_id: 1 
      });

      onTransactionAdded(response.data);
      setDescription('');
      setAmount('');
    } catch (error) {
      console.error("Error adding transaction:", error);
      alert("Error connection to backend.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
      <h3 className="text-lg font-bold text-slate-800 mb-5">Add New Expense</h3>
      <form onSubmit={handleSubmit} className="space-y-5">
        
        <div>
          <label className="block text-sm font-semibold text-slate-600 mb-1">Description</label>
          <input
            type="text"
            placeholder="e.g. Starbucks, Uber, Rent"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-600 mb-1">Amount ($)</label>
          <input
            type="number"
            placeholder="0.00"
            step="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all outline-none"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-3 px-4 rounded-xl text-white font-bold shadow-lg transform transition-all active:scale-95 
            ${loading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 hover:shadow-blue-500/30'}`}
        >
          {loading ? 'Processing...' : 'Add Transaction'}
        </button>
      </form>
    </div>
  );
}

export default TransactionForm;