import { initializeApp } from "https://www.gstatic.com/firebasejs/12.9.0/firebase-app.js";
import { getDatabase, ref, onValue, set as dbSet, remove as dbRemove } from "https://www.gstatic.com/firebasejs/12.9.0/firebase-database.js";

let dados = [];
let tema = localStorage.getItem('tema') || 'light';
let usuarioId = 'usuario-global'; // ID fixo para sincronizar entre dispositivos
let db = null;
let firebaseReady = false;

// Salvar usuarioId se novo
localStorage.setItem('usuarioId', usuarioId);

// Firebase Configuration (novo app fornecido)
const firebaseConfig = {
  apiKey: "AIzaSyA_TEcwMAv-5QpwLnVr7W5HjP3yehRthrs",
  authDomain: "manutencao-app-3a54c.firebaseapp.com",
  projectId: "manutencao-app-3a54c",
  storageBucket: "manutencao-app-3a54c.firebasestorage.app",
  messagingSenderId: "204232793923",
  appId: "1:204232793923:web:45c76377ffcd4c222259f6"
};

// Tentar inicializar Firebase se disponível (sem erros)
function inicializarFirebaseSeDisponivel() {
  console.log('🔧 Tentando inicializar Firebase (modular)...');
  try {
    // Inicializar app modular
    const app = initializeApp(firebaseConfig);
    db = getDatabase(app);
    firebaseReady = true;
    console.log('✅ Firebase ATIVADO! Usuário ID:', usuarioId);
    console.log('🗄️ Base de dados pronta para sincronizar');
    sincronizarComFirebase();
  } catch (erro) {
    console.log('⚠️ Erro ao inicializar Firebase modular:', erro.message);
  }
}

function sincronizarComFirebase() {
  if (!firebaseReady || !db) return;
  
  try {
    const caminho = 'usuarios/' + usuarioId + '/manutencoes';
    console.log('📡 Sincronizando com Firebase:', caminho);
    
    // Sincronizar: carregar dados do Firebase em tempo real usando modular API
    const caminhoRef = ref(db, caminho);
    onValue(caminhoRef, (snapshot) => {
      const dadosFirebase = snapshot.val();
      if (dadosFirebase) {
        const itemCount = Array.isArray(dadosFirebase) ? dadosFirebase.length : Object.keys(dadosFirebase).length;
        console.log('📥 Dados do Firebase:', itemCount, 'itens');

        if (!Array.isArray(dadosFirebase)) {
          dados = Object.values(dadosFirebase);
        } else {
          dados = dadosFirebase;
        }
      } else {
        console.log('📥 Firebase vazio - nenhum dado');
        dados = [];
      }
      localStorage.setItem('manutencao', JSON.stringify(dados));
      console.log('✅ Dados sincronizados do Firebase');
      render();
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
      
      dbSet(ref(db, caminho), novoItem)
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
    dbSet(ref(db, 'usuarios/' + usuarioId + '/manutencoes/' + id), item).catch(() => {});
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
    dbRemove(ref(db, 'usuarios/' + usuarioId + '/manutencoes/' + id)).catch(() => {});
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

// Bind globals so HTML inline handlers work when script is a module
function bindGlobals() {
  const ids = ['nome','local','categoria','status','prioridade','sla','foto','lista','listaHistorico','grafico','feito','andamento','concluidos','slaVencido'];
  ids.forEach(id => {
    const el = document.getElementById(id);
    if (el) window[id] = el;
  });

  // Expose functions used by inline handlers
  window.addItem = addItem;
  window.toggleTema = toggleTema;
  window.alterarStatus = alterarStatus;
  window.excluir = excluir;
  window.verHistorico = verHistorico;
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', bindGlobals); else bindGlobals();
