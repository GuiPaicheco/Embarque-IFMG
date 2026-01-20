const portfolioData = [
    {
        id: 1,
        title: '1012 - Terminal',
        image: 'images/red-pin.png',
        horarios: [
            "05:30","06:00","06:30","07:00",
            "07:30","08:00","08:30","09:00",
            "10:00","11:00","12:00",
            "13:00","14:00","15:00",
            "16:00","17:00","18:00",
            "19:00","20:00","21:00"
        ]
    },
    {
        id: 2,
        title: '1012 - Morada',
        image: 'images/green-pin.png',
        horarios: [
            "05:40","06:10","06:40","07:10",
            "07:40","08:10","08:40","09:10",
            "10:10","11:10","12:10",
            "13:10","14:10","15:10",
            "16:10","17:10","18:10",
            "19:10","20:10","21:10"
        ]
    },
    {
        id: 3,
        title: '1750',
        image: 'images/orange-pin.png',
        horarios: [
            "06:00","06:40","07:20","08:00",
            "09:00","10:00","11:00",
            "12:00","13:00","14:00",
            "15:00","16:00","17:00",
            "18:00","19:00","20:00"
        ]
    },
    {
        id: 4,
        title: '1751',
        image: 'images/purple-pin.png',
        horarios: [
            "06:15","06:55","07:35","08:15",
            "09:15","10:15","11:15",
            "12:15","13:15","14:15",
            "15:15","16:15","17:15",
            "18:15","19:15","20:15"
        ]
    }
];

function timeToSeconds(time) {
    const [h, m] = time.split(':').map(Number);
    return h * 3600 + m * 60;
}

function getBusStatus(horarios) {
    const now = new Date();
    const currentSeconds =
        now.getHours() * 3600 +
        now.getMinutes() * 60 +
        now.getSeconds();

    const list = horarios.map(timeToSeconds);

    let anterior = '--';
    let atual = 'Encerrado';
    let proximo = '--';
    let chegadaSegundos = null;

    for (let i = 0; i < list.length; i++) {
        if (list[i] >= currentSeconds) {
            atual = horarios[i];
            anterior = horarios[i - 1] ?? '--';
            proximo = horarios[i + 1] ?? '--';
            chegadaSegundos = list[i] - currentSeconds;
            break;
        }
    }

    return { anterior, atual, proximo, chegadaSegundos };
}

function formatCountdown(seconds) {
    if (seconds === null || seconds < 0) return '--';
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${min}min e ${sec.toString().padStart(2, '0')}s`;
}

let currentIndex = 0;
const carousel = document.getElementById('carousel');
const indicators = document.getElementById('indicators');

function createCard(data) {
    const status = getBusStatus(data.horarios);

    const item = document.createElement('div');
    item.className = 'carousel-item';

    item.innerHTML = `
        <div class="card">
            <div class="card-number">0${data.id}</div>
            <div class="card-image">
                <img src="${data.image}">
            </div>
            <h3 class="card-title">${data.title}</h3>
            <p class="card-description"><b>Anterior:</b> ${status.anterior}</p>
            <p class="card-description"><b>Atual:</b> ${status.atual}</p>
            <p class="card-description"><b>Próximo:</b> ${status.proximo}</p>
            <p class="card-description">
                <b>Chegando em:</b>
                <span class="countdown" data-time="${status.chegadaSegundos}">
                    ${formatCountdown(status.chegadaSegundos)}
                </span>
            </p>
        </div>
    `;
    return item;
}

function initCarousel() {
    carousel.innerHTML = '';
    indicators.innerHTML = '';

    portfolioData.forEach((data, i) => {
        carousel.appendChild(createCard(data));

        const ind = document.createElement('div');
        ind.className = 'indicator' + (i === 0 ? ' active' : '');
        ind.onclick = () => goTo(i);
        indicators.appendChild(ind);
    });

    updateCarousel();
}

function updateCarousel() {
    const items = document.querySelectorAll('.carousel-item');
    const total = items.length;
    const mobile = window.innerWidth <= 768;

    items.forEach((item, i) => {
        let offset = i - currentIndex;
        if (offset > total / 2) offset -= total;
        if (offset < -total / 2) offset += total;

        const abs = Math.abs(offset);
        const sign = offset < 0 ? -1 : 1;

        if (abs === 0) {
            item.style.transform = 'translate(-50%,-50%) scale(1)';
            item.style.zIndex = 10;
            item.style.opacity = 1;
        } else if (abs === 1) {
            item.style.transform =
                `translate(-50%,-50%) translateX(${sign * (mobile ? 260 : 400)}px)
                 translateZ(-200px) rotateY(${-sign * 30}deg) scale(.85)`;
            item.style.opacity = .8;
            item.style.zIndex = 5;
        } else {
            item.style.transform =
                `translate(-50%,-50%) translateX(${sign * (mobile ? 420 : 600)}px)
                 translateZ(-350px) rotateY(${-sign * 40}deg) scale(.7)`;
            item.style.opacity = .4;
            item.style.zIndex = 2;
        }
    });

    [...indicators.children].forEach((el, i) =>
        el.classList.toggle('active', i === currentIndex)
    );
}

function next() {
    currentIndex = (currentIndex + 1) % portfolioData.length;
    updateCarousel();
}

function prev() {
    currentIndex = (currentIndex - 1 + portfolioData.length) % portfolioData.length;
    updateCarousel();
}

function goTo(i) {
    currentIndex = i;
    updateCarousel();
}

function updateClock() {
    const now = new Date();
    const time = now.toLocaleTimeString('pt-BR');
    const date = now.toLocaleDateString('pt-BR');
    document.getElementById('clock').innerText = `${date} • ${time}`;
}

function updateCountdowns() {
    document.querySelectorAll('.countdown').forEach(el => {
        let sec = parseInt(el.dataset.time);
        if (!isNaN(sec) && sec > 0) {
            sec--;
            el.dataset.time = sec;
            el.innerText = formatCountdown(sec);
        }
    });
}

document.getElementById('nextBtn').onclick = next;
document.getElementById('prevBtn').onclick = prev;

setInterval(updateClock, 1000);
setInterval(updateCountdowns, 1000);
setInterval(next, 5000);
setInterval(initCarousel, 30000);

window.addEventListener('resize', updateCarousel);
window.addEventListener('load', () => {
    updateClock();
    initCarousel();
});
