/* =========================================================
   EMBARCA IFMG - MONITOR.JS
   Painel Monitor de Transporte (Front-End)
   ========================================================= */

   let dadosPainel = null;
   let eventos = null;
   let climaOnline = false;
   
   /* ================================
      CARREGAMENTO INICIAL
      ================================ */
   async function carregarDados() {
     try {
       const [dados, eventosData] = await Promise.all([
         fetch("../JSON/dados.json").then(r => r.json()),
         fetch("../JSON/cronograma.json").then(r => r.json())
       ]);
   
       dadosPainel = dados;
       eventos = eventosData;
       inicializarPainel();
     } catch (error) {
       console.error("Erro ao carregar os arquivos JSON:", error);
     }
   }
   
   /* ================================
      INICIALIZAÇÃO
      ================================ */
   function inicializarPainel() {
     const container = document.getElementById("busContainer");
   
     dadosPainel.linhas.forEach(linha => {
       const card = document.createElement("div");
       card.classList.add("bus-card");
       card.id = `bus${linha.id}`;
       card.innerHTML = `
         <div class="bus-title">${linha.nome}</div>
         <div class="bus-info" id="status${linha.id}">Carregando...</div>
         <div class="bus-times" id="times${linha.id}"></div>
       `;
       container.appendChild(card);
     });
   
     atualizarTudo();
     setInterval(atualizarPainel, 10000);
     setInterval(atualizarRelogio, 1000);
     setInterval(atualizarClima, 300000);
   }
   
   /* ================================
      🌤 CLIMA (Com fallback offline)
      ================================ */
   async function atualizarClima() {
     const weatherText = document.getElementById("weather-text");
     const statusIndicador = document.getElementById("status-indicador");
   
     try {
       const res = await fetch("https://wttr.in/?format=j1");
       const data = await res.json();
       const cond = data.current_condition[0];
       const descEn = cond.weatherDesc[0].value;
       const temp = cond.temp_C;
   
       const traducoes = {
         "Sunny": ["Ensolarado", "☀️"],
         "Clear": ["Céu Limpo", "🌞"],
         "Partly cloudy": ["Parcialmente Nublado", "🌤️"],
         "Cloudy": ["Nublado", "☁️"],
         "Overcast": ["Encoberto", "☁️"],
         "Light rain": ["Chuva Leve", "🌧️"],
         "Patchy rain possible": ["Possível Chuva Leve", "🌦️"],
         "Rain": ["Chuva", "🌧️"],
         "Thunderstorm": ["Tempestade", "⛈️"]
       };
   
       const [descPt, emoji] = traducoes[descEn] || ["Tempo Estável", "🌤️"];
       weatherText.textContent = `${emoji} ≈${temp}°C - ${descPt}`;
       climaOnline = true;
     } catch {
       const clima = dadosPainel.climas[Math.floor(Math.random() * dadosPainel.climas.length)];
       const temperatura = Math.floor(Math.random() * 8) + 23;
       weatherText.textContent = `${clima.icon} ${temperatura}°C - ${clima.nome}`;
       climaOnline = false;
     }
   
     statusIndicador.textContent = climaOnline ? "🟢 Online" : "🔴 Simulado";
     statusIndicador.style.background = climaOnline
       ? "rgba(200,255,200,0.3)"
       : "rgba(255,200,200,0.3)";
   }
   
   /* ================================
      🕒 RELÓGIO E EVENTOS
      ================================ */
   function atualizarRelogio() {
     const clock = document.getElementById("clock");
     const agora = new Date();
     const data = agora.toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'long' });
     const hora = agora.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
     clock.textContent = `${data} | ${hora}`;
     verificarEventoAtivo(agora);
   }
   
   /* ================================
      🎓 EVENTO ATUAL / TEMA
      ================================ */
   function verificarEventoAtivo(agora) {
     const banner = document.getElementById("event-banner");
     const hoje = agora.toISOString().split("T")[0];
     let eventoAtivo = eventos.especiais.find(e => e.data === hoje);
   
     if (!eventoAtivo) {
       const diaSemana = agora.getDay();
       if (diaSemana === 0 || diaSemana === 6)
         eventoAtivo = { tipo: "fimdesemana", nome: "Final de Semana" };
     }
   
     if (eventoAtivo) {
       banner.classList.remove("hidden");
       banner.textContent = `📅 ${eventoAtivo.nome}`;
       document.body.className = `tema-${eventoAtivo.tipo}`;
     } else {
       banner.classList.add("hidden");
       document.body.className = "";
     }
   }
   
   /* ================================
      📅 LISTAGEM DE EVENTOS DO MÊS
      ================================ */
   function listarEventosDoMes() {
     const lista = document.getElementById("lista-eventos");
     lista.innerHTML = "";
   
     const hoje = new Date();
     const mesAtual = hoje.getMonth() + 1;
     const ano = hoje.getFullYear();
   
     const proximos = eventos.especiais.filter(ev => {
       const data = new Date(ev.data);
       return data.getMonth() + 1 === mesAtual && data.getFullYear() === ano;
     });
   
     if (proximos.length === 0) {
       lista.innerHTML = "<li>Sem eventos registrados neste mês.</li>";
       return;
     }
   
     proximos.forEach(ev => {
       const data = new Date(ev.data);
       const dia = data.getDate().toString().padStart(2, "0");
       const mes = data.toLocaleString("pt-BR", { month: "short" });
       const item = document.createElement("li");
       item.textContent = `${dia} de ${mes} — ${ev.nome}`;
       lista.appendChild(item);
     });
   }
   
   /* ================================
      🚌 ATUALIZAÇÃO DOS ÔNIBUS
      ================================ */
   function atualizarPainel() {
     const agora = new Date();
     const diaSemana = agora.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
   
     dadosPainel.linhas.forEach(linha => {
       const horariosDia = linha.horarios[diaSemana] || [];
       if (horariosDia.length === 0) return;
   
       const horaAtual = agora.getHours();
       const minutoAtual = agora.getMinutes();
       const agoraMin = horaAtual * 60 + minutoAtual;
   
       let anterior = "---", atual = "---", proximo = "---";
       for (let i = 0; i < horariosDia.length; i++) {
         const [h, m] = horariosDia[i].split(":").map(Number);
         const totalMin = h * 60 + m;
         if (totalMin <= agoraMin) anterior = horariosDia[i];
         else if (totalMin > agoraMin && atual === "---") {
           atual = horariosDia[i];
           proximo = horariosDia[i + 1] || "---";
           break;
         }
       }
   
       const tempoRestante = proximo !== "---" ? calcularDiferencaMinutos(agora, proximo) : "---";
       const status = document.getElementById(`status${linha.id}`);
       const times = document.getElementById(`times${linha.id}`);
   
       let extraInfo = "";
       if (linha.id === "1012")
         extraInfo = Math.random() > 0.5 ? "Indo para o Terminal" : "Indo para o Morada da Serra";
   
       status.innerHTML = `
         <p>⏳ Próxima chegada: <span class="highlight">${tempoRestante} min</span></p>
         ${extraInfo ? `<p>🚏 ${extraInfo}</p>` : ""}
       `;
       times.innerHTML = `
         <p>🕓 Anterior: <span class="highlight">${anterior}</span></p>
         <p>🚌 Atual: <span class="highlight">${atual}</span></p>
         <p>⏭ Próximo: <span class="highlight">${proximo}</span></p>
       `;
   
       aplicarFade(status);
       aplicarFade(times);
     });
   }
   
   /* ================================
      🔄 FUNÇÕES AUXILIARES
      ================================ */
   function aplicarFade(el) {
     el.classList.remove("fade-change");
     void el.offsetWidth;
     el.classList.add("fade-change");
   }
   
   function calcularDiferencaMinutos(agora, horarioDestino) {
     const [h, m] = horarioDestino.split(":").map(Number);
     const destinoMin = h * 60 + m;
     const agoraMin = agora.getHours() * 60 + agora.getMinutes();
     const diff = destinoMin - agoraMin;
     return diff > 0 ? diff : 0;
   }
   
   function atualizarTudo() {
     atualizarPainel();
     atualizarRelogio();
     atualizarClima();
     listarEventosDoMes();
   }
   
   /* Inicialização */
   carregarDados();
   