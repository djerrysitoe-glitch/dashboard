# Acolher

Aplicação React de atendimento psicológico com formulário de agendamento persistido no Supabase.

## Configurar o Supabase

1. Crie um projeto em [supabase.com](https://supabase.com).
2. Abra o SQL Editor e execute o conteúdo de `supabase-schema.sql`.
3. Em **Project Settings > API**, copie a URL do projeto e a chave `anon`.
4. Copie `.env.example` para `.env.local` e preencha `VITE_SUPABASE_URL` e `VITE_SUPABASE_PUBLISHABLE_KEY`.
5. Instale as dependências e rode o projeto:

	```bash
	npm install
	npm run dev
	```

6. Na Vercel, configure as mesmas variáveis em **Project Settings > Environment Variables**. O framework será detectado como Vite; o comando de build é `npm run build` e a pasta de saída é `dist`.

O formulário React grava em `public.appointments`. A chave publishable pode ficar no frontend; as políticas RLS impedem leitura pública dos agendamentos. A equipe deve acessar os dados usando uma sessão autenticada com a claim `role=staff`.