// 1. ===== SELECIONANDO OS ELEMENTOS DO HTML =====
const inputCidade = document.querySelector('.search-input');
const btnBuscar = document.querySelector('.btn-search');

const elementoTituloCidade = document.querySelector('.city-name');
const elementoData = document.querySelector('.current-date');
const elementoTemperatura = document.querySelector('.temp-number');
const elementoCondicao = document.querySelector('.weather-condition');
const elementoSensacao = document.querySelector('.weather-feels');

// Pega os dois valores (umidade e vento). Como eles têm a mesma classe, pegamos uma lista.
const elementosDetalhes = document.querySelectorAll('.detail-value');
const elementoUmidade = elementosDetalhes[0];
const elementoVento = elementosDetalhes[1];

const btnTema = document.querySelector('.theme-toggle-btn');

// 2. ===== LÓGICA DO CLIMA (API wttr.in) =====
async function buscarClima(cidade) {
    try {
        // Mostra um aviso de carregando
        elementoTituloCidade.textContent = "Carregando...";
        
        // Faz a requisição (sem API key)
        const url = `https://wttr.in/${encodeURI(cidade)}?format=j1`;
        const resposta = await fetch(url);
        
        if (!resposta.ok) throw new Error('Cidade não encontrada');
        
        const dados = await resposta.json();
        
        // Atualiza a tela com os dados recebidos
        atualizarTela(dados, cidade);

    } catch (erro) {
        alert("Erro ao buscar o clima. Verifique o nome da cidade.");
        elementoTituloCidade.textContent = "Erro";
    }
}

function atualizarTela(dados, cidade) {
    const clima = dados.current_condition[0];

    // Cidade e Data
    elementoTituloCidade.textContent = cidade;
    
    // Coloca a data atual formatada
    const hoje = new Date();
    const opcoesData = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    elementoData.textContent = hoje.toLocaleDateString('pt-BR', opcoesData);

    // Temperatura e Condição
    elementoTemperatura.textContent = clima.temp_C;
    elementoCondicao.textContent = clima.weatherDesc[0].value;
    elementoSensacao.textContent = `Sensação térmica de ${clima.FeelsLikeC}°C`;

    // Detalhes (Umidade e Vento)
    elementoUmidade.textContent = `${clima.humidity}%`;
    elementoVento.textContent = `${clima.windspeedKmph} km/h`;
}

// Eventos de busca
btnBuscar.addEventListener('click', () => {
    if (inputCidade.value.trim() !== '') {
        buscarClima(inputCidade.value.trim());
    }
});

// Buscar ao apertar Enter
inputCidade.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && inputCidade.value.trim() !== '') {
        buscarClima(inputCidade.value.trim());
    }
});


// 3. ===== LÓGICA DO MODO ESCURO =====
// Verifica se o usuário já tinha escolhido o modo escuro antes
const isDarkMode = localStorage.getItem('darkMode') === 'true';

if (isDarkMode) {
    document.body.classList.add('dark-mode');
}

// O CSS da IA já lida com a troca dos ícones (Lua/Sol) baseado na classe .dark-mode no body
btnTema.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    
    // Salva a preferência
    const isNowDark = document.body.classList.contains('dark-mode');
    localStorage.setItem('darkMode', isNowDark);
});

// 4. ===== INICIALIZAÇÃO =====
// Ao abrir a página, já busca o clima de Aracaju por padrão
buscarClima('Aracaju');
