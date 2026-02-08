# 🔧 Controle de Manutenção

Um sistema web simples e intuitivo para gerenciar e controlar atividades de manutenção em sua organização.

## 📋 Funcionalidades

- **Dashboard com Estatísticas**: Visualização rápida de itens feitos, em andamento, concluídos e com SLA vencido
- **Cadastro de Itens**: Adicionar novos itens de manutenção com detalhes completos
- **Categorização**: Organize por categorias (Ar-condicionado, Cadeira, Som, Telhado, Porta, Produto de limpeza)
- **Rastreamento de Status**: Marque itens como "Feito", "Em andamento" ou "Concluído"
- **Priorização**: Defina prioridade (Baixa, Média, Alta) para cada item
- **SLA Manager**: Controle de prazos com alerta de vencimento
- **Galeria de Fotos**: Anexe fotos dos itens para referência visual
- **Histórico**: Rastreie todas as alterações feitas em cada item
- **Filtro por Categoria**: Filtre rapidamente os itens que deseja visualizar
- **Gráfico de Status**: Visualize a distribuição dos itens por status
- **Tema Claro/Escuro**: Alterne entre tema claro e escuro conforme sua preferência
- **Armazenamento Local**: Dados salvos automaticamente no navegador (localStorage)

## 🚀 Como Usar

1. Abra o arquivo `index.html` em um navegador web
2. Preencha os dados do novo item no formulário:
   - **Item**: Nome ou descrição
   - **Sala/Andar**: Localização
   - **Categoria**: Escolha uma categoria
   - **Status**: Defina o status inicial
   - **Prioridade**: Nível de urgência
   - **SLA**: Data limite para conclusão
   - **Foto**: Anexe uma imagem (opcional)
3. Clique em **Salvar** para adicionar o item
4. Use a tabela para:
   - Mudar o status dos itens
   - Ver histórico de alterações
   - Excluir itens (com confirmação)
5. Filtre por categoria usando o seletor no topo da tabela

## 🛠️ Tecnologias Utilizadas

- **HTML5**: Estrutura da aplicação
- **CSS3**: Estilos e tema (variáveis CSS para alternância de temas)
- **Bootstrap 5.3.2**: Framework CSS para layout responsivo
- **Chart.js**: Gráficos de status
- **JavaScript**: Lógica da aplicação
- **localStorage**: Armazenamento de dados persistente

## 📊 Dashboard

O dashboard exibe em tempo real:
- **Feito**: Itens concluídos
- **Em andamento**: Itens em processo
- **Concluídos**: Itens completados
- **SLA vencido**: Itens com prazo expirado (não concluídos)

## 💾 Armazenamento de Dados

Todos os dados são armazenados localmente no navegador usando `localStorage`, o que significa que:
- Os dados persistem mesmo após fechar o navegador
- Os dados são específicos do computador e navegador
- Limpar o cache do navegador pode resultar em perda de dados

## 📱 Responsividade

A aplicação é totalmente responsiva e funciona em:
- Desktops
- Tablets
- Smartphones

## 🎨 Tema

Clique no botão **🌙 Tema** para alternar entre tema claro e escuro. Sua preferência será salva.

## ⚠️ Limitações

- Dados armazenados apenas localmente (sem sincronização em nuvem)
- Fotos são convertidas para base64 (pode ocupar espaço no navegador)
- Sem suporte para múltiplos usuários
- Sem backup automático

## 📝 Exemplo de Estrutura de Dados

Cada item contém:
```json
{
  "nome": "Ar-condicionado quebrado",
  "local": "Sala 101",
  "categoria": "Ar-condicionado",
  "status": "Em andamento",
  "prioridade": "Alta",
  "sla": "2026-02-15",
  "foto": "data:image/jpeg;base64,...",
  "historico": [
    "Criado em 08/02/2026 14:30:00",
    "Status alterado para Em andamento em 08/02/2026 14:35:00"
  ]
}
```

## 📄 Licença

Este projeto é de uso livre.

## 👨‍💻 Autor

Criado por Thiago Fernandes

---

**Dicas de Uso:**
- Sempre defina uma data SLA para ter um controle melhor de prazos
- Use prioridades para organizar melhor o trabalho
- Regularmente verifique o histórico para auditar mudanças
- Categorize corretamente para facilitar filtros e buscas
