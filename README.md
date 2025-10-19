# 🎬 Awards API

Uma API **NestJS** que importa dados de `Movielist.csv` para um banco **SQLite** ao iniciar a aplicação.

---

## 📂 Arquivos relevantes

- `Movielist.csv` — CSV importado na inicialização.
- `src/modules/nominees/nominees.module.ts` - Carregamento do arquivo `Movielist.csv` e importado no banco de dados.

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

2. Inicie em modo desenvolvimento (carrega o CSV na inicialização):

```bash
npm run start:dev
```

A API ficará disponível em http://localhost:3000 e o Swagger em http://localhost:3000/api.

## 🐋 Rodando com Docker

1. Build das imagens:

```bash
docker compose build
```

2. Subir apenas a aplicação:

```bash
docker compose up app
```

O serviço `app` expõe a porta 3000 mapeada para o host (ver `docker-compose.yml`).

## 🧪 Executando testes e2e

- Local (sem Docker):

```bash
npm run test:e2e
```

- Com Docker (usa o serviço `spec` do compose):

```bash
docker compose up spec
```

## 🗒️ Observações

- O banco usado é SQLite (arquivo como `db.sqlite`) conforme configuração do projeto.
- O CSV `Movielist.csv` é importado automaticamente na inicialização.
- Para testar a aplicação com outra base de dados, basta trocar o arquivo `Movielist.csv` por outro de sua preferência.
- As tabelas do banco de dados são criadas no momento em que o projeto sobe, dado pela configuração `synchronize: true`, no arquivo `src/app.module.ts` evitando a necessidade de arquivos de migrations (desaconselhado em ambientes de produção).
