let dados = [];
let tema = localStorage.getItem('tema') || 'light';
let usuarioId = localStorage.getItem('usuarioId');
let db = null;

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

// Inicializar Firebase
function initFirebase() {
  try {
    if (!firebase.apps.length) {
      firebase.initializeApp(firebaseConfig);
      db = firebase.database();
      console.log('✅ Firebase inicializado com sucesso!');
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
    console.error('❌ Erro ao inicializar Firebase:', erro);
    alert('⚠️ Erro ao conectar com Firebase!\n\nVerifique:\n1. As credenciais estão corretas em script.js?\n2. O Realtime Database está ativado?');
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
  if (!db) {
    alert('❌ Erro: Banco de dados não conectado!\n\nVerifique as credenciais do Firebase em script.js');
    console.error('db é null!');
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
    
    // Salvar no Firebase
    db.ref('usuarios/' + usuarioId + '/manutencoes/' + novoItem.id).set(novoItem)
      .then(() => {
        console.log('✅ Item salvo com sucesso!', novoItem.id);
        limparFormulario();
        alert('✅ Item adicionado com sucesso!');
      })
      .catch((erro) => {
        console.error('❌ Erro ao salvar item:', erro);
        alert('❌ Erro ao salvar item:\n' + erro.message);
      });
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
  if (item) {
    item.status = v;
    item.historico.push(`Status alterado para ${v} em ${new Date().toLocaleString()}`);
    db.ref('usuarios/' + usuarioId + '/manutencoes/' + id).set(item);
  }
}

function excluir(id) {
  if (confirm('Excluir item?')) {
    db.ref('usuarios/' + usuarioId + '/manutencoes/' + id).remove();
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
