import React from 'react';
import { Sun, Cloud, CloudRain, Snowflake, Clock, Train } from 'lucide-react';

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

const bgmList = [
  'u1inSXny700',
];

const randomBgm = bgmList[Math.floor(Math.random() * bgmList.length)];

function App() {
  const [time, setTime] = React.useState(new Date());
  const [trivia, setTrivia] = React.useState('トリビアを読み込んでいます...');
  const [weatherData, setWeatherData] = React.useState<{
    temp: number;
    description: string;
    type: WeatherType;
  } | null>(null);
  const [usdJpy, setUsdJpy] = React.useState<number | null>(null);

  React.useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  React.useEffect(() => {
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

  React.useEffect(() => {
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

  React.useEffect(() => {
    fetch('https://api.frankfurter.dev/v1/latest?base=USD&symbols=JPY')
      .then((res) => res.json())
      .then((data) => setUsdJpy(data.rates.JPY))
      .catch(() => console.error('為替の取得に失敗しました'));
  }, []);

  const weatherType = weatherData?.type ?? 'unknown';
  const w = weatherConfig[weatherType];

  return (
    <div className={`min-h-screen transition-colors duration-700 ${w.bg}`}>

      <header className="p-6 flex items-center gap-2 text-slate-600">
        <Clock size={18} />
        <span className="text-lg font-mono">{time.toLocaleTimeString()}</span>
      </header>

      <main className="flex flex-col gap-4 px-4 pb-8">

        <section className={`${w.bg} ${w.border} border rounded-3xl p-8 flex flex-col items-center justify-center gap-4`}>
          {w.icon}
          <div className="text-6xl font-bold text-slate-800">
            {weatherData ? `${weatherData.temp}°C` : '読込中...'}
          </div>
          <div className="text-2xl text-slate-600">
            {weatherData ? weatherData.description : ''}
          </div>
        </section>

        <section className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
          <h2 className="font-bold text-lg text-slate-700 mb-2">💡 今日のトリビア</h2>
          <p className="text-slate-600">{trivia}</p>
        </section>

        <section className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
          <h2 className="font-bold text-lg text-slate-700 mb-4">💱 為替レート</h2>
          <div className="flex items-center justify-between">
            <span className="text-slate-600">USD → JPY</span>
            <span className="text-2xl font-bold text-slate-800">{usdJpy ? `¥${usdJpy}` : '読込中...'}</span>
          </div>
        </section>

        <section className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
          <div className="flex items-center gap-3 mb-4">
            <img src="/fukutoshin-line.png" alt="副都心線" className="h-6 w-auto" />
            <h2 className="font-bold text-lg text-slate-700">副都心線</h2>
          </div>
          <div className="flex items-center gap-2 bg-green-50 rounded-xl p-3">
            <span className="text-green-600 font-bold text-sm">✅ 平常運転</span>
          </div>
        </section>

        <section className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
          <div className="flex items-center gap-3 mb-4">
            <img src="/touzai-line.png" alt="東西線" className="h-6 w-auto" />
            <h2 className="font-bold text-lg text-slate-700">東西線</h2>
          </div>
          <div className="flex items-center gap-2 bg-green-50 rounded-xl p-3">
            <span className="text-green-600 font-bold text-sm">✅ 平常運転</span>
          </div>
        </section>

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
    </div>
  );
}

export default App;