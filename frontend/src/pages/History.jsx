import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function History() {
  const navigate = useNavigate();
  const [history, setHistory] = useState([]);
  const [error, setError] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [newName, setNewName] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    const fetchHistory = async () => {
      try {
        const res = await fetch('http://localhost:8000/api/analyses/history', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error('Ошибка загрузки истории');
        const data = await res.json();
        setHistory(data.results);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchHistory();
  }, [navigate]);

  const handleEdit = (id, currentName) => {
    setEditingId(id);
    setNewName(currentName);
  };

  const handleSave = async (id) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:8000/api/analyses/${id}/update-name`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ filename: newName }),
      });

      if (!res.ok) throw new Error('Ошибка обновления имени');
      setHistory((prev) =>
        prev.map((entry) =>
          entry.id === id ? { ...entry, filename: newName } : entry
        )
      );
      setEditingId(null);
      setNewName('');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen p-8 bg-gray-100">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-blue-800 mb-6">История анализов</h1>

        {error && <p className="text-red-600 mb-4">{error}</p>}

        <div className="bg-white p-6 rounded-xl shadow-lg">
          {history.length === 0 ? (
            <p className="text-gray-500">Анализы пока не проводились.</p>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-gray-600 border-b">
                  <th className="p-2">Название</th>
                  <th className="p-2">Дата</th>
                  <th className="p-2">Трещины</th>
                  <th className="p-2">Класс бетона</th>
                  <th className="p-2">Действие</th>
                </tr>
              </thead>
              <tbody>
                {history.map((entry) => (
                  <tr key={entry.id} className="border-b hover:bg-gray-50">
                    <td className="p-2">
                      {editingId === entry.id ? (
                        <input
                          value={newName}
                          onChange={(e) => setNewName(e.target.value)}
                          className="border px-2 py-1 rounded"
                        />
                      ) : (
                        entry.filename
                      )}
                    </td>
                    <td className="p-2">{new Date(entry.analyzed_at).toLocaleString()}</td>
                    <td className="p-2">
                      {entry.damage_level === 'cracked' ? 'Обнаружены' : 'Нет'}
                    </td>
                    <td className="p-2">{entry.concrete_class}</td>
                    <td className="p-2">
                      {editingId === entry.id ? (
                        <button
                          onClick={() => handleSave(entry.id)}
                          className="text-green-600 hover:underline"
                        >
                          Сохранить
                        </button>
                      ) : (
                        <button
                          onClick={() => handleEdit(entry.id, entry.filename)}
                          className="text-blue-600 hover:underline"
                        >
                          Редактировать
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

export default History;