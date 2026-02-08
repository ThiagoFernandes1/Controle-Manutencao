# 🔧 Guia de Configuração do Firebase

Este guia ajudará você a configurar o banco de dados Firebase para sincronizar os dados em múltiplos dispositivos.

## Por que Firebase?

O aplicativo original usava `localStorage` que armazena dados **apenas no navegador local**. Com Firebase, seus dados são sincronizados em tempo real na nuvem e acessíveis de qualquer dispositivo.

## Passo a Passo

### 1. Criar um Projeto Firebase

1. Acesse [Firebase Console](https://console.firebase.google.com/)
2. Clique em **"Adicionar Projeto"**
3. Digite um nome para o projeto (ex: `manutencao-app`)
4. Desativar Google Analytics (opcional)
5. Clique em **"Criar Projeto"**
6. Aguarde a criação completar

### 2. Obter Credenciais do Firebase

1. No Firebase Console, clique em **⚙️ Configurações do Projeto** (ícone de engrenagem)
2. Vá para a aba **"Seu Apps"**
3. Clique em **"Registre um app web"** (ícone `</>`)
4. Dê um nome ao app (ex: `Controle-Manutencao`)
5. Clique em **"Registrar app"**
6. Copie o objeto de configuração que aparecerá
7. Será similar a isto:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyDemoKey123456789",
  authDomain: "manutencao-app.firebaseapp.com",
  projectId: "manutencao-app",
  storageBucket: "manutencao-app.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef123456"
};
```

### 3. Configurar o Arquivo JavaScript

1. Abra o arquivo `script.js`
2. Procure pela seção `// Firebase Configuration`
3. Substitua o objeto `firebaseConfig` com suas credenciais reais
4. **Salve o arquivo**

### 4. Habilitar Realtime Database

1. No Firebase Console, acesse **Realtime Database** (ou Database)
2. Clique em **"Criar Banco de Dados"**
3. Escolha a **região** mais próxima de você
4. Comece em **"Modo de teste"** (desenvolver com regras abertas)
5. Clique em **"Ativar"**

### 5. Configurar Regras de Segurança (IMPORTANTE!)

1. No Firebase Realtime Database, vá para **Regras**
2. Substitua o conteúdo atual por:

```json
{
  "rules": {
    "usuarios": {
      "$uid": {
        ".read": "$uid === auth.uid",
        ".write": "$uid === auth.uid",
        "manutencoes": {
          ".indexOn": ["dataCriacao"]
        }
      }
    }
  }
}
```

3. Clique em **"Publicar"**

### 6. Testar a Aplicação

1. Abra o arquivo `index.html` em um navegador
2. Adicione um novo item de manutenção
3. Verifique o Firebase Console para confirmar que os dados aparecem em **Realtime Database**
4. Abra em outro navegador/dispositivo e veja os dados sincronizarem!

## Estrutura do Banco de Dados

Os dados são organizados assim:

```
firebase
└── usuarios/
    └── user_1234567890/
        └── manutencoes/
            ├── 1234567890
            │   ├── id: 1234567890
            │   ├── nome: "Ar-condicionado quebrado"
            │   ├── local: "Sala 101"
            │   ├── categoria: "Ar-condicionado"
            │   ├── status: "Em andamento"
            │   ├── prioridade: "Alta"
            │   ├── sla: "2026-02-15"
            │   ├── foto: "data:image/jpeg;base64;..."
            │   ├── historico: [...]
            │   └── dataCriacao: "2026-02-08T..."
            └── 1234567891
                └── ...
```

## Alternativas ao Firebase

Se preferir usar outra solução:

- **Supabase** - PostgreSQL com autenticação integrada
- **MongoDB Atlas** - Banco de dados NoSQL
- **Node.js + Express** - Seu próprio servidor
- **AWS DynamoDB** - Banco de dados em escala
- **Google Sheets API** - Simples e integrado

## Troubleshooting

### "Erro: firebase não está definido"
- Certifique-se de que os scripts do Firebase foram carregados no `index.html`
- Verifique se a internet está conectada

### "Dados não sincronizam"
- Verifique se as credenciais estão corretas no `script.js`
- Confirme que o Realtime Database está habilitado
- Verifique as regras de segurança

### "Erro ao adicionar item"
- Verifique se o Realtime Database está em "Modo de Teste"
- Verifique o console do navegador (F12 > Console)

## Dicas de Segurança

⚠️ **IMPORTANTE**: A API Key no `script.js` será visível ao público. Isso é **normal** para aplicações web. Para produção avançada:

1. Use Firebase Authentication para identificar usuários
2. Implemente regras de segurança mais restritivas
3. Considere usar um backend adicional

## Próximos Passos

1. ✅ Dados sincronizados em nuvem
2. 📱 Acesse de qualquer dispositivo
3. 🔐 Implemente autenticação (Gmail, Email, etc.)
4. 💾 Configure backup automático
5. 📊 Adicione mais filtros e relatórios

---

**Precisa de ajuda?** Verifique a [documentação oficial do Firebase](https://firebase.google.com/docs)
