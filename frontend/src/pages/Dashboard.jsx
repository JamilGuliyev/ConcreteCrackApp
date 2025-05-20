import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState(null);

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
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    setError(null);

    if (selectedFile) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(selectedFile);
    } else {
      setPreview(null);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setError('Пожалуйста, выберите изображение');
      return;
    }

    setLoading(true);
    setResult(null);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('http://localhost:8000/api/images/analyze', {
        method: 'POST',
        body: formData,
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!res.ok) {
        throw new Error('Ошибка анализа. Попробуйте снова.');
      }

      const data = await res.json();
      setResult(data);
    } catch (err) {
      setError(err.message);
      console.error('Analysis error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 flex justify-center items-center px-4 py-10">
      <div className="w-full max-w-5xl mx-auto">
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4 sm:gap-0">
          <h1 className="text-3xl font-bold text-blue-800 text-center sm:text-left leading-snug">
            Выявление трещин и определение класса тяжелого бетона по изображению
          </h1>
          <button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors shadow-md"
          >
            Выйти из аккаунта
          </button>
        </header>

        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800 text-center">Загрузите изображение бетона</h2>

          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex-1">
                <div className={`border-2 border-dashed rounded-lg p-6 text-center ${preview ? 'border-blue-500' : 'border-gray-300'} transition-colors`}>
                  {preview ? (
                    <div className="mb-4">
                      <img
                        src={preview}
                        alt="Preview"
                        className="max-h-64 mx-auto rounded-lg shadow-sm"
                      />
                    </div>
                  ) : (
                    <div className="py-4 flex flex-col items-center justify-center space-y-2">
                      <svg className="text-gray-400" style={{ width: '40px', height: '40px' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                      </svg>
                      <p className="text-sm text-gray-600 text-center">Перетащите сюда изображение или выберите его</p>
                    </div>
                  )}
                  <input type="file" onChange={handleFileChange} accept="image/*" className="hidden" id="file-upload" />
                  <label
                    htmlFor="file-upload"
                    className="mt-2 inline-block bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg cursor-pointer transition-colors w-full sm:w-auto"
                  >
                    {preview ? 'Изменить изображение' : 'Выбрать изображение'}
                  </label>
                </div>
                {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
              </div>

              {result && (
                <div className="flex-1">
                  <div className="bg-gray-50 rounded-lg p-6 h-full">
                    <h3 className="text-xl font-semibold mb-4 text-gray-800">Результаты анализа</h3>
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm font-medium text-gray-500">Статус</p>
                        <p className={`font-semibold ${result.status === 'success' ? 'text-green-600' : 'text-red-600'}`}>
                          {result.status}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Тип повреждения</p>
                        <p className={`text-lg font-bold ${result.damage_level === 'cracked' ? 'text-red-600' : 'text-green-600'}`}>
                          {result.damage_level === 'cracked' ? 'Обнаружена трещина' : 'Без трещин'}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Класс бетона</p>
                        <p className="text-lg font-semibold text-blue-700">
                          {result.concrete_class || 'Не определено'}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Детали</p>
                        <p className="text-gray-700">{result.message}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={loading || !file}
              className={`w-full py-3 px-4 rounded-lg font-medium text-white shadow-md transition-colors ${
                loading
                  ? 'bg-blue-400 cursor-not-allowed'
                  : !file
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none"
                       viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor"
                            strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                  </svg>
                  Анализ...
                </span>
              ) : 'Анализировать изображение'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;