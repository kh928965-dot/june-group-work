import React, { useState, useEffect } from 'react';
import { Sun, Cloud, CloudRain, Snowflake, Clock, Newspaper, CheckCircle } from 'lucide-react';

const API_KEY = '0d660bfdade34e35d97f2ef141ee6a7b';

type WeatherType = 'sunny' | 'cloudy' | 'rainy' | 'snowy' | 'unknown';

function getWeatherType(main: string): WeatherType {
  if (main === 'Clear') return 'sunny';
  if (main === 'Clouds') return 'cloudy';
  if (main === 'Rain' || main === 'Drizzle' || main === 'Thunderstorm') return 'rainy';
  if (main === 'Snow') return 'snowy';
  return 'unknown';
}

const weatherConfig = {
  sunny:   { bg: 'bg-amber-100', border: 'border-amber-200', icon: <Sun size={64} className="text-amber-500" /> },
  cloudy:  { bg: 'bg-slate-200', border: 'border-slate-300', icon: <Cloud size={64} className="text-slate-500" /> },
  rainy:   { bg: 'bg-blue-100',  border: 'border-blue-200',  icon: <CloudRain size={64} className="text-blue-500" /> },
  snowy:   { bg: 'bg-sky-100',   border: 'border-sky-200',   icon: <Snowflake size={64} className="text-sky-400" /> },
  unknown: { bg: 'bg-white',     border: 'border-slate-100', icon: <Cloud size={64} className="text-slate-400" /> },
};

const bgmList = ['u1inSXny700'];
const randomBgm = bgmList[Math.floor(Math.random() * bgmList.length)];

const calculateSpeed = (delay: number) => 3 + delay * 0.5;

function App() {
  const [time, setTime] = useState(new Date());
  const [trivia, setTrivia] = useState('トリビアを読み込んでいます...');
  const [weatherData, setWeatherData] = useState<{
    temp: number;
    description: string;
    type: WeatherType;
  } | null>(null);
  const [usdJpy, setUsdJpy] = useState<number | null>(null);
  const [touzaiDelay] = useState(0);
  const [fukutoshinDelay] = useState(15);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // トリビアAPI
  useEffect(() => {
    fetch('https://catfact.ninja/fact')
      .then((res) => res.json())
      .then((data) => {
        const text = data.fact;
        return fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=en|ja`);
      })
      .then((res) => res.json())
      .then((data) => setTrivia(data.responseData.translatedText))
      .catch(() => setTrivia('トリビアの取得に失敗しました'));
  }, []);

  // 天気API
  useEffect(() => {
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=Tokyo&appid=${API_KEY}&units=metric&lang=ja`)
      .then((res) => res.json())
      .then((data) => {
        setWeatherData({
          temp: Math.round(data.main.temp),
          description: data.weather[0].description,
          type: getWeatherType(data.weather[0].main),
        });
      })
      .catch(() => console.error('天気の取得に失敗しました'));
  }, []);

  // 為替API
  useEffect(() => {
    fetch('https://api.frankfurter.dev/v1/latest?base=USD&symbols=JPY')
      .then((res) => res.json())
      .then((data) => setUsdJpy(data.rates.JPY))
      .catch(() => console.error('為替の取得に失敗しました'));
  }, []);

  const weatherType = weatherData?.type ?? 'unknown';
  const w = weatherConfig[weatherType];

  return (
    <div className={`min-h-screen transition-colors duration-700 ${w.bg}`}>
      <style>
        {`
          @keyframes moveTrain {
            0% { left: -50px; }
            100% { left: 100%; }
          }
        `}
      </style>

      {/* 時計ヘッダー */}
      <header className="p-6 flex items-center gap-2 text-slate-600">
        <Clock size={18} />
        <span className="text-lg font-mono">{time.toLocaleTimeString()}</span>
      </header>

      <main className="flex flex-col gap-4 px-4 pb-8">

        {/* 天気（大きく） */}
        <section className={`${w.bg} ${w.border} border rounded-3xl p-8 flex flex-col items-center justify-center gap-4`}>
          {w.icon}
          <div className="text-6xl font-bold text-slate-800">
            {weatherData ? `${weatherData.temp}°C` : '読込中...'}
          </div>
          <div className="text-2xl text-slate-600">
            {weatherData ? weatherData.description : ''}
          </div>
        </section>

        {/* 今日のトリビア */}
        <section className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
          <h2 className="font-bold text-lg text-slate-700 mb-2">💡 今日のトリビア</h2>
          <p className="text-slate-600">{trivia}</p>
        </section>

        {/* 為替レート */}
        <section className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
          <h2 className="font-bold text-lg text-slate-700 mb-4">💱 為替レート</h2>
          <div className="flex items-center justify-between">
            <span className="text-slate-600">USD → JPY</span>
            <span className="text-2xl font-bold text-slate-800">{usdJpy ? `¥${usdJpy}` : '読込中...'}</span>
          </div>
        </section>

        {/* 東西線 */}
        <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-semibold text-lg">遅延情報 (東西線)</h2>
          </div>
          <p className="text-sm text-slate-600 mb-4 font-bold">
            {touzaiDelay === 0 ? '🟢 平常運転' : `🔴 現在 ${touzaiDelay} 分遅延しています`}
          </p>
          <div className="relative w-full h-12 bg-slate-50 rounded overflow-hidden border border-slate-200 flex items-center">
            <img
              src="/touzai-line.png"
              alt="東西線"
              className="absolute h-6 w-auto"
              style={{ animation: `moveTrain ${calculateSpeed(touzaiDelay)}s linear infinite` }}
            />
          </div>
        </section>

        {/* 副都心線 */}
        <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-semibold text-lg">遅延情報 (副都心線)</h2>
          </div>
          <p className="text-sm text-slate-600 mb-4 font-bold">
            {fukutoshinDelay === 0 ? '🟢 平常運転' : `🔴 現在 ${fukutoshinDelay} 分遅延しています`}
          </p>
          <div className="relative w-full h-12 bg-slate-50 rounded overflow-hidden border border-slate-200 flex items-center">
            <img
              src="/fukutoshin-line.png"
              alt="副都心線"
              className="absolute h-6 w-auto"
              style={{ animation: `moveTrain ${calculateSpeed(fukutoshinDelay)}s linear infinite` }}
            />
          </div>
        </section>

        {/* YouTube BGM */}
        <section className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
          <h2 className="font-bold text-lg text-slate-700 mb-4">🎵 朝のBGM</h2>
          <div className="rounded-2xl overflow-hidden">
            <iframe
              width="100%"
              height="200"
              src={`https://www.youtube.com/embed/${randomBgm}?autoplay=0`}
              title="朝のBGM"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
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