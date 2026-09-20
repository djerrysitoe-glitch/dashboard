# Acolher

Site estático de atendimento psicológico com formulário de agendamento e persistência opcional no Supabase.

## Configurar o Supabase

1. Crie um projeto em [supabase.com](https://supabase.com).
2. Abra o SQL Editor e execute o conteúdo de `supabase-schema.sql`.
3. Em **Project Settings > API**, copie a URL do projeto e a chave `anon`.
4. Substitua os valores em `supabase-config.js`.
5. Publique o repositório na Vercel. Não é necessário comando de build.

O formulário grava em `public.appointments`. A chave `anon` pode ficar no frontend; as políticas RLS impedem leitura pública dos agendamentos. A equipe deve acessar os dados usando uma sessão autenticada com a claim `role=staff`.