# 🥖 Pão FresQUIM — Sistema de Gestão de Padaria

Sistema web acadêmico para gestão de padaria, desenvolvido com **Spring Boot** (backend) e **Next.js** (frontend), com banco de dados **Supabase (PostgreSQL)**.

---

## ✅ Requisitos obrigatórios

Antes de rodar o projeto, instale exatamente as versões abaixo. Versões diferentes **podem causar erros de incompatibilidade**.

---

### ☕ Java 21 (JDK)

- **Versão:** 21 (LTS)
- **Download:** https://adoptium.net/temurin/releases/?version=21

Após instalar, verifique no terminal:

```bash
java -version
```

Deve aparecer:

```text
openjdk version "21.x.x"
```

> ⚠️ **Não use Java 17, 22, 23 ou 25.**  
> O projeto foi configurado para Java 21.

---

### 🔧 Maven 3.9+

- **Download:** https://maven.apache.org/download.cgi → "Binary zip archive"
- Extraia em uma pasta (ex: `C:\maven`) e adicione `C:\maven\bin` ao PATH do sistema

Verifique:

```bash
mvn -version
```

Deve aparecer:

```text
Apache Maven 3.9.x
```

---

### 🟢 Node.js 20 LTS

- **Versão:** 20 (LTS)
- **Download:** https://nodejs.org/en/download

Após instalar, verifique:

```bash
node -v
npm -v
```

Deve aparecer algo como:

```text
v20.x.x
10.x.x
```

> ⚠️ **Não use Node.js 16 ou 18.**  
> O Next.js 15 requer Node 20+.

---

# ⚙️ Configuração do ambiente

Como o projeto lida com dados sensíveis, você precisa configurar os ambientes do frontend e do backend localmente.

---

## 1. Configure o Frontend (Next.js)

Atualmente o frontend não necessita de configuração de variáveis de ambiente para rodar localmente.

Basta iniciar o projeto normalmente utilizando os comandos descritos abaixo.

---

## 2. Configure o Backend (Spring Boot + Supabase)

Por questões de segurança, as credenciais do banco de dados não ficam no código.

### Passos

1. Na pasta `server/`, localize o arquivo `.env.example`
2. Faça uma cópia dele
3. Renomeie a cópia para `.env`
4. Preencha o arquivo `.env` com as credenciais da equipe:

```env
DB_URL=jdbc:postgresql://<HOST_DO_SUPABASE>:6543/postgres?sslmode=require
DB_USERNAME=postgres.<ID_DO_PROJETO>
DB_PASSWORD=<SENHA_DO_BANCO>
DB_DRIVER=org.postgresql.Driver
```

> *(Se o banco não conectar futuramente, verifique se o projeto Supabase está ativo no painel, pois projetos no plano gratuito pausam após inatividade.)*

---

# 🚀 Como rodar o projeto

## Backend (Spring Boot)

Abra um terminal na pasta `server/` e execute:

```bash
mvn spring-boot:run
```

Aguarde a mensagem indicando que a aplicação iniciou.

### Endpoints

- Backend: http://localhost:8081
- Swagger: http://localhost:8081/swagger-ui/index.html

---

## Frontend (Next.js)

Abra **outro terminal** na pasta `client/`.

### Primeira execução

```bash
npm install
npm run dev
```

### Próximas execuções

```bash
npm run dev
```

Frontend disponível em:

```text
http://localhost:3000
```

---

# 📁 Estrutura do projeto

```text
project-pao-fresquim/
├── client/                        → Frontend Next.js + Tailwind
│   ├── src/app/                   → Páginas da aplicação
│   ├── src/components/            → Componentes reutilizáveis
│   ├── services/api.js            → Configuração do Axios
│   └── services/api.js            → Configuração do Axios e integração com API
│
└── server/                        → Backend Spring Boot
    ├── src/main/java/             → Controllers, Services, Models e Repositories
    ├── pom.xml                    → Dependências Maven
    ├── .env.example               → Modelo de variáveis do banco
    └── .env                       → Credenciais locais e seguras
```

---

# 🛠️ Tecnologias utilizadas

| Camada | Tecnologia | Versão |
|---|---|---|
| Backend | Java + Spring Boot | 4.0.5 |
| ORM | Hibernate / JPA | — |
| Banco de dados | Supabase (PostgreSQL) | 17 |
| Frontend | Next.js | 15.x |
| Estilização | Tailwind CSS | 4.x |
| HTTP Client | Axios | 1.6+ |
| Documentação API | Swagger / OpenAPI | 3.0.2 |

---

# ❓ Problemas comuns

| Erro | Solução |
|---|---|
| `java -version` não reconhecido | Java não instalado ou não configurado no PATH |
| `mvn` não reconhecido | Maven não instalado ou não configurado no PATH |
| `npm` não reconhecido | Node.js não instalado |
| `FATAL: Tenant or user not found` | O arquivo `.env` não foi criado corretamente ou as credenciais estão incorretas |
| Backend falha ao iniciar | Verifique se a porta `8081` já está em uso |
| `lock file out of sync` | Execute `npm install` novamente na pasta `client/` |

---

# 👥 Equipe

Projeto acadêmico desenvolvido utilizando metodologia ágil Scrum pela equipe do **Pão FresQUIM**.

- Gabryel Henrik Gomes de Barros
- Yago Ferreira Rodrigues
- Gustavo Henrique Ferreira Santos
- Emelly Vitória Carvalho Caixeta
- Jhenmily Liliam Batista Veloso de Souza
- Gabriel Moraes Pinheiro
- Felipe Mendes Duarte Araújo
- Marconni Pires Ferreira Silva

---