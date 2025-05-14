import { useEffect, useState } from 'react';

function History({ token }) {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const fetchHistory = async () => {
      const res = await fetch('http://localhost:8000/api/history', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await res.json();
      setHistory(data);
    };

    if (token) {
      fetchHistory();
    }
  }, [token]);

  return (
    <div className="mt-8 p-6 bg-gray-800 rounded text-white">
      <h2 className="text-xl mb-4">История анализов</h2>
      {history.length === 0 ? (
        <p>Нет записей</p>
      ) : (
        <ul>
          {history.map((entry, i) => (
            <li key={i} className="mb-2 border-b border-gray-600 pb-2">
              <p><strong>Файл:</strong> {entry.filename}</p>
              <p><strong>Уровень разрушения:</strong> {entry.damage_level}</p>
              <p><strong>Дата:</strong> {new Date(entry.analyzed_at).toLocaleString()}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default History;
