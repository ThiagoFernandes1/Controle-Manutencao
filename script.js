let dados = [];
let tema = localStorage.getItem('tema') || 'light';
let usuarioId = localStorage.getItem('usuarioId');
let db = null;
let firebaseReady = false;

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

// Esperar Firebase carregar
async function aguardarFirebase(tentativas = 0) {
  if (tentativas > 30) { // 30 tentativas = 3 segundos
    console.error('❌ Firebase não carregou após 3 segundos');
    alert('⚠️ Erro ao carregar Firebase!\n\nPossível motivo:\n1. Conexão com internet lenta\n2. Scripts do Firebase bloqueados\n3. Verifique o console (F12) para mais detalhes\n\nTente recarregar a página (F5)');
    return false;
  }

  if (typeof firebase !== 'undefined' && firebase.initializeApp) {
    console.log('✅ Firebase carregado com sucesso!');
    return true;
  }

  await new Promise(resolve => setTimeout(resolve, 100));
  return aguardarFirebase(tentativas + 1);
}

// Inicializar Firebase
async function initFirebase() {
  try {
    // Esperar Firebase estar disponível
    const firebaseCarregado = await aguardarFirebase();
    if (!firebaseCarregado) {
      throw new Error('Firebase não conseguiu carregar');
    }

    console.log('🔥 Iniciando Firebase com configuração...');
    console.log('projectId:', firebaseConfig.projectId);
    console.log('databaseURL:', firebaseConfig.databaseURL);

    if (!firebase.apps.length) {
      firebase.initializeApp(firebaseConfig);
      db = firebase.database();
      firebaseReady = true;
      console.log('✅ Firebase inicializado com sucesso!');
      console.log('🗄️ Database URL:', firebaseConfig.databaseURL);
    }
    
    if (!usuarioId) {
      usuarioId = 'user_' + Date.now();
      localStorage.setItem('usuarioId', usuarioId);
      console.log('📱 Novo usuário criado:', usuarioId);
    } else {
      console.log('👤 Usuário existente:', usuarioId);
    }
    
    carregarDados();
  } catch (erro) {
    firebaseReady = false;
    console.error('❌ Erro ao inicializar Firebase:', erro.message);
    console.error('Stack:', erro.stack);
    
    // Mostrar erro mais detalhado
    const mensagem = `⚠️ Erro ao conectar com Firebase!\n\n` +
      `Erro: ${erro.message}\n\n` +
      `Verifique:\n` +
      `1. As credenciais estão corretas em script.js?\n` +
      `2. O Realtime Database está ativado?\n` +
      `3. Abra o Console (F12) para ver mais detalhes\n\n` +
      `GitHub Pages: thiagofernandes1.github.io`;
    
    alert(mensagem);
  }
}

function carregarDados() {
  if (!db) {
    console.error('❌ Banco de dados não inicializado!');
    return;
  }
  
  const caminho = 'usuarios/' + usuarioId + '/manutencoes';
  console.log('📡 Carregando dados de:', caminho);
  
  db.ref(caminho).on('value', (snapshot) => {
    dados = snapshot.val() || [];
    console.log('📥 Dados carregados:', dados.length > 0 ? dados.length + ' itens' : 'Nenhum item');
    render();
  }, (erro) => {
    console.error('❌ Erro ao carregar dados:', erro);
  });
}

if (tema === 'dark') {
  document.body.classList.add('dark');
}

function toggleTema() {
  document.body.classList.toggle('dark');
  localStorage.setItem('tema', document.body.classList.contains('dark') ? 'dark' : 'light');
}

function addItem() {
  if (!firebaseReady || !db) {
    alert('❌ Erro: Banco de dados não conectado!\n\nO Firebase ainda não está pronto.\n\nTente:\n1. Recarregar a página (F5)\n2. Verifique o console (F12) para mais detalhes\n3. Verifique sua conexão com internet');
    console.error('Firebase não está pronto. firebaseReady:', firebaseReady, 'db:', db);
    return;
  }

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
    
    const caminho = 'usuarios/' + usuarioId + '/manutencoes/' + novoItem.id;
    console.log('💾 Salvando em:', caminho);
    
    // Salvar no Firebase
    db.ref(caminho).set(novoItem)
      .then(() => {
        console.log('✅ Item salvo com sucesso!', novoItem.id);
        limparFormulario();
        alert('✅ Item adicionado com sucesso!');
      })
      .catch((erro) => {
        console.error('❌ Erro ao salvar item:', erro.message);
        alert('❌ Erro ao salvar item:\n' + erro.message + '\n\nVerifique se o Realtime Database está ativo e as regras permitem acesso.');
      });
  };
  
  reader.onerror = () => {
    console.error('❌ Erro ao ler arquivo');
    alert('❌ Erro ao processar a imagem!');
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
  if (!firebaseReady || !db) {
    console.error('Firebase não está pronto para alterarStatus');
    alert('⚠️ Firebase não está conectado. Tente recarregar a página (F5)');
    return;
  }

  const item = dados.find(d => d.id === parseInt(id));
  if (item) {
    item.status = v;
    item.historico.push(`Status alterado para ${v} em ${new Date().toLocaleString()}`);
    db.ref('usuarios/' + usuarioId + '/manutencoes/' + id).set(item)
      .catch((erro) => {
        console.error('❌ Erro ao alterar status:', erro.message);
        alert('❌ Erro ao alterar status: ' + erro.message);
      });
  }
}

function excluir(id) {
  if (!firebaseReady || !db) {
    console.error('Firebase não está pronto para excluir');
    alert('⚠️ Firebase não está conectado. Tente recarregar a página (F5)');
    return;
  }

  if (confirm('Excluir item?')) {
    db.ref('usuarios/' + usuarioId + '/manutencoes/' + id).remove()
      .catch((erro) => {
        console.error('❌ Erro ao excluir:', erro.message);
        alert('❌ Erro ao excluir: ' + erro.message);
      });
  }
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

// Inicializar a aplicação ao carregar
document.addEventListener('DOMContentLoaded', () => {
  initFirebase();
});
