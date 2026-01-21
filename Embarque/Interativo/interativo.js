const horariosBase = {
  "1012": {
    morada: [
      { hora: "04:30", chegadaMedia: 45 },
      { hora: "05:30", chegadaMedia: 45 },
      { hora: "06:20", chegadaMedia: 45 },
      { hora: "08:00", chegadaMedia: 45 },
      { hora: "09:45", chegadaMedia: 45 },
      { hora: "11:30", chegadaMedia: 45 },
      { hora: "13:20", chegadaMedia: 45 },
      { hora: "15:20", chegadaMedia: 45 },
      { hora: "17:10", chegadaMedia: 45 },
      { hora: "18:10", chegadaMedia: 45 },
      { hora: "19:30", chegadaMedia: 45 },
      { hora: "21:50", chegadaMedia: 45 }
    ],
    terminal: [
      { hora: "04:30", chegadaMedia: 75 },
      { hora: "05:30", chegadaMedia: 75 },
      { hora: "06:20", chegadaMedia: 75 },
      { hora: "08:00", chegadaMedia: 75 },
      { hora: "09:45", chegadaMedia: 75 },
      { hora: "11:30", chegadaMedia: 75 },
      { hora: "13:20", chegadaMedia: 75 },
      { hora: "15:20", chegadaMedia: 75 },
      { hora: "17:10", chegadaMedia: 75 },
      { hora: "18:10", chegadaMedia: 75 },
      { hora: "19:30", chegadaMedia: 75 },
      { hora: "21:50", chegadaMedia: 75 }
    ]
  },
  "1750": {
  padrao: [
    { hora: "04:30", chegadaMedia: 60 },
    { hora: "05:00", chegadaMedia: 60 },
    { hora: "05:20", chegadaMedia: 60 },
    { hora: "05:35", chegadaMedia: 60 },
    { hora: "05:45", chegadaMedia: 60 },
    { hora: "05:55", chegadaMedia: 60 },
    { hora: "06:05", chegadaMedia: 60 },
    { hora: "06:20", chegadaMedia: 60 },
    { hora: "06:30", chegadaMedia: 60 },
    { hora: "06:40", chegadaMedia: 60 },
    { hora: "06:55", chegadaMedia: 60 },
    { hora: "07:20", chegadaMedia: 60 },
    { hora: "07:40", chegadaMedia: 60 },
    { hora: "08:00", chegadaMedia: 60 },
    { hora: "08:40", chegadaMedia: 60 },
    { hora: "09:20", chegadaMedia: 60 },
    { hora: "10:00", chegadaMedia: 60 },
    { hora: "10:40", chegadaMedia: 60 },
    { hora: "11:20", chegadaMedia: 60 },
    { hora: "12:00", chegadaMedia: 60 },
    { hora: "13:00", chegadaMedia: 60 },
    { hora: "13:40", chegadaMedia: 60 },
    { hora: "14:20", chegadaMedia: 60 },
    { hora: "15:00", chegadaMedia: 60 },
    { hora: "15:20", chegadaMedia: 60 },
    { hora: "15:40", chegadaMedia: 60 },
    { hora: "16:00", chegadaMedia: 60 },
    { hora: "16:15", chegadaMedia: 60 },
    { hora: "16:30", chegadaMedia: 60 },
    { hora: "16:45", chegadaMedia: 60 },
    { hora: "17:00", chegadaMedia: 60 },
    { hora: "17:15", chegadaMedia: 60 },
    { hora: "17:30", chegadaMedia: 60 },
    { hora: "17:45", chegadaMedia: 60 },
    { hora: "18:00", chegadaMedia: 60 },
    { hora: "18:20", chegadaMedia: 60 },
    { hora: "18:40", chegadaMedia: 60 },
    { hora: "19:00", chegadaMedia: 60 },
    { hora: "19:30", chegadaMedia: 60 },
    { hora: "20:00", chegadaMedia: 60 },
    { hora: "20:40", chegadaMedia: 60 },
    { hora: "21:20", chegadaMedia: 60 },
    { hora: "22:20", chegadaMedia: 60 }
  ]
},
  "1751": {
    padrao: [
      { hora: "05:25", chegadaMedia: 50 },
        { hora: "06:10", chegadaMedia: 50 },
        { hora: "06:55", chegadaMedia: 50 },
        { hora: "07:35", chegadaMedia: 50 },
        { hora: "08:10", chegadaMedia: 50 },
        { hora: "09:30", chegadaMedia: 50 },
        { hora: "11:00", chegadaMedia: 50 },
        { hora: "12:20", chegadaMedia: 50 },
        { hora: "14:00", chegadaMedia: 50 },
        { hora: "16:30", chegadaMedia: 50 },
        { hora: "18:00", chegadaMedia: 50 },
        { hora: "19:50", chegadaMedia: 50 },
        { hora: "21:20", chegadaMedia: 50 }
    ]
  }
};

let personalizacoes = JSON.parse(localStorage.getItem("personalizacoes")) || {};

const onibusSelect = document.getElementById("onibus");
const rotaSelect = document.getElementById("rota");
const lista = document.getElementById("lista-horarios");
const aviso = document.getElementById("aviso");
const clock = document.getElementById("clock");

function atualizarRelogio() {
  const now = new Date();
  const data = now.toLocaleDateString("pt-BR");
  const hora = now.toLocaleTimeString("pt-BR");
  clock.innerText = `${data} • ${hora}`;
}

function iniciar() {
  onibusSelect.innerHTML = `<option value="">Selecione o ônibus</option>`;
  Object.keys(horariosBase).forEach(o => {
    onibusSelect.innerHTML += `<option value="${o}">${o}</option>`;
  });

  onibusSelect.addEventListener("change", atualizarRotas);
  rotaSelect.addEventListener("change", renderizarHorarios);

  atualizarRelogio();
  setInterval(atualizarRelogio, 1000);
}

function atualizarRotas() {
  rotaSelect.innerHTML = "";
  lista.innerHTML = "";
  aviso.innerHTML = "";

  const onibus = onibusSelect.value;
  if (!onibus) return;

  Object.keys(horariosBase[onibus]).forEach(r => {
    rotaSelect.innerHTML += `<option value="${r}">${r}</option>`;
  });

  renderizarHorarios();
}

function somarMinutos(hora, minutos) {
  const [h, m] = hora.split(":").map(Number);
  const d = new Date();
  d.setHours(h);
  d.setMinutes(m + minutos);
  return d.toTimeString().slice(0, 5);
}

function renderizarHorarios() {
  lista.innerHTML = "";
  aviso.innerHTML = "";

  const onibus = onibusSelect.value;
  const rota = rotaSelect.value;

  if (!onibus || !rota) {
    aviso.innerText = "Selecione um ônibus e uma rota.";
    return;
  }

  horariosBase[onibus][rota].forEach(h => {
    const chave = `${onibus}_${rota}_${h.hora}`;
    const personalizado = personalizacoes[chave];

    const chegadaSistema = somarMinutos(h.hora, h.chegadaMedia);
    const chegadaUsuario = personalizado
      ? somarMinutos(h.hora, personalizado)
      : chegadaSistema;

    const diferenca = personalizado
      ? `(${personalizado - h.chegadaMedia >= 0 ? "+" : ""}${personalizado - h.chegadaMedia} min)`
      : "";

    const card = document.createElement("div");
    card.className = "horario-card";

    card.innerHTML = `
      <h3>🕒 ${h.hora}</h3>
      <p>⏱ Sistema: <strong>${chegadaSistema}</strong></p>
      <p>👤 Você: <strong>${chegadaUsuario}</strong> ${diferenca}</p>
      <div class="acoes">
        <button onclick="ajustar('${chave}', ${h.chegadaMedia})">✏ Ajustar</button>
        ${personalizado ? `<button onclick="remover('${chave}')">🗑 Remover</button>` : ""}
      </div>
    `;

    lista.appendChild(card);
  });
}

function ajustar(chave, base) {
  const valor = prompt("Quantos minutos ele leva para chegar? (do momento da saída do termnial)", base);
  if (!valor) return;
  const min = Number(valor);
  if (isNaN(min) || min <= 0) return;

  personalizacoes[chave] = min;
  localStorage.setItem("personalizacoes", JSON.stringify(personalizacoes));
  renderizarHorarios();
}

function remover(chave) {
  delete personalizacoes[chave];
  localStorage.setItem("personalizacoes", JSON.stringify(personalizacoes));
  renderizarHorarios();
}

iniciar();

