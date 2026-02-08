let dados = JSON.parse(localStorage.getItem('manutencao')) || [];
let tema = localStorage.getItem('tema') || 'light';

if (tema === 'dark') {
  document.body.classList.add('dark');
}

function toggleTema() {
  document.body.classList.toggle('dark');
  localStorage.setItem('tema', document.body.classList.contains('dark') ? 'dark' : 'light');
}

function addItem() {
  const file = foto.files[0];
  const reader = new FileReader();
  
  reader.onload = () => {
    dados.push({
      nome: nome.value,
      local: local.value,
      categoria: categoria.value,
      status: status.value,
      prioridade: prioridade.value,
      sla: sla.value,
      foto: reader.result || null,
      historico: [`Criado em ${new Date().toLocaleString()}`]
    });
    salvar();
    limparFormulario();
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

function alterarStatus(i, v) {
  dados[i].status = v;
  dados[i].historico.push(`Status alterado para ${v} em ${new Date().toLocaleString()}`);
  salvar();
}

function excluir(i) {
  if (confirm('Excluir item?')) {
    dados.splice(i, 1);
    salvar();
  }
}

function verHistorico(i) {
  listaHistorico.innerHTML = '';
  dados[i].historico.forEach(h => {
    listaHistorico.innerHTML += `<li>${h}</li>`;
  });
  new bootstrap.Modal(modalHistorico).show();
}

function salvar() {
  localStorage.setItem('manutencao', JSON.stringify(dados));
  render();
}

function render() {
  lista.innerHTML = '';
  let f = 0, a = 0, c = 0, slaV = 0;
  const hoje = new Date().toISOString().split('T')[0];
  const filtro = filtroCategoria.value;

  dados.forEach((d, i) => {
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
          <select class="form-select form-select-sm" onchange="alterarStatus(${i}, this.value)">
            <option ${d.status === 'Feito' ? 'selected' : ''}>Feito</option>
            <option ${d.status === 'Em andamento' ? 'selected' : ''}>Em andamento</option>
            <option ${d.status === 'Concluído' ? 'selected' : ''}>Concluído</option>
          </select>
        </td>
        <td>${d.prioridade}</td>
        <td>${d.sla || '-'}</td>
        <td>
          <button class="btn btn-sm btn-info" onclick="verHistorico(${i})">Histórico</button>
          <button class="btn btn-sm btn-danger" onclick="excluir(${i})">Excluir</button>
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
  render();
});
