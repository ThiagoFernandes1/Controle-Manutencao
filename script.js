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
function iniciarAplicacao() {
  try {
    console.log('🔥 Verificando se Firebase está disponível...');
    
    if (typeof firebase === 'undefined') {
      console.error('❌ Firebase não está definido no escopo global');
      console.log('window.firebase:', window.firebase);
      throw new Error('Firebase não foi carregado pelos scripts CDN');
    }

    if (!firebase.initializeApp) {
      console.error('❌ firebase.initializeApp não existe');
      throw new Error('Firebase SDK não foi carregado corretamente');
    }

    console.log('✅ Firebase SDK encontrado!');
    console.log('projectId:', firebaseConfig.projectId);
    console.log('databaseURL:', firebaseConfig.databaseURL);

    if (!firebase.apps.length) {
      firebase.initializeApp(firebaseConfig);
      db = firebase.database();
      firebaseReady = true;
      console.log('✅ Firebase inicializado com sucesso!');
      console.log('🗄️ Conectado ao banco:', firebaseConfig.projectId);
    }
    
    if (!usuarioId) {
      usuarioId = 'user_' + Date.now();
      localStorage.setItem('usuarioId', usuarioId);
      console.log('📱 Novo usuário:', usuarioId);
    } else {
      console.log('👤 Usuário existente:', usuarioId);
    }
    
    carregarDados();
  } catch (erro) {
    firebaseReady = false;
    console.error('❌ ERRO FATAL:', erro.message);
    console.error('Stack completo:', erro.stack);
    
    // Log do escopo global
    console.log('🔍 Debug Info:');
    console.log('- firebase definido?', typeof firebase);
    console.log('- firebase.initializeApp?', firebase && typeof firebase.initializeApp);
    console.log('- document.readyState:', document.readyState);
    
    alert('⚠️ ERRO AO INICIALIZAR FIREBASE\n\n' +
      'Erro: ' + erro.message + '\n\n' +
      'Abra o Console (F12 > Console) e procure por mensagens em vermelho.\n\n' +
      'Possíveis causas:\n' +
      '1. Scripts do Firebase bloqueados pelo navegador\n' +
      '2. Página carregada sem HTTPS (se em GitHub Pages)\n' +
      '3. Combustor ou adicional bloqueando scripts\n\n' +
      'Tente:\n' +
      '- Recarregar com Ctrl+Shift+R\n' +
      '- Desabilitar extensões do navegador\n' +
      '- Tentar em outro navegador');
  }
}

// Aguardar que o DOM esteja pronto E os scripts do Firebase carreguem
function aguardarEIniciar(tentativas = 0) {
  if (tentativas > 50) { // 5 segundos
    console.error('❌ Timeout: Firebase não carregou após 5 segundos');
    alert('❌ Erro: Firebase não carregou!\n\nVerifique sua conexão com internet e tente recarregar a página.');
    return;
  }

  if (document.readyState === 'loading') {
    // DOM ainda está carregando, aguarde
    setTimeout(() => aguardarEIniciar(tentativas + 1), 100);
    return;
  }

  if (typeof firebase !== 'undefined' && firebase.initializeApp) {
    // Firebase foi carregado, inicializar agora
    iniciarAplicacao();
    return;
  }

  // Ainda não está pronto, tentar novamente
  console.log('⏳ Aguardando Firebase... tentativa', tentativas);
  setTimeout(() => aguardarEIniciar(tentativas + 1), 100);
}

function carregarDados() {
  if (!db || !firebaseReady) {
    console.warn('⚠️ Firebase não está pronto, usando localStorage como fallback');
    // Carregar do localStorage como backup
    dados = JSON.parse(localStorage.getItem('manutencao')) || [];
    render();
    return;
  }
  
  const caminho = 'usuarios/' + usuarioId + '/manutencoes';
  console.log('📡 Carregando dados de:', caminho);
  
  db.ref(caminho).on('value', (snapshot) => {
    dados = snapshot.val() || [];
    console.log('📥 Dados carregados do Firebase:', dados.length > 0 ? dados.length + ' itens' : 'Nenhum item');
    
    // Também salvar no localStorage como backup
    localStorage.setItem('manutencao', JSON.stringify(dados));
    
    render();
  }, (erro) => {
    console.error('❌ Erro ao carregar dados do Firebase:', erro);
    // Se Firebase falhar, tentar localStorage
    dados = JSON.parse(localStorage.getItem('manutencao')) || [];
    render();
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
    
    // Tentar salvar no Firebase primeiro
    if (firebaseReady && db) {
      const caminho = 'usuarios/' + usuarioId + '/manutencoes/' + novoItem.id;
      console.log('💾 Salvando no Firebase:', caminho);
      
      db.ref(caminho).set(novoItem)
        .then(() => {
          console.log('✅ Item salvo no Firebase!', novoItem.id);
          limparFormulario();
          alert('✅ Item adicionado com sucesso!');
        })
        .catch((erro) => {
          console.error('❌ Erro ao salvar no Firebase:', erro.message);
          // Tentar fallback localStorage
          salvarNoLocalStorage(novoItem);
        });
    } else {
      // Firebase não disponível, usar localStorage
      console.log('⚠️ Firebase não disponível, salvando no localStorage');
      salvarNoLocalStorage(novoItem);
    }
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

function salvarNoLocalStorage(novoItem) {
  try {
    dados.push(novoItem);
    localStorage.setItem('manutencao', JSON.stringify(dados));
    console.log('✅ Item salvo no localStorage!');
    limparFormulario();
    alert('✅ Item adicionado com sucesso!\n\n(Salvo localmente - Firebase não disponível)');
    render();
  } catch (erro) {
    console.error('❌ Erro ao salvar no localStorage:', erro);
    alert('❌ Erro ao salvar item: ' + erro.message);
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
  if (!item) {
    console.error('Item não encontrado:', id);
    return;
  }

  item.status = v;
  item.historico.push(`Status alterado para ${v} em ${new Date().toLocaleString()}`);

  // Tentar salvar no Firebase
  if (firebaseReady && db) {
    db.ref('usuarios/' + usuarioId + '/manutencoes/' + id).set(item)
      .catch((erro) => {
        console.error('❌ Erro ao atualizar no Firebase:', erro.message);
        // Fallback: salvar no localStorage
        localStorage.setItem('manutencao', JSON.stringify(dados));
      });
  } else {
    // Firebase não disponível, usar localStorage
    localStorage.setItem('manutencao', JSON.stringify(dados));
  }
  
  render();
}

function excluir(id) {
  if (!confirm('Excluir item?')) return;

  // Tentar deletar no Firebase
  if (firebaseReady && db) {
    db.ref('usuarios/' + usuarioId + '/manutencoes/' + id).remove()
      .then(() => {
        console.log('✅ Item deletado do Firebase');
      })
      .catch((erro) => {
        console.error('❌ Erro ao deletar do Firebase:', erro.message);
        // Fallback: deletar do localStorage
        dados = dados.filter(d => d.id !== parseInt(id));
        localStorage.setItem('manutencao', JSON.stringify(dados));
      });
  } else {
    // Firebase não disponível, usar localStorage
    dados = dados.filter(d => d.id !== parseInt(id));
    localStorage.setItem('manutencao', JSON.stringify(dados));
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

// Inicializar a aplicação ao carregar
console.log('📜 Script carregado');
console.log('📍 document.readyState:', document.readyState);

if (document.readyState === 'loading') {
  // DOM ainda está carregando, esperar pelo evento
  document.addEventListener('DOMContentLoaded', () => {
    console.log('✅ DOMContentLoaded disparado');
    aguardarEIniciar();
  });
} else {
  // DOM já está carregado
  console.log('✅ DOM já carregado');
  aguardarEIniciar();
}
