/* =======================
   DADOS
======================= */

const portfolioData = [
  {
    id: 1,
    title: "1012 - Morada",
    image: "images/green-pin.png",
    horarios: [
      "05:15","06:15","07:05","08:45",
      "10:30","12:15","14:05","16:05",
      "17:55","18:55","20:15","22:35"
    ]
  },
  {
    id: 2,
    title: "1012 - Terminal",
    image: "images/red-pin.png",
    horarios: [
      "05:45","06:45","07:35","09:15",
      "11:00","12:45","14:35","16:35",
      "18:25","19:25","20:45","23:05"
    ]
  },
  {
    id: 3,
    title: "1750",
    image: "images/orange-pin.png",
    horarios: [
      "05:30","06:00","06:20","06:35",
      "06:45","06:55","07:05","07:20",
      "07:30","07:40","07:55","08:20",
      "08:40","09:00","09:40","10:20",
      "11:00","11:40","12:20","13:00",
      "14:00","14:40","15:20","16:00",
      "16:20","16:40","17:00","17:15",
      "17:30","17:45","18:00","18:15",
      "18:30","18:45","19:00","19:20",
      "19:40","20:00","20:30","21:00",
      "21:30","22:20","23:00"
    ]
  },
  {
    id: 4,
    title: "1751",
    image: "images/purple-pin.png",
    horarios: [
      "06:15","07:00","07:45","08:25",
      "09:00","10:20","11:50","13:10",
      "14:50","17:20","18:50","20:40",
      "22:10"
    ]
  }
];

/* =======================
   FUNÇÕES DE TEMPO
======================= */

function timeToSeconds(time) {
  const [h, m] = time.split(":").map(Number);
  return h * 3600 + m * 60;
}

function formatCountdown(seconds) {
  if (seconds === null || seconds < 0) return "--";
  const min = Math.floor(seconds / 60);
  const sec = seconds % 60;
  return `${min}min e ${sec.toString().padStart(2, "0")}s`;
}

/* =======================
   STATUS DO ÔNIBUS
======================= */

function getBusStatus(horarios) {
  const now = new Date();
  const currentSeconds =
    now.getHours() * 3600 +
    now.getMinutes() * 60 +
    now.getSeconds();

  const list = horarios.map(timeToSeconds);

  let anterior = "--";
  let atual = "Encerrado";
  let proximo = "--";
  let chegadaSegundos = null;

  for (let i = 0; i < list.length; i++) {
    if (list[i] >= currentSeconds) {
      atual = horarios[i];
      anterior = horarios[i - 1] ?? "--";
      proximo = horarios[i + 1] ?? "--";
      chegadaSegundos = list[i] - currentSeconds;
      break;
    }
  }

  // Se o dia acabou
  if (atual === "Encerrado" && horarios.length > 0) {
    anterior = horarios[horarios.length - 1];
  }

  return { anterior, atual, proximo, chegadaSegundos };
}

/* =======================
   CARROSSEL
======================= */

let currentIndex = 0;
const carousel = document.getElementById("carousel");
const indicators = document.getElementById("indicators");

function createCard(data) {
  const status = getBusStatus(data.horarios);

  const item = document.createElement("div");
  item.className = "carousel-item";
  item.dataset.id = data.id;

  item.innerHTML = `
    <div class="card">
      <div class="card-number">0${data.id}</div>
      <div class="card-image">
        <img src="${data.image}">
      </div>
      <h3 class="card-title">${data.title}</h3>

      <p class="card-description anterior"><b>Anterior:</b> ${status.anterior}</p>
      <p class="card-description atual"><b>Atual:</b> ${status.atual}</p>
      <p class="card-description proximo"><b>Próximo:</b> ${status.proximo}</p>

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
  carousel.innerHTML = "";
  indicators.innerHTML = "";

  portfolioData.forEach((data, i) => {
    carousel.appendChild(createCard(data));

    const ind = document.createElement("div");
    ind.className = "indicator" + (i === currentIndex ? " active" : "");
    ind.onclick = () => goTo(i);
    indicators.appendChild(ind);
  });

  updateCarousel();
}

function updateCarousel() {
  const items = document.querySelectorAll(".carousel-item");
  const total = items.length;
  const mobile = window.innerWidth <= 768;

  items.forEach((item, i) => {
    let offset = i - currentIndex;
    if (offset > total / 2) offset -= total;
    if (offset < -total / 2) offset += total;

    const abs = Math.abs(offset);
    const sign = offset < 0 ? -1 : 1;

    if (abs === 0) {
      item.style.transform = "translate(-50%,-50%) scale(1)";
      item.style.zIndex = 10;
      item.style.opacity = 1;
    } else if (abs === 1) {
      item.style.transform =
        `translate(-50%,-50%) translateX(${sign * (mobile ? 260 : 400)}px)
         translateZ(-200px) rotateY(${-sign * 30}deg) scale(.85)`;
      item.style.opacity = 0.8;
      item.style.zIndex = 5;
    } else {
      item.style.transform =
        `translate(-50%,-50%) translateX(${sign * (mobile ? 420 : 600)}px)
         translateZ(-350px) rotateY(${-sign * 40}deg) scale(.7)`;
      item.style.opacity = 0.4;
      item.style.zIndex = 2;
    }
  });

  [...indicators.children].forEach((el, i) =>
    el.classList.toggle("active", i === currentIndex)
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

/* =======================
   ATUALIZAÇÕES EM TEMPO REAL
======================= */

function updateBusStatus() {
  document.querySelectorAll(".carousel-item").forEach(item => {
    const id = item.dataset.id;
    const data = portfolioData.find(p => p.id == id);
    const status = getBusStatus(data.horarios);

    item.querySelector(".anterior").innerHTML = `<b>Anterior:</b> ${status.anterior}`;
    item.querySelector(".atual").innerHTML = `<b>Atual:</b> ${status.atual}`;
    item.querySelector(".proximo").innerHTML = `<b>Próximo:</b> ${status.proximo}`;

    const countdown = item.querySelector(".countdown");
    countdown.dataset.time = status.chegadaSegundos;
    countdown.innerText = formatCountdown(status.chegadaSegundos);
  });
}

function updateCountdowns() {
  document.querySelectorAll(".countdown").forEach(el => {
    let sec = parseInt(el.dataset.time);
    if (!isNaN(sec) && sec > 0) {
      sec--;
      el.dataset.time = sec;
      el.innerText = formatCountdown(sec);
    }
  });
}

function updateClock() {
  const now = new Date();
  document.getElementById("clock").innerText =
    `${now.toLocaleDateString("pt-BR")} • ${now.toLocaleTimeString("pt-BR")}`;
}

/* =======================
   EVENTOS
======================= */

document.getElementById("nextBtn").onclick = next;
document.getElementById("prevBtn").onclick = prev;

setInterval(updateClock, 1000);
setInterval(updateCountdowns, 1000);
setInterval(updateBusStatus, 1000);
setInterval(next, 5000);

window.addEventListener("resize", updateCarousel);
window.addEventListener("load", () => {
  updateClock();
  initCarousel();
});
