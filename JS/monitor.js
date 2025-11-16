/* =========================================================
   EMBARCA IFMG — MONITOR.JS (VERSÃO ESTÁVEL)
   — Compatível com DATA/*.js
   — Sem import/export
   — Barra de progresso funcional
========================================================= */

let DADOS = null;
let EVENTOS_DATA = null;

/* =============================================
   INICIAR
============================================= */
function iniciarPainel() {
  if (!window.DADOS_PAINEL || !window.EVENTOS) {
    console.error("Erro: Dados não encontrados.");
    return;
  }

  DADOS = window.DADOS_PAINEL;
  EVENTOS_DATA = window.EVENTOS;

  montarCards();
  atualizarTudo();

  setInterval(atualizarTudo, 10 * 1000);
  setInterval(atualizarHora, 1000);
  setInterval(atualizarClima, 5 * 60 * 1000);
}

/* =============================================
   MONTAR CARDS
============================================= */
function montarCards() {
  const container = document.querySelector(".cards-area");

  DADOS.linhas.forEach(linha => {
    const card = document.createElement("div");
    card.className = "bus-card";
    card.id = `bus-${linha.id}`;

    card.innerHTML = `
      <div class="card-top">${linha.id}</div>

      <div class="card-body">
        <div class="card-route">${linha.nome}</div>

        <div class="card-times" id="times-${linha.id}">
        </div>

        <div class="card-estimate" id="estimate-${linha.id}">
          —
        </div>

        <div class="card-progress">
          <div class="progress-fill" id="progress-${linha.id}"></div>
        </div>
      </div>
    `;

    container.appendChild(card);
  });
}

/* =============================================
   ATUALIZAÇÕES GERAIS
============================================= */
function atualizarTudo() {
  atualizarOnibus();
  atualizarHora();
  atualizarClima();
  atualizarCalendario();
}

/* =============================================
   HORA E DATA
============================================= */
function atualizarHora() {
  const el = document.getElementById("banner-hora");
  const agora = new Date();

  el.textContent = agora.toLocaleString("pt-BR", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit"
  });
}

/* =============================================
   CLIMA
============================================= */
async function atualizarClima() {
  const el = document.getElementById("banner-clima");

  const traduz = s =>
    s.replace(/Sunny/i, "Ensolarado")
     .replace(/Partly cloudy/i, "Parcialmente nublado")
     .replace(/Cloudy/i, "Nublado")
     .replace(/Rain/i, "Chuva")
     .replace(/Light rain/i, "Chuva leve")
     .replace(/Thunderstorm/i, "Tempestade");

  try {
    const r = await fetch("https://wttr.in/?format=j1");
    const j = await r.json();
    const c = j.current_condition[0];

    el.textContent = `${c.temp_C}°C — ${traduz(c.weatherDesc[0].value)}`;

  } catch {
    el.textContent = "≈ 24°C — Clima estimado";
  }
}

/* =============================================
   HORÁRIOS + BARRA DE PROGRESSO
============================================= */
function atualizarOnibus() {
  const agora = new Date();
  const agoraMin = agora.getHours() * 60 + agora.getMinutes();

  DADOS.linhas.forEach(linha => {
    const diaSemana = agora
      .toLocaleDateString("en-US", { weekday: "long" })
      .toLowerCase();

    const horarios = linha.horarios[diaSemana] || [];

    let anterior = "---";
    let proximo = "---";

    horarios.forEach(h => {
      const [H, M] = h.split(":").map(Number);
      const total = H * 60 + M;

      if (total <= agoraMin) anterior = h;
      if (total > agoraMin && proximo === "---") proximo = h;
    });

    const timesEl = document.getElementById(`times-${linha.id}`);
    const estEl = document.getElementById(`estimate-${linha.id}`);
    const progEl = document.getElementById(`progress-${linha.id}`);

    /* ------------------------------- */
    /* Atualiza horários no card       */
    /* ------------------------------- */
    timesEl.innerHTML = `
      <div><span class="label">Hora Anterior:</span> ${anterior}</div>
      <div><span class="label">Hora Atual:</span> —</div>
      <div><span class="label">Próxima Hora:</span> ${proximo}</div>
    `;

    /* ------------------------------- */
    /* Barra de progresso              */
    /* ------------------------------- */
    if (anterior !== "---" && proximo !== "---") {
      const [hA, mA] = anterior.split(":").map(Number);
      const [hP, mP] = proximo.split(":").map(Number);

      const tA = hA * 60 + mA;
      const tP = hP * 60 + mP;

      const progresso = ((agoraMin - tA) / (tP - tA)) * 100;
      const final = Math.min(Math.max(progresso, 0), 100);

      progEl.style.width = `${final}%`;

      if (final > 90) {
        progEl.classList.add("near");
        estEl.textContent = "Chegando…";
      } else {
        progEl.classList.remove("near");
        estEl.textContent = "Aproximação…";
      }

    } else {
      progEl.style.width = "0%";
      progEl.classList.remove("near");
      estEl.textContent = "—";
    }
  });
}

/* =============================================
   CALENDÁRIO
============================================= */
function atualizarCalendario() {
  const mini = document.querySelector(".mini-calendar");
  if (!mini) return;

  const hoje = new Date();
  const mes = hoje.getMonth();
  const ano = hoje.getFullYear();

  const ultimo = new Date(ano, mes + 1, 0).getDate();

  mini.innerHTML = "";

  for (let d = 1; d <= ultimo; d++) {
    const day = document.createElement("div");
    day.classList.add("day");
    day.textContent = d;

    const dataStr = `${ano}-${String(mes + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;

    if (dataStr === hoje.toISOString().split("T")[0]) {
      day.classList.add("today");
    }

    EVENTOS_DATA.especiais.forEach(ev => {
      if (ev.data === dataStr) day.classList.add(ev.tipo);
    });

    mini.appendChild(day);
  }
}

/* =============================================
   START
============================================= */
iniciarPainel();
