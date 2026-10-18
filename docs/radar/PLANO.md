# Radar Mineral — plano de evolução

Decisões fechadas em sessão de *grilling* em 2026-10-18. Este documento é a especificação de referência para a implementação e para o code review de cada fase. Alterações de rumo devem atualizar este arquivo no mesmo PR.

## Estado de partida (outubro de 2026)

- 3 feeds RSS em inglês, com allowlist de domínios fixa em `lib/news-ingestion.ts`.
- Cron semanal (`vercel.json`, segunda 11:00 UTC), até 8 itens por fonte.
- Deduplicação apenas por `source_url` exata.
- A IA (OpenAI Responses) traduz, resume e classifica; itens com `relevance >= 55` são **publicados sem revisão humana**.
- Sem tela administrativa de notícias; status `pending`/`failed` nunca são gravados.
- A view `news_items_public` faz join com `news_sources`, que não tem policy de leitura pública.
- `published_at` ilegível vira "agora".
- Apenas um teste e2e de fumaça.

## Objetivo e público

- **Duas camadas.** Camada interna com tudo o que é coletado; camada pública apenas com itens aprovados por uma pessoa.
- **Público-alvo:** investidores e empresas de mineração, pesquisadores e órgãos públicos (ANM, SGB, secretarias).
- **Escopo geográfico:** Brasil, mais o mercado global quando o tema afeta o Brasil (minerais críticos, preços, cadeias de suprimento).
- **Peso regional configurável** (tabela `regional_focus`, peso por UF), com a Bahia como primeira região de peso alto.

## Idioma

- Camada pública somente em português. O schema prevê `title_en`/`summary_en`, ainda não expostos.
- Objetivos, categorias, tipos, escopo, prioridade, confiabilidade, `keywords` e `minerals` sempre em pt-BR.
- Identificadores no banco e nos CSVs são slugs pt-BR sem acento (`minerais_criticos`, `orgao_oficial`), seguindo o padrão do enum `news_category`. A interface mostra o rótulo com acento.
- Nomes de fontes permanecem originais (Reuters, Mining.com).

## Catálogo de fontes

- As planilhas de fontes brasileiras e internacionais são unificadas em um catálogo único.
- **Duplicatas** (mesma URL normalizada): prioridade = a maior; tipo e escopo = o texto mais específico; `melhor_uso` = união dos textos; a planilha de origem é registrada em `origem`. O mesmo veículo com URL raiz numa planilha e URL de tópico na outra (OCDE, Banco Mundial, Wood Mackenzie) fica como duas entradas separadas, como nas planilhas.
- **Objetivos unificados** (9): notícias do setor; preços, commodities e investimentos; minerais críticos e transição energética; geopolítica e cadeias de suprimento; dados oficiais e regulação; dados geológicos e estatísticos; tecnologia, operações e pesquisa; sustentabilidade e meio ambiente; Bahia. A divisão Brasil/global fica no campo `escopo`.
- Os nomes abreviados das tabelas de objetivo ("Reuters", "S&P Global", "OECD"…) são resolvidos por uma tabela de alias.
- **Fonte ↔ objetivo é N:N** (`news_source_objectives`). Cada vínculo registra `classificacao_origem = tabela | inferida`; fontes ausentes das tabelas de objetivo são classificadas pelo `melhor_uso` e pelo `tipo` e marcadas como `inferida` para revisão.
- **Campos por fonte:** `tipo` normalizado (valor único), `categorias[]` (as 5 categorias do radar, multivalor), `prioridade` e `confiabilidade` de 1 a 4 (Baixa=1, Média=2, Alta=3, Muito alta=4; "Média-alta" → 3), `prioridade_regiao_uf` + `prioridade_regiao` para qualificadores como "Muito alta para Bahia", e `metodo_coleta = rss | scraping | manual | referencia`.
- O RSS de cada URL é verificado de fato. Apenas fontes `rss` podem ficar ativas no cron; as demais servem de referência para o revisor checar fatos.
- **Fonte da verdade:** `data/news_sources.csv` e `data/news_objectives.csv`, versionados. A migration/seed é gerada a partir deles. As fontes são cadastradas no banco e gerenciadas por admin; a allowlist fixa no código é substituída por validação de URL (somente https, bloqueio de IP privado/localhost, teste do feed antes de ativar).

## Uso de objetivo e categoria no pipeline

- O item herda os objetivos da fonte.
- A IA continua escolhendo a categoria do item; as categorias da fonte entram como dica no prompt.
- Fila interna: filtro e ordenação por objetivo e prioridade da fonte. Camada pública: filtro por categoria (já existe) e, mais tarde, por objetivo.

## Revisão humana

- Capacidade: **1 pessoa, 2 vezes por semana.**
- Todo item entra como `pending` e só é publicado após aprovação de um editor/reviewer em tela administrativa nova.
- Quando houver histórico de acerto, migrar para o modelo híbrido: relevância ≥ 80 publica direto; 55–79 vai para a fila; < 55 é rejeitado.
- Cron **diário**. A fila mostra no máximo **25 itens por sessão**, ordenados por relevância × prioridade da fonte × peso regional. Itens não revisados ficam só na camada interna e expiram para `rejected` em **14 dias**. Teto e prazo são configuráveis no banco.

## Deduplicação

- URL normalizada (sem `utm_*` e parâmetros de rastreio, sem barra final) mais similaridade de título com `pg_trgm` numa janela de 72 h.
- A duplicata não gera card novo: é registrada como "também noticiado por" no item principal. O número de fontes que cobriram a notícia é um sinal de relevância.
- Embeddings apenas se essa abordagem falhar na prática.

## Falhas da IA

- Sem chave ou com erro da API, o item entra na camada interna sem tradução, com status `failed`, e é reprocessado na rodada seguinte com backoff.
- `max_output_tokens` definido e teto de chamadas por execução.
- O prompt exige `keywords` e `minerals` em pt-BR.

## Correções incluídas

- Policy de leitura pública para os campos de `news_sources` usados pela view.
- `published_at` ilegível cai para a data de ingestão, marcada como incerta, em vez de virar "agora".
- Testes unitários para parse de feed, deduplicação e curadoria (IA mockada).

## Fases de entrega

Um PR por fase.

1. **Catálogo** — unificar as planilhas, normalizar, classificar objetivos e categorias em pt-BR, verificar RSS, gerar `data/*.csv` e a migration/seed. Retirar do versionamento os artefatos `reports/tmp/*-style-evidence.json`, que não têm relação com o radar, e ignorar `reports/tmp/`. As fontes novas entram **inativas**: a ativação depende do portão humano e da validação de URL da fase 2, para não ampliar a publicação automática atual.
2. **Endurecimento** — portão humano e tela admin da fila, deduplicação com `pg_trgm`, tratamento de falha da IA com limites, data incerta, correção de RLS, peso regional, cron diário com teto e expiração, validação de URL no lugar da allowlist, ativação das fontes `rss`, testes unitários.
3. **Radar ↔ GeoLab** — presets do GeoLab (Terras raras, Lítio e pegmatitos, Cobre e ouro, Potencial mineral) exibem as notícias correspondentes.
4. **Geocodificação** — a IA extrai locais e minerais; geocódigo por UF/município/província mineral; camada de notícias no dashboard. *Exige grilling próprio* (provedor de geocodificação, granularidade).
5. **Newsletter, depois alertas** — newsletter semanal a partir dos itens aprovados; alertas por e-mail por mineral, região ou tema. *Exige grilling próprio* (contas, preferências, envio).
