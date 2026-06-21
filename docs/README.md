# FuloBack

Server-side da aplicação, usando Typescript primariamente, junto ao PrismaORM. 
- Descrição básica das [libs](#libs) extras.
- [Metódos e uso do Prisma](https://github.com/FuloWeb/FuloBack/blob/structure/docs/PRISMA.md) - schema.

# Como rodar o projeto

- É necessário ter o Node mais recente instalado na máquina e o PostgreSQL instalado (já vem com o PGAdmin).

1. Clone o repositório disponível no GitHub ```https://github.com/FuloWeb/FuloBack```
2. Abra o diretório do repositório em uma IDE de sua preferência
3. Utilize o comando ```npm install``` para instalar as dependências do projeto
4. Adicione o `.env` na raiz do projeto e adicione as variáveis de ambiente
    - Tem um .env.example com as possíveis variáveis e como podem ser passados os valores.
5. Gerar um prisma client com `npx prisma generate`
6. Gerar uma versão da aplicação com `npm run build`
7. Pode verificar a lista de scripts disponíveis, mas para iniciar o projeto em modo `development`, use `npm run start`.

## Rodando versões disponíveis

Com .env:

| Development | Production |
| --- | --- |
| NODE_ENV=development | NODE_ENV=production |
| npm run dev | npm run build + npm run start | 

# LIBS

express-session @types/express-session
- Cookies e persistência de dados.

zod
- Validação de dados com Typescript.

Winston
- Sistema de logging mais complexo para depuração e debug.

jsonwebtoken
- Handle signing, verifying, and decoding tokens to secure API routes

# Structure

```
src
 ┣ config
 ┃ ┗ logger.ts # Configuração do sistema de logging usando o Winston
 ┣ controllers
 ┃ ┗ .gitkeep
 ┣ database
 ┃ ┣ prisma.ts # Inicialização e export do prisma para conexão
 ┃ ┗ schema.prisma # Vinculado ao banco usando PrismaORM
 ┣ generated # Geração do cliente Prisma
 ┃ ┗ prisma
 ┣ middleware
 ┃ ┣ authMiddleware.ts
 ┃ ┗ authorizationAdmin.ts
 ┣ filter # Módulo de filtros da aplicação - ex: produtos
 ┣ models # Domínios da aplicação
 ┃ ┗ user.ts # Exemplo para usuário
 ┣ routes
 ┃ ┣ router.ts # Rotas da aplicação
 ┃ ┗ userRoutes.ts
 ┣ types
 ┃ ┗ authRequest.ts # Tipos específicos para requests, ex: Autenticação
 ┣ utils
 ┃ ┗ generateToken.ts # Geração do token JWT para sessão
 ┗ server.ts
 ```