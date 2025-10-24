# 🎬 Awards API

Uma API **NestJS** que importa dados de `Movielist.csv` para um banco **SQLite** ao iniciar a aplicação, para possibilitar a leitura da lista de indicados e vencedores da
categoria **Pior Filme** do Golden Raspberry Awards.

---

## 📂 Arquivos relevantes

- `Movielist.csv` — CSV importado na inicialização.
- `src/modules/nominees/nominees.module.ts` - Carregamento do arquivo `Movielist.csv` e importado no banco de dados.
- `src/modules/nominees/nominees.service.ts` - Regra de negócio que calcula os produtores com os maiores e menores intervalos entre prêmios.

---

## ⚙️ Requisitos

- Node >= 20
- npm
- (Opcional) Docker & Docker Compose

---

## 🚀 Rodando localmente (sem Docker)

1. Instale dependências:

```bash
npm install
```

2. Inicie a aplicação:

```bash
npm run start
```

## 🐋 Rodando com Docker

1. Build das imagens:

```bash
docker compose build
```

2. Subir apenas a aplicação:

```bash
docker compose up app
```

> A API ficará disponível em http://localhost:3000 e o Swagger em http://localhost:3000/api.

---

## 🧪 Executando testes e2e

- Local (sem Docker):

```bash
npm run test:e2e
```

- Com Docker (usa o serviço `spec` do compose):

```bash
docker compose up spec
```

---

## 🗺️ Endpoints (nominees)

Abaixo os endpoints definidos em `src/modules/nominees/nominees.controller.ts`.
Os exemplos usam `http://localhost:3000` como base.

1. GET /nominees/awards-intervals

   - Rota principal — retorna produtores com os maiores e menores intervalos entre prêmios.
   - Exemplo:
     ```bash
     curl http://localhost:3000/nominees/awards-intervals
     ```
   - Resposta:
     ```json
     {
       "min": [
         {
           "producer": "Produtor A",
           "interval": 1,
           "previousWin": 2001,
           "followingWin": 2002
         }
       ],
       "max": [
         {
           "producer": "Produtor B",
           "interval": 10,
           "previousWin": 1990,
           "followingWin": 2000
         }
       ]
     }
     ```

2. GET /nominees/:id

   - Busca um nominee por id.
   - Exemplo:
     ```bash
     curl http://localhost:3000/nominees/123
     ```

3. DELETE /nominees/:id

   - Soft delete de um nominee por id.
   - Exemplo:
     ```bash
     curl -X DELETE http://localhost:3000/nominees/123
     ```

4. PUT /nominees/:id

   - Atualiza um nominee por id.
   - Exemplo:
     ```bash
     curl -X PUT http://localhost:3000/nominees/123 \
       -H "Content-Type: application/json" \
       -d '{"producer":"Novo Produtor","title":"Novo Título"}'
     ```

5. GET /nominees
   - Lista nominees paginados.
   - Exemplo:
     ```bash
     curl "http://localhost:3000/nominees?page=1&limit=20"
     ```

---

## 🗒️ Observações

- O banco usado é SQLite em memória, conforme definido no desafio.
- Para testar a aplicação com outra base de dados, basta trocar o arquivo `Movielist.csv` por outro de sua preferência.
- As tabelas do banco de dados são criadas no momento em que o projeto sobe, dado pela configuração `synchronize: true`, no arquivo `src/app.module.ts` evitando a necessidade de arquivos de migrations (evitar uso em ambientes de produção).
