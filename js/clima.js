/* =====================================================
   CLIMA.JS — EMBARCA IFMG
   Responsável por exibir condições climáticas
   Autores: Paicheco & Heringe
   ===================================================== */

(function(){

  const elClima = document.getElementById("clima");
  if(!elClima) return;

  const CIDADE = CONFIG.clima.cidade;
  const INTERVALO = CONFIG.clima.atualizacaoMin * 60 * 1000;

  /* =================================================
     IMPORTANTE:
     Crie uma conta gratuita em:
     https://openweathermap.org/
     Pegue sua API KEY e cole abaixo
     ================================================= */
  const API_KEY = "SUA_API_KEY_AQUI";

  async function carregarClima(){
    try{
      const url =
        `https://api.openweathermap.org/data/2.5/weather` +
        `?q=${CIDADE}` +
        `&units=metric` +
        `&lang=pt_br` +
        `&appid=${API_KEY}`;

      const resp = await fetch(url);
      const dados = await resp.json();

      if(dados.cod !== 200){
        elClima.textContent = "Clima indisponível";
        return;
      }

      const descricao = dados.weather[0].description;
      const temp = Math.round(dados.main.temp);
      const icone = dados.weather[0].icon;

      elClima.innerHTML = `
        <img src="https://openweathermap.org/img/wn/${icone}.png"
             alt="Clima"
             style="height:20px;vertical-align:middle">
        ${descricao} • ${temp}°C
      `;
    }
    catch(err){
      elClima.textContent = "Clima indisponível";
    }
  }

  // Primeira carga
  carregarClima();

  // Atualização automática
  setInterval(carregarClima, INTERVALO);

})();
