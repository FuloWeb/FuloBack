# Methods

**Invoke:**
npx prisma

**Generate:**
npx prisma generate

**Migrations:**
npx prisma migrate dev --name init
npx prisma migrate dev

## Como conectar o Prisma ao Banco de Dados?

- Primeiro, precisa instalar as dependëncias do projeto com `npm install` ou `npm i` e criar um banco diretamente no pgAdmin.

- Adicionar as variáveis de ambiente com base nas configurações feitas na instalação do PostgreSQL e da criação do banco no pgAdmin (adicionar DB_URL) diretamente:

``postgres://DB_USER:DB_PASSWORD@localhost:DB_PORT/DB_NAME``

- Rodar os comandos em sequência:
npx prisma
npx prisma generate
npx prisma migrate dev

Isso deve atualizar as tabelas com base no schema.prisma para o banco real, sem valores.

## Para pequenas atualizações
- Sem alterar os valores que já foram adicionados em outras tabelas

npx prisma migrate dev --name nome_alteracao