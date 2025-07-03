import React, { useState, useEffect, useRef } from 'react';

export default function App() { const [prompt, setPrompt] = useState(''); const [responseData, setResponseData] = useState(null); const [error, setError] = useState(''); const [loading, setLoading] = useState(false); const [connection, setConnection] = useState({ host: '', port: '', user: '', password: '', database: '' }); const scrollRef = useRef(null);

const handleSubmit = async () => { if (!prompt.trim()) { setError('Please enter a prompt before submitting.'); return; }

setLoading(true);
setError('');
setResponseData(null);

try {
  const res = await fetch('http://localhost:8000/query', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt, connection })
  });
  const result = await res.json();
  if (result.error) {
    setError(result.error);
  } else {
    setResponseData(result);
  }
} catch (err) {
  setError('Failed to connect to server');
}
setLoading(false);

};

useEffect(() => { if (scrollRef.current) { scrollRef.current.scrollIntoView({ behavior: 'smooth' }); } }, [responseData]);

const handleClear = () => { setPrompt(''); setResponseData(null); setError(''); };

const handleConnectionChange = (e) => { setConnection({ ...connection, [e.target.name]: e.target.value }); };

return ( <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white flex flex-col items-center justify-center p-6"> <div className="w-full max-w-4xl bg-[#262626] p-8 rounded-2xl shadow-2xl text-center"> <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-400 mb-8 animate-fade-in"> 🧠 QueryBuddy </h1>

<div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
      {['host', 'port', 'user', 'password', 'database'].map((field) => (
        <input
          key={field}
          name={field}
          value={connection[field]}
          onChange={handleConnectionChange}
          placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
          className="bg-gray-700/50 text-white p-3 rounded-lg border border-gray-600 focus:ring-2 focus:ring-green-400 placeholder-gray-400"
          type={field === 'password' ? 'password' : 'text'}
        />
      ))}
    </div>

    <div className="w-full bg-gray-800/50 rounded-xl p-4 mb-6">
      <textarea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        className="w-full h-[180px] p-4 text-lg text-white bg-transparent focus:outline-none resize-none placeholder-gray-400 rounded-xl border border-gray-600 focus:ring-2 focus:ring-blue-400"
        placeholder="💬 Type your SQL-related prompt here..."
      ></textarea>
    </div>

    <div className="flex flex-col md:flex-row justify-center gap-4 mb-4">
      <button
        onClick={handleSubmit}
        disabled={loading}
        className="bg-gradient-to-r from-green-400 to-blue-500 text-white px-8 py-3 rounded-full shadow-lg hover:brightness-110 transition-all duration-200 text-lg font-semibold"
      >
        {loading ? 'Generating...' : '▶ Run Query'}
      </button>
      <button
        onClick={handleClear}
        className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-8 py-3 rounded-full shadow-lg hover:brightness-110 transition-all duration-200 text-lg font-semibold"
      >
        ❌ Clear
      </button>
    </div>

    {error && <p className="text-red-400 mt-4 text-lg">❌ {error}</p>}

    {responseData && (
      <div ref={scrollRef} className="mt-8 text-left w-full animate-fade-in">
        <p className="font-semibold text-xl mb-3 text-green-300">🧾 Generated SQL:</p>
        <div className="relative bg-black text-green-400 p-4 pl-5 pr-5 rounded-lg text-sm font-mono ring-2 ring-green-500 shadow-lg overflow-x-auto whitespace-pre-wrap break-words">
          {responseData.sql}
        </div>
        <div className="text-right mt-2">
          <button
            onClick={() => navigator.clipboard.writeText(responseData.sql)}
            className="bg-gray-700 text-white text-xs px-4 py-1 rounded hover:bg-gray-600 shadow-md"
          >
            📋 Copy
          </button>
        </div>

        <p className="font-semibold text-xl mb-2 mt-6 text-blue-300">📊 Output:</p>
        <div className="overflow-x-auto border rounded-lg bg-gray-900 border-gray-700">
          <table className="min-w-full divide-y divide-gray-700">
            <thead className="bg-gray-800">
              <tr>
                {Object.keys(responseData.data[0] || {}).map((key) => (
                  <th key={key} className="px-4 py-2 text-sm font-semibold text-gray-300 border-b text-center">
                    {key}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {responseData.data.map((row, rowIndex) => (
                <tr key={rowIndex} className="hover:bg-gray-800 transition">
                  {Object.values(row).map((value, colIndex) => (
                    <td key={colIndex} className="px-4 py-2 text-sm text-gray-100 border-b text-center">
                      {value}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    )}
  </div>
</div>

); }

