# 🔧 Guia de Troubleshooting - Firebase

Se você está recebendo o erro **"Erro ao conectar com Firebase"**, siga este guia passo a passo.

## 1️⃣ Abrir Console do Navegador para Ver Detalhes

Quando o erro aparecer:

1. Pressione **F12** (ou Ctrl+Shift+I)
2. Clique na aba **"Console"**
3. Você verá mensagens como:
   ```
   ✅ Firebase carregado com sucesso!
   🔥 Iniciando Firebase com configuração...
   projectId: manutencao-app-cb0d5
   databaseURL: https://manutencao-app-cb0d5-default-rtdb.firebaseio.com
   ✅ Firebase inicializado com sucesso!
   ```

## 2️⃣ Verificar Credenciais do Firebase

1. Abra [Firebase Console](https://console.firebase.google.com/)
2. Clique no seu projeto **manutencao-app-cb0d5**
3. Clique em **⚙️ Configurações do Projeto** (engrenagem)
4. Vá para **"Seus Apps"**
5. Procure o seu app web
6. Copie o objeto `firebaseConfig`
7. Abra `script.js` (linhas 10-18)
8. **Compara se os valores são idênticos**

Se houver diferença, substitua!

## 3️⃣ Verificar se Realtime Database Está Ativo

1. No Firebase Console
2. Clique em **"Realtime Database"** (menu esquerdo)
3. Verifique se você vê:
   - ✅ Uma URL azul (ex: `https://manutencao-app-cb0d5-default-rtdb.firebaseio.com/`)
   - ✅ Uma aba chamada **"Data"**
   - ✅ Uma aba chamada **"Regras"**

Se não estiver ativo:
1. Clique em **"Criar Banco de Dados"**
2. Escolha a região
3. Selecione **"Iniciar em modo de teste"**
4. Clique **"Ativar"**

## 4️⃣ Verificar Regras de Segurança

1. No Realtime Database, clique em **"Regras"**
2. Você deve ter:

```json
{
  "rules": {
    "usuarios": {
      "$uid": {
        ".read": true,
        ".write": true,
        "manutencoes": {
          ".indexOn": ["dataCriacao"]
        }
      }
    }
  }
}
```

Se não tiver, **substitua tudo** e clique **"Publicar"**

## 5️⃣ Verificar Scripts do Firebase no HTML

Abra `index.html` e procure por:

```html
<!-- Firebase -->
<script src="https://www.gstatic.com/firebasejs/10.5.0/firebase-app.js"></script>
<script src="https://www.gstatic.com/firebasejs/10.5.0/firebase-database.js"></script>
```

Se não estiver, **adicione** antes de `<link rel="stylesheet" href="style.css">`

## 6️⃣ Problemas no GitHub Pages

Se está usando `thiagofernandes1.github.io`, pode haver problemas de HTTPS/CORS:

**Solução 1: Fazer Push dos Arquivos**
```bash
git add .
git commit -m "Update Firebase"
git push
```

Aguarde 1-2 minutos para as mudanças refletirem.

**Solução 2: Limpar Cache**
- Abra a página em **modo incógnito** (Ctrl+Shift+N no Chrome)
- Ou pressione **Ctrl+Shift+Delete** para limpar cache

**Solução 3: Forçar Atualizar**
- Pressione **Ctrl+Shift+R** (força atualização sem cache)

## 7️⃣ Testes para Confirmar que Funciona

### Teste 1: Verificar se Firebase Carregou
1. Abra Console (F12)
2. Procure por: `✅ Firebase inicializado com sucesso!`
3. Se não aparecer, há erro no carregamento

### Teste 2: Adicionar um Item
1. Preencha os campos
2. Clique em "Salvar"
3. Procure no Console por: `✅ Item salvo com sucesso!`
4. Se houver erro, ele aparecerá em vermelho

### Teste 3: Verificar no Firebase Console
1. Vá para Firebase Console
2. Clique em **Realtime Database** > **Data**
3. Expanda **usuarios** > seu ID > **manutencoes**
4. Você deve ver seu item ali!

## 🆘 Erros Comuns e Soluções

| Erro | Causa | Solução |
|------|-------|---------|
| `❌ Firebase não carregou após 3 segundos` | Scripts do Firebase não carregaram | Verifique conexão de internet, atualize a página |
| `Permission denied` | Regras de segurança incorretas | Volte ao passo 4️⃣ e substitua as regras |
| `❌ Banco de dados não inicializado` | Firebase não pronto | Aguarde mais tempo antes de usar |
| `undefined is not a function` | Firebase não carregou | Recarregue a página (F5) |

## 💡 Debug Avançado

1. Abra Console (F12)
2. Digite: `firebase.apps`
3. Você deve ver um array com 1 item (sua app Firebase)

4. Digite: `db`
5. Você deve ver um objeto com `_database`

Se ver `null` ou `undefined`, Firebase não inicializou!

## 📞 Checklist Final

- [ ] Credenciais estão corretas em `script.js`
- [ ] Realtime Database está **ativo** (status azul)
- [ ] Regras de segurança foram **publicadas**
- [ ] Scripts do Firebase estão no `index.html`
- [ ] Firefox/Chrome está **atualizado**
- [ ] Página foi **recarregada com Ctrl+Shift+R**
- [ ] Console mostra `✅ Firebase inicializado com sucesso!`

## 🚀 Próximas Tentativas

1. Recarregue: **Ctrl+Shift+R**
2. Feche e abra novamente
3. Tente em outro navegador
4. Tente no celular com outro dispositivo
5. Se mesmo assim não funcionar, verifique todos os passos acima

---

**Ainda não funcionou?** Vá ao Console (F12) e copie a **mensagem de erro exata** para debugar melhor!
