import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    const verifyToken = async () => {
      try {
        const res = await fetch('http://localhost:8000/api/verify-token', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (!res.ok) throw new Error('Invalid token');
      } catch {
        localStorage.removeItem('token');
        navigate('/login');
      }
    };
    verifyToken();
  }, [navigate]);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return;

    setLoading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('http://localhost:8000/api/analyze', {
        method: 'POST',
        body: formData,
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      const data = await res.json();
      setResult(data);
    } catch (err) {
      console.error('Ошибка при отправке:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-6">
      <div className="absolute top-4 right-4">
        <button onClick={handleLogout} className="bg-red-500 px-4 py-2 rounded">
          Logout
        </button>
      </div>

      <h1 className="text-3xl font-bold mb-6">Concrete Crack Analysis</h1>

      <form onSubmit={handleSubmit} className="flex flex-col items-center gap-4">
        <input type="file" onChange={handleFileChange} className="text-black" />
        <button
          type="submit"
          className="bg-blue-500 px-4 py-2 rounded hover:bg-blue-600"
        >
          {loading ? 'Analyzing...' : 'Upload & Analyze'}
        </button>
      </form>

      {result && (
        <div className="mt-6 p-4 bg-gray-800 rounded shadow-md text-left max-w-md w-full">
          <p><strong>Status:</strong> {result.status}</p>
          <p><strong>Message:</strong> {result.message}</p>
          <p><strong>Damage Level:</strong> {result.damage_level}</p>
          <p className="break-all"><strong>Image Path:</strong> {result.image}</p>
        </div>
      )}
    </div>
  );
}

export default Dashboard;