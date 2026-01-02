import { useState } from 'react';
import axios from 'axios';

function ApplicationForm({ onAdd }) {
  const [formData, setFormData] = useState({
    candidate_name: '',
    role_applied: '',
    resume_text: '',
    job_description: ''
  });
  const [loading,FLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post('http://127.0.0.1:8000/applications/', {
        ...formData,
        user_id: 1
      });
      onAdd(response.data);
      // Reset form but keep JD (convenience)
      setFormData({...formData, candidate_name: '', resume_text: ''}); 
    } catch (error) {
      console.error(error);
      alert("Failed to process application");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 h-fit sticky top-6">
      <h3 className="text-lg font-bold text-slate-800 mb-5">AI Screener</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input 
          className="w-full p-3 bg-slate-50 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder="Candidate Name"
          value={formData.candidate_name}
          onChange={e => setFormData({...formData, candidate_name: e.target.value})}
        />
        <input 
          className="w-full p-3 bg-slate-50 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder="Role (e.g. Senior Dev)"
          value={formData.role_applied}
          onChange={e => setFormData({...formData, role_applied: e.target.value})}
        />
        <textarea 
          className="w-full p-3 bg-slate-50 rounded-xl border border-slate-200 h-32 outline-none focus:ring-2 focus:ring-indigo-500 text-xs"
          placeholder="Paste Resume Text Here..."
          value={formData.resume_text}
          onChange={e => setFormData({...formData, resume_text: e.target.value})}
        />
        <textarea 
          className="w-full p-3 bg-slate-50 rounded-xl border border-slate-200 h-32 outline-none focus:ring-2 focus:ring-indigo-500 text-xs"
          placeholder="Paste Job Description Here..."
          value={formData.job_description}
          onChange={e => setFormData({...formData, job_description: e.target.value})}
        />
        <button disabled={loading} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl transition-all">
          {loading ? 'Analyzing Keywords...' : 'Calculate Match Score'}
        </button>
      </form>
    </div>
  );
}
export default ApplicationForm;