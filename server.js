const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(__dirname, { index: false }));

function parseTrips() {
  const files = fs.readdirSync(__dirname);
  const trips = [];
  for (const file of files) {
    const m = file.match(/^(\d{4})(\d{2})(\d{2})(.+)\.html$/);
    if (!m) continue;
    const [, year, month, day, location] = m;
    trips.push({
      filename: file,
      date: `${year}-${month}-${day}`,
      dateLabel: `${year} / ${parseInt(month)} / ${parseInt(day)}`,
      location,
    });
  }
  return trips.sort((a, b) => b.date.localeCompare(a.date));
}

app.get('/', (req, res) => {
  const trips = parseTrips();

  const cards = trips.map(t => `
    <a class="card" href="/${encodeURIComponent(t.filename)}">
      <div class="card-date">${t.dateLabel}</div>
      <div class="card-location">${t.location}</div>
      <div class="card-arrow">→</div>
    </a>`).join('');

  const empty = `<p class="empty">還沒有任何行程，趕快新增一個吧！</p>`;

  res.send(`<!DOCTYPE html>
<html lang="zh-TW">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>旅遊行程</title>
<link href="https://fonts.googleapis.com/css2?family=Noto+Serif+TC:wght@400;600;900&family=Noto+Sans+TC:wght@300;400;500&display=swap" rel="stylesheet">
<style>
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  :root {
    --ink: #1a1a1a; --muted: #6b6b6b; --paper: #faf8f4;
    --accent: #c8845a; --accent-light: #f2e0d3; --line: #ddd8cf;
  }
  body { background: var(--paper); color: var(--ink); font-family: 'Noto Sans TC', sans-serif; font-weight: 300; min-height: 100vh; }
  header { background: var(--ink); color: white; padding: 48px 32px 40px; text-align: center; }
  header .eyebrow { font-size: 11px; letter-spacing: 4px; text-transform: uppercase; color: var(--accent); margin-bottom: 12px; }
  header h1 { font-family: 'Noto Serif TC', serif; font-size: clamp(22px, 5vw, 36px); font-weight: 900; letter-spacing: 3px; }
  header .sub { margin-top: 10px; color: #aaa; font-size: 13px; letter-spacing: 1px; }
  main { max-width: 640px; margin: 0 auto; padding: 40px 24px 80px; }
  .section-label { font-size: 11px; letter-spacing: 3px; color: var(--muted); text-transform: uppercase; margin-bottom: 20px; }
  .grid { display: flex; flex-direction: column; gap: 12px; }
  .card {
    display: flex; align-items: center; gap: 16px;
    background: white; border: 1px solid var(--line); border-radius: 12px;
    padding: 20px 22px; text-decoration: none; color: inherit;
    transition: box-shadow .15s, border-color .15s;
  }
  .card:hover { border-color: var(--accent); box-shadow: 0 2px 12px rgba(200,132,90,.12); }
  .card-date { font-size: 12px; color: var(--muted); letter-spacing: 1px; min-width: 110px; }
  .card-location { font-family: 'Noto Serif TC', serif; font-size: 18px; font-weight: 600; letter-spacing: 1px; flex: 1; }
  .card-arrow { font-size: 16px; color: var(--accent); }
  .empty { color: var(--muted); font-size: 14px; text-align: center; padding: 40px 0; }
  footer { text-align: center; font-size: 12px; color: var(--muted); padding: 32px; border-top: 1px solid var(--line); letter-spacing: 1px; }
</style>
</head>
<body>
<header>
  <div class="eyebrow">Travel Plans</div>
  <h1>旅遊行程</h1>
  <div class="sub">共 ${trips.length} 筆行程</div>
</header>
<main>
  <div class="section-label">所有行程</div>
  <div class="grid">
    ${trips.length ? cards : empty}
  </div>
</main>
<footer>Trip Planning</footer>
</body>
</html>`);
});

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
