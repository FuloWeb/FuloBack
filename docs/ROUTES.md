# Routes

- Rota pública — sem middleware
- Rota autenticada — só ``authMiddleware`` (verifica se o token é válido)
- Rota de admin — ``authMiddleware`` + ``authorizationAdmin`` (autenticado e com role ADMIN)

## Usos

## Uso no router principal

```ts
router.use("/users", userRoutes);
```

## Exemplos por tipo de rota

### Pública
Qualquer um pode acessar, sem token.

```ts
userRouter.get("/", asyncHandler(async (req, res) => {
  return res.status(200).json({ data: [] });
}));
```

### Autenticada
Requer session válido. O middleware rejeita com `401` se ausente ou inválido.

```ts
userRouter.get("/:id", authMiddleware, asyncHandler(async (req, res) => {
  const { id } = idSchema.parse(req.params);
  return res.status(200).json({ data: { id } });
}));
```

### Admin
Requer token válido **e** role `ADMIN`. Retorna `403` se autenticado mas sem permissão.

```ts
userRouter.delete("/:id", authMiddleware, authorizationAdmin, asyncHandler(async (req, res) => {
  const { id } = idSchema.parse(req.params);
  return res.status(204).send();
}));
```

## Tabela de rotas — Users

| Método | Rota        | Proteção            | Descrição           |
|--------|-------------|---------------------|---------------------|
| GET    | /users      | pública             | Lista usuários      |
| GET    | /users/:id  | autenticada         | Busca por ID        |
| POST   | /users      | pública             | Cria usuário        |
| PUT    | /users/:id  | autenticada         | Atualiza usuário    |
| DELETE | /users/:id  | admin               | Remove usuário      |