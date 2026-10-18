begin;

create type public.news_collection_method as enum ('rss','scraping','manual','referencia');
create type public.news_classification_origin as enum ('tabela','inferida');

create table public.news_objectives (
  slug text primary key check (slug ~ '^[a-z0-9_]+$'),
  label text not null,
  description text not null default '',
  original_names text[] not null default '{}',
  created_at timestamptz not null default now()
);

alter table public.news_sources
  alter column feed_url drop not null,
  add column slug text,
  add column collection_method public.news_collection_method not null default 'rss',
  add column source_type text check (source_type in ('veiculo_especializado','jornal_generalista','jornal_economico','jornal_regional','agencia_noticias','orgao_oficial','instituicao_cientifica','fomento','organizacao_internacional','think_tank','consultoria_dados','associacao_evento')),
  add column scope text not null default '',
  add column reliability smallint check (reliability between 1 and 4),
  add column priority smallint check (priority between 1 and 4),
  add column region_priority_uf char(2) check (region_priority_uf ~ '^[A-Z]{2}$'),
  add column region_priority smallint check (region_priority between 1 and 4),
  add column categories public.news_category[] not null default '{}',
  add column origin text[] not null default '{}',
  add column best_use text not null default '',
  add constraint news_sources_region_priority_pair check ((region_priority_uf is null) = (region_priority is null)),
  add constraint news_sources_rss_feed check (collection_method <> 'rss' or feed_url is not null);

update public.news_sources set site_url = rtrim(site_url, '/');
update public.news_sources set slug = case site_url
  when 'https://www.mining.com' then 'mining-com'
  when 'https://im-mining.com' then 'international-mining'
  when 'https://www.mining-technology.com' then 'mining-technology'
  else 'fonte-' || left(id::text, 8) end;
alter table public.news_sources
  alter column slug set not null,
  add constraint news_sources_slug_key unique (slug),
  add constraint news_sources_slug_format check (slug ~ '^[a-z0-9-]+$');

create table public.news_source_objectives (
  source_id uuid not null references public.news_sources(id) on delete cascade,
  objective_slug text not null references public.news_objectives(slug) on update cascade on delete restrict,
  classification_origin public.news_classification_origin not null,
  primary key (source_id, objective_slug)
);
create index news_source_objectives_objective_idx on public.news_source_objectives(objective_slug);

alter table public.news_objectives enable row level security;
alter table public.news_source_objectives enable row level security;
create policy "public news objectives read" on public.news_objectives for select using (true);
create policy "admin news objectives write" on public.news_objectives for all using (public.is_admin()) with check (public.is_admin());
create policy "editors news source objectives read" on public.news_source_objectives for select using (public.is_editor());
create policy "admin news source objectives write" on public.news_source_objectives for all using (public.is_admin()) with check (public.is_admin());

commit;
