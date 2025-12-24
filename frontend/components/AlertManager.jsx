import { useState, useEffect } from 'react';
import axios from 'axios';

function AlertManager() {
  const [alerts, setAlerts] = useState([]);
  const [newAlert, setNewAlert] = useState({
    category: 'ALL',
    amount_limit: '',
    window: 'TRANSACTION',
    user_id: 1 // Hardcoded for single user demo
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchAlerts();
  }, []);

  const fetchAlerts = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/alerts/');
      setAlerts(response.data);
    } catch (error) {
      console.error("Error fetching alerts:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newAlert.amount_limit) return;
    setIsLoading(true);

    try {
      await axios.post('http://127.0.0.1:8000/alerts/', {
        ...newAlert,
        amount_limit: parseFloat(newAlert.amount_limit)
      });
      setNewAlert({ ...newAlert, amount_limit: '' });
      fetchAlerts();
    } catch (error) {
      console.error("Error creating alert:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
      <div className="p-6 border-b border-slate-100 bg-red-50">
        <h3 className="text-lg font-semibold text-red-900">🚨 Alert Thresholds</h3>
        <p className="text-sm text-red-700">Set limits to trigger incident response alerts.</p>
      </div>

      <div className="p-6 space-y-6">
        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
                <select
                    className="w-full rounded-lg border-slate-300 shadow-sm focus:border-red-500 focus:ring-red-500 py-2.5 px-3 border"
                    value={newAlert.category}
                    onChange={(e) => setNewAlert({...newAlert, category: e.target.value})}
                >
                    <option value="ALL">ALL (Global Limit)</option>
                    <option value="Food">Food</option>
                    <option value="Transportation">Transportation</option>
                    <option value="Entertainment">Entertainment</option>
                    <option value="Housing">Housing</option>
                    <option value="Utilities">Utilities</option>
                    <option value="Insurance">Insurance</option>
                    <option value="Healthcare">Healthcare</option>
                    <option value="Savings">Savings</option>
                    <option value="Personal">Personal</option>
                    <option value="Miscellaneous">Miscellaneous</option>
                </select>
            </div>
            <div>
                 <label className="block text-sm font-medium text-slate-700 mb-1">Limit Amount ($)</label>
                 <input
                    type="number"
                    step="0.01"
                    placeholder="e.g., 100.00"
                    className="w-full rounded-lg border-slate-300 shadow-sm focus:border-red-500 focus:ring-red-500 py-2.5 px-3 border"
                    value={newAlert.amount_limit}
                    onChange={(e) => setNewAlert({...newAlert, amount_limit: e.target.value})}
                 />
            </div>

            <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-2.5 rounded-lg shadow-sm transition-all disabled:opacity-50"
            >
                {isLoading ? 'Setting...' : 'Set Threshold'}
            </button>
        </form>

        {/* List */}
        <div className="space-y-3">
            <h4 className="font-medium text-slate-800 text-sm">Active Thresholds</h4>
            {alerts.length === 0 && <p className="text-slate-400 text-sm italic">No thresholds set.</p>}
            {alerts.map(alert => (
                <div key={alert.id} className="flex justify-between items-center p-3 bg-slate-50 rounded-lg border border-slate-100 text-sm">
                    <span className="font-medium text-slate-700">
                        {alert.category === 'ALL' ? 'Global' : alert.category}
                    </span>
                    <span className="font-bold text-red-600">
                        &gt; ${alert.amount_limit.toFixed(2)}
                    </span>
                </div>
            ))}
        </div>
      </div>
    </div>
  );
}

export default AlertManager;