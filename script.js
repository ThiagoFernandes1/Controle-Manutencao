let dados = [];
let tema = localStorage.getItem('tema') || 'light';
let usuarioId = localStorage.getItem('usuarioId') || 'user_' + Date.now();
let db = null;
let firebaseReady = false;

// Salvar usuarioId se novo
localStorage.setItem('usuarioId', usuarioId);

// Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyCEZU25IPiS5K5NDZcJz6PMCuatJfcu79o",
  authDomain: "manutencao-app-cb0d5.firebaseapp.com",
  databaseURL: "https://manutencao-app-cb0d5-default-rtdb.firebaseio.com",
  projectId: "manutencao-app-cb0d5",
  storageBucket: "manutencao-app-cb0d5.firebasestorage.app",
  messagingSenderId: "948627041750",
  appId: "1:948627041750:web:174f3b2173a680e2cc0877",
  measurementId: "G-1R3QZ0T16P"
};

// Tentar inicializar Firebase se disponível (sem erros)
function inicializarFirebaseSeDisponivel() {
  try {
    if (typeof firebase !== 'undefined' && firebase.initializeApp) {
      if (!firebase.apps.length) {
        firebase.initializeApp(firebaseConfig);
        db = firebase.database();
        firebaseReady = true;
        console.log('✅ Firebase inicializado com sucesso!');
        sincronizarComFirebase();
      }
    } else {
      console.log('ℹ️ Firebase não disponível - usando localStorage');
    }
  } catch (erro) {
    console.log('ℹ️ Firebase não disponível:', erro.message);
  }
}

function sincronizarComFirebase() {
  if (!firebaseReady || !db) return;
  
  try {
    const caminho = 'usuarios/' + usuarioId + '/manutencoes';
    console.log('📡 Sincronizando com Firebase:', caminho);
    
    // Sincronizar: carregar dados do Firebase em tempo real
    db.ref(caminho).on('value', (snapshot) => {
      const dadosFirebase = snapshot.val();
      console.log('📥 Dados recebidos do Firebase:', dadosFirebase ? Object.keys(dadosFirebase).length + ' itens' : 'vazio');
      
      if (dadosFirebase && typeof dadosFirebase === 'object') {
        // Converter objeto do Firebase para array
        dados = Object.values(dadosFirebase);
        localStorage.setItem('manutencao', JSON.stringify(dados));
        console.log('✅ Dados sincronizados do Firebase');
        render();
      }
    }, (erro) => {
      console.log('ℹ️ Erro na sincronização Firebase:', erro.message);
    });
  } catch (erro) {
    console.log('ℹ️ Erro ao sincronizar com Firebase:', erro.message);
  }
}

function carregarDados() {
  // Sempre carregar do localStorage primeiro
  dados = JSON.parse(localStorage.getItem('manutencao')) || [];
  render();
}

if (tema === 'dark') {
  document.body.classList.add('dark');
}

function toggleTema() {
  document.body.classList.toggle('dark');
  localStorage.setItem('tema', document.body.classList.contains('dark') ? 'dark' : 'light');
}

function addItem() {
  if (!nome.value) {
    alert('⚠️ Por favor, preencha o nome do item!');
    return;
  }

  const file = foto.files[0];
  const reader = new FileReader();
  
  reader.onload = () => {
    const novoItem = {
      id: Date.now(),
      nome: nome.value,
      local: local.value,
      categoria: categoria.value,
      status: status.value,
      prioridade: prioridade.value,
      sla: sla.value,
      foto: reader.result || null,
      historico: [`Criado em ${new Date().toLocaleString()}`],
      dataCriacao: new Date().toISOString()
    };
    
    // Salvar no localStorage (principal)
    dados.push(novoItem);
    localStorage.setItem('manutencao', JSON.stringify(dados));
    
    // Tentar sincronizar com Firebase em background (sem erros)
    if (firebaseReady && db) {
      const caminho = 'usuarios/' + usuarioId + '/manutencoes/' + novoItem.id;
      console.log('💾 Salvando no Firebase:', caminho);
      
      db.ref(caminho).set(novoItem)
        .then(() => {
          console.log('✅ Sincronizado com Firebase!');
        })
        .catch((erro) => {
          console.log('ℹ️ Firebase offline (dados salvos localmente):', erro.message);
        });
    }
    
    limparFormulario();
    alert('✅ Item adicionado com sucesso!');
    render();
  };
  
  if (file) {
    reader.readAsDataURL(file);
  } else {
    reader.onload();
  }
}

function limparFormulario() {
  nome.value = '';
  local.value = '';
  categoria.value = 'Ar-condicionado';
  status.value = 'Feito';
  prioridade.value = 'Baixa';
  sla.value = '';
  foto.value = '';
}

function alterarStatus(id, v) {
  const item = dados.find(d => d.id === parseInt(id));
  if (!item) return;

  item.status = v;
  item.historico.push(`Status alterado para ${v} em ${new Date().toLocaleString()}`);

  // Salvar no localStorage
  localStorage.setItem('manutencao', JSON.stringify(dados));
  
  // Tentar sincronizar com Firebase em background
  if (firebaseReady && db) {
    db.ref('usuarios/' + usuarioId + '/manutencoes/' + id).set(item).catch(() => {});
  }
  
  render();
}

function excluir(id) {
  if (!confirm('Excluir item?')) return;

  // Deletar do localStorage
  dados = dados.filter(d => d.id !== parseInt(id));
  localStorage.setItem('manutencao', JSON.stringify(dados));
  
  // Tentar deletar do Firebase em background
  if (firebaseReady && db) {
    db.ref('usuarios/' + usuarioId + '/manutencoes/' + id).remove().catch(() => {});
  }
  
  render();
}

function verHistorico(id) {
  const item = dados.find(d => d.id === parseInt(id));
  if (item) {
    listaHistorico.innerHTML = '';
    item.historico.forEach(h => {
      listaHistorico.innerHTML += `<li>${h}</li>`;
    });
    new bootstrap.Modal(modalHistorico).show();
  }
}

function render() {
  lista.innerHTML = '';
  let f = 0, a = 0, c = 0, slaV = 0;
  const hoje = new Date().toISOString().split('T')[0];
  const filtro = filtroCategoria.value;

  if (!Array.isArray(dados)) {
    dados = [];
  }

  dados.forEach((d) => {
    if (filtro && d.categoria !== filtro) return;
    
    if (d.status === 'Feito') f++;
    if (d.status === 'Em andamento') a++;
    if (d.status === 'Concluído') c++;
    if (d.sla && d.sla < hoje && d.status !== 'Concluído') slaV++;

    lista.innerHTML += `
      <tr>
        <td>${d.foto ? `<img src="${d.foto}" class="thumb">` : ''}</td>
        <td>${d.nome}</td>
        <td>${d.local}</td>
        <td>${d.categoria}</td>
        <td>
          <select class="form-select form-select-sm" onchange="alterarStatus(${d.id}, this.value)">
            <option ${d.status === 'Feito' ? 'selected' : ''}>Feito</option>
            <option ${d.status === 'Em andamento' ? 'selected' : ''}>Em andamento</option>
            <option ${d.status === 'Concluído' ? 'selected' : ''}>Concluído</option>
          </select>
        </td>
        <td>${d.prioridade}</td>
        <td>${d.sla || '-'}</td>
        <td>
          <button class="btn btn-sm btn-info" onclick="verHistorico(${d.id})">Histórico</button>
          <button class="btn btn-sm btn-danger" onclick="excluir(${d.id})">Excluir</button>
        </td>
      </tr>`;
  });

  feito.innerText = f;
  andamento.innerText = a;
  concluidos.innerText = c;
  slaVencido.innerText = slaV;
  atualizarGrafico(f, a, c);
}

let chart;

function atualizarGrafico(f, a, c) {
  if (chart) {
    chart.destroy();
  }

  chart = new Chart(grafico, {
    type: 'bar',
    data: {
      labels: ['Feito', 'Em andamento', 'Concluído'],
      datasets: [{
        label: 'Quantidade',
        data: [f, a, c],
        backgroundColor: ['#28a745', '#ffc107', '#007bff'],
        borderColor: ['#20c997', '#e0a800', '#0056b3'],
        borderWidth: 2
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: {
          display: true,
          position: 'bottom'
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            stepSize: 1
          }
        }
      }
    }
  });
}

// Inicializar aplicação
console.log('✅ App iniciando...');
console.log('👤 Usuário ID:', usuarioId);

carregarDados();
inicializarFirebaseSeDisponivel();

// Tentar Firebase novamente depois de 2 segundos (caso scripts ainda estejam carregando)
setTimeout(() => {
  if (!firebaseReady) {
    console.log('⏳ Tentando Firebase novamente...');
    inicializarFirebaseSeDisponivel();
  }
}, 2000);

// Sincronizar com Firebase a cada 10 segundos (se conectado)
setInterval(() => {
  if (firebaseReady && db) {
    sincronizarComFirebase();
  }
}, 10000);
