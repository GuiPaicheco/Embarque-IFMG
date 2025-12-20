/* =====================================================
   APP.JS — EMBARCA IFMG
   Arquivo CENTRAL do sistema
   Autores: Paicheco & Heringe
   ===================================================== */

document.addEventListener("DOMContentLoaded", () => {

  /* ================= DETECÇÃO DE MODO ================= */

  const params = new URLSearchParams(window.location.search);
  const modo = params.get("modo") || "monitor";

  document.body.classList.remove("modo-monitor", "modo-interativo");
  document.body.classList.add(`modo-${modo}`);

  /* ================= ELEMENTOS ================= */

  const painel = document.getElementById("painel");
  const topo = document.getElementById("topo");
  const controles = document.getElementById("controles");

  if (!painel) {
    console.error("Elemento #painel não encontrado");
    return;
  }

  /* ================= CONTROLE DE INTERVALO ================= */

  let monitorInterval = null;

  /* ================= UTIL ================= */

  function limpar() {
    painel.innerHTML = "";
  }

  function pararMonitor() {
    if (monitorInterval) {
      clearInterval(monitorInterval);
      monitorInterval = null;
    }
  }

  /* ================= MODO MONITOR ================= */

  function modoMonitor() {
    limpar();
    pararMonitor();

    // Remove controles e bloqueia APENAS o painel
    if (controles) {
      controles.innerHTML = "";
      controles.style.display = "none";
    }

    painel.style.pointerEvents = "none";

    if (topo) {
      topo.innerHTML = `
        <h1>🚌 Embarca IFMG</h1>
        <div class="sub">Painel informativo do campus</div>
      `;
    }

    if (window.renderClima) renderClima();
    if (window.renderCalendario) renderCalendario(true);
    if (window.renderOnibus) renderOnibus(true);

    monitorInterval = setInterval(() => {
      limpar();
      renderClima();
      renderCalendario(true);
      renderOnibus(true);
    }, 60000);
  }

  /* ================= MODO INTERATIVO ================= */

  function modoInterativo() {
    limpar();
    pararMonitor();

    // Reativa interação
    painel.style.pointerEvents = "auto";

    if (controles) {
      controles.style.display = "flex";
      controles.innerHTML = `
        <button data-acao="onibus">Ônibus</button>
        <button data-acao="clima">Clima</button>
        <button data-acao="calendario">Calendário</button>
        <button data-acao="turmas">Turmas</button>
      `;
    }

    if (topo) {
      topo.innerHTML = `
        <h1>🧭 Embarca IFMG</h1>
        <div class="sub">Central interativa do campus</div>
      `;
    }

    controles.querySelectorAll("button").forEach(btn => {
      btn.onclick = () => {
        limpar();
        const acao = btn.dataset.acao;

        if (acao === "onibus" && window.renderOnibus) renderOnibus(false);
        if (acao === "clima" && window.renderClima) renderClima();
        if (acao === "calendario" && window.renderCalendario) renderCalendario(false);
        if (acao === "turmas" && window.renderTurmas) renderTurmas();
      };
    });

    // Tela inicial
    if (window.renderOnibus) renderOnibus(false);
  }

  /* ================= INICIAR ================= */

  if (modo === "interativo") {
    modoInterativo();
  } else {
    modoMonitor();
  }

});
