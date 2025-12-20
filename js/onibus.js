/* =====================================================
   ONIBUS.JS — EMBARCA IFMG
   Responsável por:
   - calcular ônibus anterior / atual / próximo
   - calcular progresso do trajeto
   - exibir aviso de chegada
   Autores: Paicheco & Heringe
   ===================================================== */

(function(){

  const painel = document.getElementById("painel");
  if(!painel) return;

  /* ================= UTIL ================= */

  function horaParaMinutos(hora){
    const [h, m] = hora.split(":").map(Number);
    return h * 60 + m;
  }

  function agoraEmMinutos(){
    const agora = new Date();
    return agora.getHours() * 60 + agora.getMinutes();
  }

  /* ================= RENDER ================= */

  function renderOnibus(){
    painel.innerHTML = "";

    const agora = agoraEmMinutos();

    CONFIG.onibus.forEach(linha => {

      let anterior = "--";
      let atual = "--";
      let proximo = "--";
      let progresso = 0;
      let chegando = false;

      const horarios = linha.horarios.map(h => horaParaMinutos(h));

      for(let i = 0; i < horarios.length; i++){
        if(horarios[i] <= agora){
          atual = linha.horarios[i];
          if(i > 0) anterior = linha.horarios[i - 1];
        }
        if(horarios[i] > agora && proximo === "--"){
          proximo = linha.horarios[i];
        }
      }

      if(atual !== "--" && proximo !== "--"){
        const inicio = horaParaMinutos(atual);
        const fim = horaParaMinutos(proximo);
        progresso = ((agora - inicio) / (fim - inicio)) * 100;

        if(progresso >= 85){
          chegando = true;
        }
      }

      if(progresso < 0) progresso = 0;
      if(progresso > 100) progresso = 100;

      const card = document.createElement("section");
      card.className = "card" + (chegando ? " chegando" : "");

      card.innerHTML = `
        <h2>Linha ${linha.linha}</h2>
        <div class="desc">${linha.descricao}</div>

        <div class="status">
          <div>Anterior<span>${anterior}</span></div>
          <div>Atual<span>${atual}</span></div>
          <div>Próximo<span>${proximo}</span></div>
        </div>

        <div class="progresso">
          <span style="width:${progresso}%"></span>
        </div>
      `;

      painel.appendChild(card);
    });
  }

  /* ================= AUTO UPDATE ================= */

  renderOnibus();
  setInterval(renderOnibus, 30000);

})();
