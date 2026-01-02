function ApplicationList({ applications }) {
  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600 bg-green-100 border-green-200';
    if (score >= 50) return 'text-yellow-600 bg-yellow-100 border-yellow-200';
    return 'text-red-600 bg-red-100 border-red-200';
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-slate-700">Ranked Candidates</h3>
      
      {applications.length === 0 && (
          <div className="text-center py-10 text-slate-400">No candidates processed yet.</div>
      )}

      {applications.map((app) => (
        <div key={app.id} className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition flex justify-between items-center">
          
          {/* Candidate Info */}
          <div>
            <h4 className="font-bold text-lg text-slate-800">{app.candidate_name}</h4>
            <p className="text-sm text-slate-500">{app.role_applied}</p>
          </div>

          {/* Match Score Badge */}
          <div className="text-right">
            <div className={`text-2xl font-black ${getScoreColor(app.match_score).split(' ')[0]}`}>
              {app.match_score}%
            </div>
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">Match Score</div>
          </div>

        </div>
      ))}
    </div>
  );
}
export default ApplicationList;