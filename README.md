# LotoNews 

Aplicação web para acompanhamento de resultados de loterias brasileiras.

## Tecnologias

- Backend: Node.js + Express
- Frontend: React + TailwindCSS
- Database: PostgreSQL
- Containerização: Docker

## Funcionalidades

- Consulta de resultados das principais loterias:
  - Mega-Sena
  - Lotofácil
  - Quina
  - Lotomania
  - Timemania

## Instalação

### Pré-requisitos

- Docker
- Docker Compose

### Rodando o projeto

1. Clone o repositório:
```bash
git clone https://github.com/andersonnarciso/lotonews.git
cd lotonews
```

2. Inicie os containers:
```bash
docker-compose up --build
```

3. Acesse:
- Frontend: http://localhost
- API: http://localhost:3001/api/latest

## Desenvolvimento

1. Crie um branch para sua feature:
```bash
git checkout -b feature/nova-funcionalidade
```

2. Faça commit das mudanças:
```bash
git add .
git commit -m "Adiciona nova funcionalidade"
```

3. Push para o branch:
```bash
git push origin feature/nova-funcionalidade
```

## Próximos Passos

- [ ] Implementar autenticação de usuários
- [ ] Adicionar histórico de resultados
- [ ] Implementar notificações
- [ ] Adicionar estatísticas
- [ ] Melhorar UI/UX

## Licença

Este projeto está sob a licença MIT.
