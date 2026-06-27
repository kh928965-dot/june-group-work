import React, { useState, useEffect } from 'react';
import { Sun, Cloud, CloudRain, Snowflake, Newspaper } from 'lucide-react';

const WEATHER_API_KEY = '0d660bfdade34e35d97f2ef141ee6a7b';

type WeatherType = 'sunny' | 'cloudy' | 'rainy' | 'snowy' | 'unknown';

function getWeatherType(main: string): WeatherType {
  if (main === 'Clear') return 'sunny';
  if (main === 'Clouds') return 'cloudy';
  if (main === 'Rain' || main === 'Drizzle' || main === 'Thunderstorm') return 'rainy';
  if (main === 'Snow') return 'snowy';
  return 'unknown';
}

const weatherConfig = {
  sunny:   { icon: <Sun size={56} className="text-amber-400" /> },
  cloudy:  { icon: <Cloud size={56} className="text-slate-300" /> },
  rainy:   { icon: <CloudRain size={56} className="text-blue-400" /> },
  snowy:   { icon: <Snowflake size={56} className="text-sky-300" /> },
  unknown: { icon: <Cloud size={56} className="text-slate-400" /> },
};

const bgmList = ['u1inSXny700'];
const randomBgm = bgmList[Math.floor(Math.random() * bgmList.length)];
const calculateSpeed = (delay: number) => 3 + delay * 0.5;

type NewsArticle = {
  title: string;
  url: string;
  source: string;
};

function App() {
  const [time, setTime] = useState(new Date());
  const [trivia, setTrivia] = useState('読み込み中...');
  const [weatherData, setWeatherData] = useState<{
    temp: number;
    description: string;
    type: WeatherType;
  } | null>(null);
  const [usdJpy, setUsdJpy] = useState<number | null>(null);
  const [touzaiDelay] = useState(0);
  const [fukutoshinDelay] = useState(15);
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [newsError, setNewsError] = useState('');

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
      .catch(() => setTrivia('取得に失敗しました'));
  }, []);

  // 天気API
  useEffect(() => {
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=Tokyo&appid=${WEATHER_API_KEY}&units=metric&lang=ja`)
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

  // NHKニュースRSS
  useEffect(() => {
    fetch('https://api.rss2json.com/v1/api.json?rss_url=https://www3.nhk.or.jp/rss/news/cat0.xml')
      .then((res) => res.json())
      .then((data) => {
        if (data.status === 'ok') {
          setNews(data.items.slice(0, 6).map((item: any) => ({
            title: item.title,
            url: item.link,
            source: 'NHKニュース',
          })));
        } else {
          setNewsError('ニュースの取得に失敗しました');
        }
      })
      .catch(() => setNewsError('ニュースの取得に失敗しました'));
  }, []);

  const weatherType = weatherData?.type ?? 'unknown';
  const w = weatherConfig[weatherType];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 p-4 md:p-8">
      <style>{`
        @keyframes moveTrain {
          0% { left: -50px; }
          100% { left: 100%; }
        }
      `}</style>

      <div className="max-w-5xl mx-auto flex flex-col gap-4">

        {/* 時刻＋天気（主役） */}
        <section className="bg-slate-800/40 backdrop-blur-sm border border-indigo-500/20 rounded-3xl p-8 flex items-center justify-between">
          <div>
            <p className="text-indigo-300/70 text-sm mb-1">{time.toLocaleDateString('ja-JP', { month: 'long', day: 'numeric', weekday: 'long' })}</p>
            <p className="text-6xl font-bold text-white font-mono tracking-tight">
              {time.toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' })}
            </p>
            <p className="text-indigo-300/50 text-sm mt-1">{time.toLocaleTimeString('ja-JP', { second: '2-digit' })} 秒</p>
          </div>
          <div className="flex flex-col items-center gap-2">
            {w.icon}
            <p className="text-4xl font-bold text-white">{weatherData ? `${weatherData.temp}°` : '--'}</p>
            <p className="text-indigo-300/70 text-sm">{weatherData?.description ?? ''}</p>
          </div>
        </section>

        {/* NHKニュース */}
        <section className="bg-slate-800/40 backdrop-blur-sm border border-indigo-500/20 rounded-3xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <Newspaper size={18} className="text-blue-400" />
            <h2 className="text-white font-bold">NHK 最新ニュース</h2>
          </div>
          {newsError ? (
            <p className="text-red-400 text-sm">{newsError}</p>
          ) : news.length === 0 ? (
            <p className="text-slate-400 text-sm">読み込み中...</p>
          ) : (
            <ul className="space-y-3">
              {news.map((article, i) => (
                <li key={i} className="border-b border-slate-700/50 pb-3 last:border-0">
                  <a
                    href={article.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-slate-200 text-sm hover:text-indigo-300 transition-colors leading-relaxed block"
                  >
                    {article.title}
                  </a>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* 為替＋トリビア */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <section className="bg-slate-800/40 backdrop-blur-sm border border-indigo-500/20 rounded-3xl p-6 flex flex-col justify-center">
            <h2 className="text-indigo-300/70 text-sm mb-2">💱 為替レート</h2>
            <div className="flex items-baseline justify-between">
              <span className="text-slate-400 text-sm">USD → JPY</span>
              <span className="text-3xl font-bold text-white">{usdJpy ? `¥${usdJpy}` : '--'}</span>
            </div>
          </section>

          <section className="bg-slate-800/40 backdrop-blur-sm border border-indigo-500/20 rounded-3xl p-6 flex flex-col justify-center">
            <h2 className="text-indigo-300/70 text-sm mb-2">💡 今日のトリビア</h2>
            <p className="text-slate-200 text-sm leading-relaxed line-clamp-3">{trivia}</p>
          </section>
        </div>

        {/* 電車遅延（アニメーション） */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <section className="bg-slate-800/40 backdrop-blur-sm border border-indigo-500/20 rounded-3xl p-5">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-white font-bold text-sm">🚃 東西線</h2>
              <span className="text-xs font-bold text-emerald-400">
                {touzaiDelay === 0 ? '平常運転' : `${touzaiDelay}分遅延`}
              </span>
            </div>
            <div className="relative w-full h-10 bg-slate-900/50 rounded-lg overflow-hidden flex items-center">
              <img
                src="/touzai-line.png"
                alt="東西線"
                className="absolute h-6 w-auto"
                style={{ animation: `moveTrain ${calculateSpeed(touzaiDelay)}s linear infinite` }}
              />
            </div>
          </section>

          <section className="bg-slate-800/40 backdrop-blur-sm border border-indigo-500/20 rounded-3xl p-5">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-white font-bold text-sm">🚃 副都心線</h2>
              <span className="text-xs font-bold text-red-400">
                {fukutoshinDelay === 0 ? '平常運転' : `${fukutoshinDelay}分遅延`}
              </span>
            </div>
            <div className="relative w-full h-10 bg-slate-900/50 rounded-lg overflow-hidden flex items-center">
              <img
                src="/fukutoshin-line.png"
                alt="副都心線"
                className="absolute h-6 w-auto"
                style={{ animation: `moveTrain ${calculateSpeed(fukutoshinDelay)}s linear infinite` }}
              />
            </div>
          </section>
        </div>

        {/* BGM */}
        <section className="bg-slate-800/40 backdrop-blur-sm border border-indigo-500/20 rounded-3xl p-5">
          <h2 className="text-indigo-300/70 text-sm mb-3">🎵 朝のBGM</h2>
          <div className="rounded-2xl overflow-hidden">
            <iframe
              width="100%"
              height="180"
              src={`https://www.youtube.com/embed/${randomBgm}?autoplay=0`}
              title="朝のBGM"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </section>


      </div>
    </div>
  );
}

export default App;