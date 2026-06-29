import React, { useState, useEffect, useMemo } from 'react';
import { Sun, Cloud, CloudRain, Snowflake, Newspaper, Heart, Fish, Coffee, PawPrint, Music } from 'lucide-react';

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
  sunny:   { icon: <Sun size={64} className="text-orange-400 drop-shadow-sm" />, text: 'ぽかぽかおひるね日和' },
  cloudy:  { icon: <Cloud size={64} className="text-stone-400 drop-shadow-sm" />, text: 'まったり、くもり空' },
  rainy:   { icon: <CloudRain size={64} className="text-blue-400 drop-shadow-sm" />, text: 'おうちで雨やどり' },
  snowy:   { icon: <Snowflake size={64} className="text-sky-300 drop-shadow-sm" />, text: 'こたつで丸くなる雪' },
  unknown: { icon: <Cloud size={64} className="text-stone-300 drop-shadow-sm" />, text: 'おそらのきげんを確認中...' },
};

const calculateSpeed = (delay: number) => 4 + delay * 0.8;

type NewsArticle = {
  title: string;
  url: string;
  source: string;
};

function App() {
  const [time, setTime] = useState(new Date());
  const [trivia, setTrivia] = useState('ねこ知識を取得しています...');
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

  const paws = useMemo(() => {
    return [...Array(55)].map(() => ({
      size: Math.random() * 25 + 18,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      delay: `${Math.random() * 10}s`,
      duration: `${8 + Math.random() * 6}s`,
    }));
  }, []);

  // 時計
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // 時間帯によるBGMの判定
  const currentHour = time.getHours();
  let bgmId = '';
  let timeLabel = '';
  if (currentHour >= 5 && currentHour < 11) {
    bgmId = 'kCab9A0YAGM';
    timeLabel = '朝';
  } else if (currentHour >= 11 && currentHour < 18) {
    bgmId = '7g6mfUN02YM';
    timeLabel = '昼';
  } else {
    bgmId = 'F9TfUtN1vE8';
    timeLabel = '夜';
  }

  // 猫トリビアAPI
  useEffect(() => {
    fetch('https://catfact.ninja/fact')
      .then((res) => res.json())
      .then((data) => {
        const text = data.fact;
        return fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=en|ja`);
      })
      .then((res) => res.json())
      .then((data) => setTrivia(data.responseData.translatedText))
      .catch(() => setTrivia('豆知識の取得に失敗しました'));
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
          setNews(data.items.slice(0, 5).map((item: any) => ({
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
    <div className="min-h-screen bg-[#FFF9F2] p-4 md:p-8 relative overflow-hidden text-amber-950">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Mochiy+Pop+One&family=Zen+Maru+Gothic:wght@400;500;700&display=swap');
        
        * {
          font-family: 'Zen Maru Gothic', sans-serif;
        }

        .title-font {
          font-family: 'Mochiy Pop One', sans-serif;
        }
      
        @keyframes float {
          0% {
            transform: translate(0, 0) rotate(0deg);
          }
          50% {
            transform: translate(20px, -30px) rotate(15deg);
          }
          100% {
            transform: translate(0, 0) rotate(0deg);
          }
        }
        
        .bg-paw {
          position: absolute;
          color: #B67A55;
          opacity: 0.25;
          z-index: 0;
        }

        @keyframes moveLeftWithStop {
          0% { left: 110%; }
          40% { left: 50%; }
          60% { left: 50%; } 
          100% { left: -10%; } 
        }
      `}</style>

      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        {paws.map((paw, i) => (
          <PawPrint 
            key={i} 
            size={paw.size} 
            className="bg-paw"
            style={{ 
              left: paw.left, 
              top: paw.top,
              animation: `float ${paw.duration} ease-in-out infinite`,
              animationDelay: paw.delay
            }} 
          />
        ))}
      </div>

      <div className="max-w-5xl mx-auto flex flex-col gap-5 relative z-10">
        
        <header className="flex justify-center mt-2 mb-2">
          <h1 className="title-font text-2xl md:text-3xl text-amber-800 drop-shadow-sm flex items-center gap-3">
            <PawPrint className="text-orange-400 -rotate-12" size={28} />
            Cat Dashboard🐈
            <PawPrint className="text-orange-400 rotate-12" size={28} />
          </h1>
        </header>

        {/* 時刻＋天気 */}
        <section className="bg-white/70 backdrop-blur-md border-4 border-amber-50/80 rounded-[2rem] p-8 flex flex-col md:flex-row items-center justify-between shadow-[0_8px_30px_rgb(180,140,110,0.1)]">
          <div className="text-center md:text-left mb-6 md:mb-0">
            <p className="text-amber-700/60 font-medium mb-1 flex items-center justify-center md:justify-start gap-2">
              <PawPrint size={16} />
              {time.toLocaleDateString('ja-JP', { month: 'long', day: 'numeric', weekday: 'long' })}
            </p>
            <p className="text-6xl md:text-7xl font-bold text-amber-900 tracking-tight flex items-baseline justify-center md:justify-start title-font">
              {time.getHours().toString().padStart(2, '0')}
              <span className="animate-pulse text-amber-400 mx-1">:</span>
              {time.getMinutes().toString().padStart(2, '0')}
            </p>
            <p className="text-amber-700/50 text-sm mt-2 font-medium">
              {time.toLocaleTimeString('ja-JP', { second: '2-digit' })} 秒経過ニャ
            </p>
          </div>
          <div className="flex flex-col items-center bg-amber-50/50 p-6 rounded-[2rem] min-w-[140px]">
            {w.icon}
            <div className="flex items-center gap-2 mt-3 title-font">
              <p className="text-4xl font-bold text-amber-900">{weatherData ? `${weatherData.temp}°` : '--°'}</p>
            </div>
            <p className="text-amber-800/70 text-sm font-bold mt-2">{w.text}</p>
          </div>
        </section>

        {/* ニュース */}
        <section className="bg-white/70 backdrop-blur-md border-4 border-amber-50/80 rounded-[2rem] p-6 shadow-[0_8px_30px_rgb(180,140,110,0.1)]">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-orange-100 p-2 rounded-full text-orange-500">
              <Newspaper size={20} />
            </div>
            <h2 className="text-amber-900 font-bold text-lg">Cat Online (NHKニュース)</h2>
          </div>
          {newsError ? (
            <p className="text-red-400 text-sm text-center">{newsError}</p>
          ) : news.length === 0 ? (
            <p className="text-amber-700/50 text-sm text-center py-4">ニュースを取得しています...</p>
          ) : (
            <ul className="space-y-3">
              {news.map((article, i) => (
                <li key={i} className="border-b border-amber-100/50 pb-3 last:border-0 last:pb-0 flex items-start gap-2 group">
                  <span className="text-orange-300 mt-1 shrink-0">🐾</span>
                  <a
                    href={article.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-amber-800 text-sm hover:text-orange-500 transition-colors leading-relaxed block group-hover:-translate-x-1 duration-200 font-medium"
                  >
                    {article.title}
                  </a>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* 為替＋トリビア */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <section className="bg-white/70 backdrop-blur-md border-4 border-amber-50/80 rounded-[2rem] p-6 flex flex-col justify-center shadow-[0_8px_30px_rgb(180,140,110,0.1)] transition-transform hover:-translate-y-1">
            <h2 className="text-amber-700/80 font-bold text-sm mb-3 flex items-center gap-2">
              <Fish size={18} className="text-sky-500" /> 為替レート
            </h2>
            <div className="flex items-baseline justify-between bg-sky-50/50 p-4 rounded-2xl">
              <span className="text-amber-800/70 text-sm font-bold">1ドル ＝</span>
              <span className="text-3xl font-bold text-sky-700 title-font">{usdJpy ? `${usdJpy}円` : '--'}</span>
            </div>
          </section>

          <section className="bg-white/70 backdrop-blur-md border-4 border-amber-50/80 rounded-[2rem] p-6 flex flex-col justify-center shadow-[0_8px_30px_rgb(180,140,110,0.1)] transition-transform hover:-translate-y-1">
            <h2 className="text-amber-700/80 font-bold text-sm mb-3 flex items-center gap-2">
              <Heart size={18} className="text-rose-400" /> 今日のねこ知識
            </h2>
            <div className="bg-rose-50/50 p-4 rounded-2xl h-full flex items-center">
              <p className="text-amber-900 text-sm leading-relaxed font-medium">
                「{trivia}」
              </p>
            </div>
          </section>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* 東西線  */}
          <section className="bg-white/70 backdrop-blur-md border-4 border-amber-50/80 rounded-[2rem] p-5 shadow-[0_8px_30px_rgb(180,140,110,0.1)] overflow-hidden relative">
            <div className="flex items-center justify-between mb-4 relative z-10">
              <h2 className="text-amber-900 font-bold text-sm flex items-center gap-2">
                <span className="bg-emerald-100 text-emerald-600 p-1.5 rounded-lg text-xs">東西線</span> 
              </h2>
              <span className="text-xs font-bold bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full border border-emerald-200">
                {touzaiDelay === 0 ? '🐾 遅延状況 : スムーズにお散歩中 (正常運転)' : `🦋 遅延状況 : 寄り道中 (+${touzaiDelay}分遅延)`}
              </span>
            </div>
            
            <div className="relative w-full h-16 bg-[#FDFBF9] border-2 border-dashed border-amber-200 rounded-xl overflow-hidden flex items-end pb-2">
              <div className="absolute flex flex-col items-center justify-center z-0 left-1/2 -translate-x-1/2 bottom-2">
                <div className="w-2 h-2 bg-amber-300 rounded-full mb-1"></div>
                <span className="text-[10px] text-amber-700/50 font-bold">早稲田駅</span>
              </div>
              
              <img
                src="/touzai-cat.png"
                alt="cat" 
                className="absolute z-10 w-12" 
                style={{
                  animation: `moveLeftWithStop ${calculateSpeed(touzaiDelay)}s linear infinite`,
                  transform: "translateX(-50%)",
                }}
              />
            </div>
          </section>

          {/* 副都心線 */}
          <section className="bg-white/70 backdrop-blur-md border-4 border-amber-50/80 rounded-[2rem] p-5 shadow-[0_8px_30px_rgb(180,140,110,0.1)] overflow-hidden relative">
            <div className="flex items-center justify-between mb-4 relative z-10">
              <h2 className="text-amber-900 font-bold text-sm flex items-center gap-2">
                <span className="bg-amber-100 text-amber-700 p-1.5 rounded-lg text-xs">副都心線</span> 
              </h2>
              <span className="text-xs font-bold bg-orange-50 text-orange-600 px-3 py-1 rounded-full border border-orange-200">
                {fukutoshinDelay === 0 ? '🐾 遅延状況 : スムーズにお散歩中(正常運転)' : `🦋 遅延状況 : 寄り道中 (+${fukutoshinDelay}分遅延)`}
              </span>
            </div>
            
            <div className="relative w-full h-16 bg-[#FDFBF9] border-2 border-dashed border-amber-200 rounded-xl overflow-hidden flex items-end pb-2">
              <div className="absolute flex flex-col items-center justify-center z-0 left-1/2 -translate-x-1/2 bottom-2">
                <div className="w-2 h-2 bg-amber-300 rounded-full mb-1"></div>
                <span className="text-[10px] text-amber-700/50 font-bold">西早稲田駅</span>
              </div>
      
              <img
                src="/fukutoshin-cat.png"
                alt="cat" 
                className="absolute z-10 w-12" 
                style={{
                  animation: `moveLeftWithStop ${calculateSpeed(fukutoshinDelay)}s linear infinite`,
                  transform: "translateX(-50%)",
                }}
              />
            </div>
          </section>
        </div>

        {/* BGM */}
        <section className="bg-white/70 backdrop-blur-md border-4 border-amber-50/80 rounded-[2rem] p-6 shadow-[0_8px_30px_rgb(180,140,110,0.1)]">
          <div className="flex items-center gap-2 mb-4">
            <div className="bg-stone-100 p-2 rounded-full text-stone-600">
              <Coffee size={20} />
            </div>
            <h2 className="text-amber-900 font-bold">
              ねこカフェ気分のBGM <span className="text-amber-700/60 text-sm ml-2">({timeLabel}用プレイリスト)</span>
            </h2>
            <Music size={16} className="text-amber-700/50 ml-auto animate-bounce" />
          </div>
          <div className="rounded-2xl overflow-hidden shadow-inner border-2 border-stone-100">
            <iframe
              width="100%"
              height="140"
              src={`https://www.youtube.com/embed/${bgmId}?autoplay=0&rel=0`}
              title={`${timeLabel}のBGM`}
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