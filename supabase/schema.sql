create table if not exists usage_logs (
  id bigint generated always as identity primary key,
  user_id text not null,
  usage_date date not null,
  task_type text not null check (task_type in ('expression_query', 'pattern_drilling', 'context_practice', 'verb_conjugation')),
  tokens_input integer not null default 0,
  tokens_output integer not null default 0,
  tokens_total integer not null default 0,
  request_payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists idx_usage_logs_user_date
  on usage_logs (user_id, usage_date);
