/* =====================================================
   CALENDARIO.JS — EMBARCA IFMG
   Exibe calendário acadêmico simplificado
   Autores: Paicheco & Heringe
   ===================================================== */

(function(){

  const painel = document.getElementById("painel");
  if(!painel) return;

  window.renderCalendario = function(){
    painel.innerHTML = "";

    const card = document.createElement("section");
    card.className = "card";

    let html = `
      <h2>Calendário Acadêmico</h2>
      <div class="desc">Eventos importantes do semestre</div>
      <ul style="margin-top:15px;line-height:1.8">
    `;

    CONFIG.calendario.forEach(ev => {
      const data = new Date(ev.data);
      const dataFmt = data.toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "long",
        year: "numeric"
      });

      html += `<li><strong>${dataFmt}</strong> — ${ev.evento}</li>`;
    });

    html += "</ul>";
    card.innerHTML = html;

    painel.appendChild(card);
  };

})();
