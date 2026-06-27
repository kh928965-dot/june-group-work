import React, { useState, useEffect } from 'react';
import { Sun, Newspaper, CheckCircle, Clock } from 'lucide-react';

function App() {
  const [time, setTime] = useState(new Date());

  // ここは仮の遅延情報です。本来はAPIから遅延情報を取得します。コネガワ
  const [touzaiDelay, setTouzaiDelay] = useState(0); // 遅延なし
  const [fukutoshinDelay, setFukutoshinDelay] = useState(15); // 15分遅延

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const calculateSpeed = (delay: number) => {
    return 3 + delay * 0.5;
  };

  return (
    <div className="min-h-screen p-4 md:p-8">
      <style>
        {`
          @keyframes moveTrain {
            0% { left: -50px; }
            100% { left: 100%; }
          }
        `}
      </style>

      <header className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800">Good Morning!</h1>
        <p className="text-slate-500 flex items-center gap-2">
          <Clock size={18} />
          {time.toLocaleTimeString()}
        </p>
      </header>

      <main className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Weather Widget */}
        <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-semibold text-lg flex items-center gap-2">
              <Sun className="text-amber-500" /> Weather
            </h2>
          </div>
          <div className="text-center py-4">
            <div className="text-4xl font-bold mb-1">24°C</div>
            <p className="text-slate-500">Sunny Day</p>
          </div>
        </section>

        {/* News Widget */}
        <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-semibold text-lg flex items-center gap-2">
              <Newspaper className="text-blue-500" /> Top Stories
            </h2>
          </div>
          <ul className="space-y-3">
            {[1, 2, 3].map((i) => (
              <li key={i} className="text-sm text-slate-600 border-b border-slate-50 pb-2 last:border-0">
                Loading some interesting news...
              </li>
            ))}
          </ul>
        </section>

        {/* Tasks Widget */}
        <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-semibold text-lg flex items-center gap-2">
              <CheckCircle className="text-emerald-500" /> Today's Focus
            </h2>
          </div>
          <div className="flex flex-col gap-2">
            <label className="flex items-center gap-2 text-sm text-slate-600">
              <input type="checkbox" className="rounded border-slate-300" />
              <span>Drink 1 glass of water</span>
            </label>
          </div>
        </section>

        {/* 東西線　Widget */}
        <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-semibold text-lg flex items-center gap-2">
              遅延情報 (東西線)
            </h2>
          </div>
          <p className="text-sm text-slate-600 mb-4 font-bold">
            {touzaiDelay === 0 ? "🟢 平常運転" : `🔴 現在 ${touzaiDelay} 分遅延しています`}
          </p>
          <div className="relative w-full h-12 bg-slate-50 rounded overflow-hidden border border-slate-200 flex items-center">
            <img 
              src="/touzai-line.png" 
              alt="東西線" 
              className="absolute h-6 w-auto"
              style={{
                animation: `moveTrain ${calculateSpeed(touzaiDelay)}s linear infinite`
              }}
            />
          </div>
        </section>

        {/* 副都心線 Widget */}
        <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-semibold text-lg flex items-center gap-2">
              遅延情報 (副都心線)
            </h2>
          </div>
          <p className="text-sm text-slate-600 mb-4 font-bold">
            {fukutoshinDelay === 0 ? "🟢 平常運転" : `🔴 現在 ${fukutoshinDelay} 分遅延しています`}
          </p>
          <div className="relative w-full h-12 bg-slate-50 rounded overflow-hidden border border-slate-200 flex items-center">
            <img 
              src="/fukutoshin-line.png" 
              alt="副都心線" 
              className="absolute h-6 w-auto"
              style={{
                animation: `moveTrain ${calculateSpeed(fukutoshinDelay)}s linear infinite`
              }}
            />
          </div>
        </section>
      </main>

      <footer className="mt-12 text-center text-slate-400 text-xs">
        &copy; 2026 Morning Dashboard Workshop - Built with React
      </footer>
    </div>
  );
}

export default App;
