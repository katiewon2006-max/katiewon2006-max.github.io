// 기존에 정상 작동하는 화면 진입 효과. 기능 추가 시 유지한다.
document.documentElement.classList.add('has-js');
const revealSections = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  revealSections.forEach((section) => observer.observe(section));
} else {
  revealSections.forEach((section) => section.classList.add('is-visible'));
}

const yearData = {
  A: {
    rate: '4.2',
    description: '연도 A의 학습용 가상 실업률은 4.2%입니다.',
    image: 'images/year-a.svg',
    imageAlt: '가상 데이터 연도 A 실업률 추이 그래프',
    chartStatus: '연도 A의 가상 데이터 그래프입니다.'
  },
  B: {
    rate: '3.6',
    description: '연도 B의 학습용 가상 실업률은 3.6%로, 연도 A보다 0.6%p 낮습니다.',
    image: 'images/year-b.svg',
    imageAlt: '가상 데이터 연도 B 실업률 추이 그래프',
    chartStatus: '연도 B의 가상 데이터 그래프입니다.'
  }
};

const compareSection = document.querySelector('.compare-section');
const yearButtons = [
  compareSection.querySelector('.year-button-a'),
  compareSection.querySelector('.year-button-b')
];
let rateAnimationFrame = null;

function selectYear(year) {
  const data = yearData[year];
  const isYearA = year === 'A';

  if (rateAnimationFrame !== null) {
    cancelAnimationFrame(rateAnimationFrame);
    rateAnimationFrame = null;
  }

  compareSection.querySelector('.year-rate-value').textContent = data.rate;
  compareSection.querySelector('.year-label').textContent = `YEAR ${year}`;
  compareSection.querySelector('.metric-title').textContent = `연도 ${year}의 실업률 변화`;
  compareSection.querySelector('.year-description').textContent = data.description;

  const chart = compareSection.querySelector('.year-chart');
  chart.src = data.image;
  chart.alt = data.imageAlt;
  compareSection.querySelector('.chart-year').textContent = `연도 ${year}`;
  compareSection.querySelector('.chart-status').textContent = data.chartStatus;

  yearButtons.forEach((button, index) => {
    const isSelected = index === (isYearA ? 0 : 1);
    button.classList.toggle('active', isSelected);
    button.setAttribute('aria-pressed', String(isSelected));
  });
}

function animateRate(target, duration = 1200) {
  const rates = [
    document.querySelector('.hero-rate-value'),
    compareSection.querySelector('.year-rate-value')
  ];

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    rates.forEach((rate) => {
      rate.textContent = target;
    });
    return;
  }

  rates.forEach((rate) => {
    rate.textContent = '0.0';
  });
  let startTime = null;

  function updateRate(timestamp) {
    if (startTime === null) startTime = timestamp;

    const progress = Math.min((timestamp - startTime) / duration, 1);
    const value = (Number(target) * progress).toFixed(1);
    rates.forEach((rate) => {
      rate.textContent = value;
    });

    if (progress < 1) {
      rateAnimationFrame = requestAnimationFrame(updateRate);
    } else {
      rateAnimationFrame = null;
    }
  }

  rateAnimationFrame = requestAnimationFrame(updateRate);
}

yearButtons.forEach((button, index) => {
  button.addEventListener('click', () => selectYear(index === 0 ? 'A' : 'B'));
});

selectYear('A');
animateRate(yearData.A.rate);
