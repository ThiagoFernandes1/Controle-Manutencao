# 🔧 Controle de Manutenção

Um sistema web simples e intuitivo para gerenciar e controlar atividades de manutenção em sua organização, com **sincronização em nuvem via Firebase**.

## ✨ Novidade: Banco de Dados em Nuvem

Agora todos os seus dados são sincronizados em tempo real na nuvem! Isso significa:
- ✅ Acesse de qualquer dispositivo
- ✅ Dados sincronizam automaticamente
- ✅ Nunca perca seus dados
- ✅ Funciona offline (com sincronização quando voltar online)

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

### Configuração Inicial (Primeira Vez)

1. **Configure o Firebase** - Siga o guia em [FIREBASE_SETUP.md](FIREBASE_SETUP.md)
2. Abra o arquivo `index.html` em um navegador web

### Usando a Aplicação

1. Preencha os dados do novo item no formulário:
   - **Item**: Nome ou descrição
   - **Sala/Andar**: Localização
   - **Categoria**: Escolha uma categoria
   - **Status**: Defina o status inicial
   - **Prioridade**: Nível de urgência
   - **SLA**: Data limite para conclusão
   - **Foto**: Anexe uma imagem (opcional)
2. Clique em **Salvar** para adicionar o item
3. Use a tabela para:
   - Mudar o status dos itens
   - Ver histórico de alterações
   - Excluir itens (com confirmação)
4. Filtre por categoria usando o seletor no topo da tabela

### Acessar em Outro Dispositivo

1. Abra o mesmo arquivo `index.html` em outro navegador/dispositivo
2. **Os dados aparecem automaticamente!** (desde que o Firebase esteja configurado)
3. Qualquer mudança feita em um dispositivo aparece em tempo real nos outros

## 🛠️ Tecnologias Utilizadas

- **HTML5**: Estrutura da aplicação
- **CSS3**: Estilos e tema (variáveis CSS para alternância de temas)
- **Bootstrap 5.3.2**: Framework CSS para layout responsivo
- **Chart.js**: Gráficos de status
- **JavaScript**: Lógica da aplicação
- **Firebase Realtime Database**: Armazenamento e sincronização de dados em nuvem

## 📊 Dashboard

O dashboard exibe em tempo real:
- **Feito**: Itens concluídos
- **Em andamento**: Itens em processo
- **Concluídos**: Itens completados
- **SLA vencido**: Itens com prazo expirado (não concluídos)

## 💾 Armazenamento de Dados

Com **Firebase**, todos os dados são armazenados na nuvem:
- ✅ Sincronização em tempo real
- ✅ Acessível de qualquer dispositivo
- ✅ Backup automático
- ✅ Persistência garantida
- ✅ Escalável para múltiplos usuários

**Nota**: Fotos são convertidas para base64, o que pode ocupar espaço. Para produção, considere usar Firebase Storage.

## 📱 Responsividade

A aplicação é totalmente responsiva e funciona em:
- Desktops
- Tablets
- Smartphones

## 🎨 Tema

Clique no botão **🌙 Tema** para alternar entre tema claro e escuro. Sua preferência será salva.

## ⚠️ Limitações & Próximos Passos

**Versão Atual:**
- ✅ Banco de dados em nuvem
- ✅ Sincronização entre dispositivos
- ⏳ Sem autenticação formal (identificação por ID único)
- ⏳ Sem controle de acesso por usuário

**Para Produção Avançada:**
- Implementar autenticação (Gmail, Email)
- Adicionar controle de permissões
- Usar Firebase Storage para fotos
- Implementar backup e recuperação
- Adicionar relatórios em PDF

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
