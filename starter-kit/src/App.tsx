import React from 'react';
import { Sun, Cloud, CloudRain, Snowflake, Clock, Train } from 'lucide-react';

type Weather = 'sunny' | 'cloudy' | 'rainy' | 'snowy';

const weather: Weather = 'sunny'; // sunny / cloudy / rainy / snowy

const weatherConfig = {
  sunny:  { bg: 'bg-amber-100', border: 'border-amber-200', icon: <Sun size={64} className="text-amber-500" />,      label: '晴れ',  temp: '28°C' },
  cloudy: { bg: 'bg-slate-200', border: 'border-slate-300', icon: <Cloud size={64} className="text-slate-500" />,    label: '曇り', temp: '22°C' },
  rainy:  { bg: 'bg-blue-100',  border: 'border-blue-200',  icon: <CloudRain size={64} className="text-blue-500" />, label: '雨',  temp: '18°C' },
  snowy:  { bg: 'bg-sky-100',   border: 'border-sky-200',   icon: <Snowflake size={64} className="text-sky-400" />,  label: '雪',  temp: '2°C'  },
};

const trivia = [
  '東京タワーの高さは333メートル。',
  '日本で一番深い湖は田沢湖。',
  'カタツムリは歯が25,000本以上ある。',
  'バナナは木ではなく草に実る。',
  '人間の脳は1日に約70,000回思考すると言われている。',
];

const todayTrivia = trivia[new Date().getDate() % trivia.length];

function App() {
  const [time, setTime] = React.useState(new Date());
  const w = weatherConfig[weather];

  React.useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className={`min-h-screen transition-colors duration-700 ${w.bg}`}>
      
      {/* 時計ヘッダー */}
      <header className="p-6 flex items-center gap-2 text-slate-600">
        <Clock size={18} />
        <span className="text-lg font-mono">{time.toLocaleTimeString()}</span>
      </header>

      <main className="flex flex-col gap-4 px-4 pb-8">

        {/* 天気（大きく） */}
        <section className={`${w.bg} ${w.border} border rounded-3xl p-8 flex flex-col items-center justify-center gap-4`}>
          {w.icon}
          <div className="text-6xl font-bold text-slate-800">{w.temp}</div>
          <div className="text-2xl text-slate-600">{w.label}</div>
        </section>

        {/* 今日のトリビア */}
        <section className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
          <h2 className="font-bold text-lg text-slate-700 mb-2">💡 今日のトリビア</h2>
          <p className="text-slate-600">{todayTrivia}</p>
        </section>

        {/* 副都心線 */}
        <section className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
          <div className="flex items-center gap-3 mb-4">
            <img src="/fukutoshin-line.png" alt="副都心線" className="h-6 w-auto" />
            <h2 className="font-bold text-lg text-slate-700">副都心線</h2>
            <Train size={18} className="text-slate-400" />
          </div>
          <ul className="space-y-2">
            {[1, 2, 3].map((i) => (
              <li key={i} className="text-sm text-slate-600 border-b border-slate-50 pb-2 last:border-0">
                遅延情報を読み込んでいます...
              </li>
            ))}
          </ul>
        </section>

        {/* 東西線 */}
        <section className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
          <div className="flex items-center gap-3 mb-4">
            <img src="/touzai-line.png" alt="東西線" className="h-6 w-auto" />
            <h2 className="font-bold text-lg text-slate-700">東西線</h2>
            <Train size={18} className="text-slate-400" />
          </div>
          <ul className="space-y-2">
            {[1, 2, 3].map((i) => (
              <li key={i} className="text-sm text-slate-600 border-b border-slate-50 pb-2 last:border-0">
                遅延情報を読み込んでいます...
              </li>
            ))}
          </ul>
        </section>

      </main>
    </div>
  );
}

export default App;