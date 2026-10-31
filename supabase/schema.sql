-- CLUBCAFECOL · base de datos (Supabase, proyecto "clubcafecol", región sa-east-1)
-- Estado final del esquema. Se aplicó en tres pasos; este archivo es la versión consolidada.
-- Las tablas NO son accesibles para el rol anon: todo se escribe por funciones rpc
-- (la clave publicable del sitio solo puede ejecutar esas funciones).

-- ── Referidores (antes: pestaña REFERIDORES del Sheet) ────────────────────
create table public.referidores (
  codigo      text primary key check (codigo ~ '^[A-Z]{3,15}-[0-9]{3}$'),
  nombre      text not null check (char_length(nombre) between 2 and 80),
  whatsapp    text check (whatsapp is null or whatsapp ~ '^57[0-9]{10}$'),
  activo      boolean not null default true,
  ventas_ref  integer not null default 0,
  created_at  timestamptz not null default now()
);

-- ── Visitas con código (antes: VISITAS) ───────────────────────────────────
create table public.referido_visitas (
  id          bigint generated always as identity primary key,
  codigo      text not null references public.referidores(codigo),
  pagina      text check (char_length(pagina) <= 200),
  origen      text check (char_length(origen) <= 60),
  created_at  timestamptz not null default now()
);
create index on public.referido_visitas (codigo);

-- ── Pedidos web (antes: PEDIDOS_REF) ──────────────────────────────────────
create table public.pedidos (
  id               text primary key check (id ~ '^W-[0-9]{6}-[A-Z0-9]{4}$'),
  created_at       timestamptz not null default now(),
  estado           text not null default 'nuevo'
                   check (estado in ('nuevo','pagado','entregado','cancelado')),
  idioma           text check (char_length(idioma) <= 5),
  items            jsonb not null check (jsonb_typeof(items) = 'array'
                                         and jsonb_array_length(items) between 1 and 50),
  subtotal         integer not null check (subtotal between 0 and 100000000),
  subtotal_elegible integer not null default 0 check (subtotal_elegible >= 0),
  descuento        integer not null default 0 check (descuento >= 0),
  descuento_valido integer not null default 0 check (descuento_valido >= 0),
  total            integer not null check (total >= 0),
  whatsapp         text check (whatsapp is null or whatsapp ~ '^57[0-9]{10}$'),
  direccion        text check (char_length(direccion) <= 200),
  nota             text check (char_length(nota) <= 300),
  codigo_ref       text references public.referidores(codigo),
  ref_id           text unique,
  primera_compra   boolean,
  origen           text check (char_length(origen) <= 60),
  constraint pedidos_ref_requiere_whatsapp check (codigo_ref is null or whatsapp is not null)
);
create index on public.pedidos (whatsapp);
create index on public.pedidos (codigo_ref);

-- ── Recompensas: 1 bolsa de 125 g de Origen por amigo que paga su primera compra
create table public.recompensas (
  id                bigint generated always as identity primary key,
  created_at        timestamptz not null default now(),
  codigo_referidor  text not null references public.referidores(codigo),
  pedido_id         text not null unique references public.pedidos(id),
  ref_id            text not null,
  premio            text not null default 'Bolsa de 125 g de Origen',
  estado            text not null default 'pendiente' check (estado in ('pendiente','entregada')),
  entregada_at      timestamptz
);

-- ── Opiniones: moderadas; solo se muestran las aprobadas ──────────────────
create table public.opiniones (
  id           bigint generated always as identity primary key,
  created_at   timestamptz not null default now(),
  nombre       text not null check (char_length(nombre) between 2 and 60),
  ciudad       text not null check (char_length(ciudad) between 2 and 60),
  calificacion smallint not null check (calificacion between 1 and 5),
  texto        text not null check (char_length(texto) between 20 and 1000),
  contacto     text not null check (char_length(contacto) <= 80),
  autorizo     boolean not null check (autorizo),
  estado       text not null default 'pendiente' check (estado in ('pendiente','aprobada','rechazada')),
  aprobada_at  timestamptz
);

-- ── Lógica del CRM ────────────────────────────────────────────────────────
-- Primera compra = el WhatsApp del cliente no tiene pedidos previos no cancelados.
-- Autorreferido bloqueado. Descuento válido = 15 % del subtotal elegible (sin kits), solo en la primera compra.
create or replace function public.pedido_antes_insert() returns trigger
language plpgsql set search_path = public as $$
declare n integer;
begin
  if new.whatsapp is not null then
    new.primera_compra := not exists (
      select 1 from public.pedidos p
      where p.whatsapp = new.whatsapp and p.estado <> 'cancelado');
  end if;

  if new.codigo_ref is not null then
    if exists (select 1 from public.referidores r
               where r.codigo = new.codigo_ref and r.whatsapp = new.whatsapp) then
      raise exception 'autorreferido' using errcode = 'P0001';
    end if;
    new.descuento_valido := case when new.primera_compra
      then least(new.descuento, round(new.subtotal_elegible * 0.15)::integer) else 0 end;
    update public.referidores set ventas_ref = ventas_ref + 1
      where codigo = new.codigo_ref returning ventas_ref into n;
    new.ref_id := new.codigo_ref || '/R' || lpad(n::text, 2, '0');
  else
    new.descuento := 0;
    new.descuento_valido := 0;
  end if;
  return new;
end $$;

create trigger pedidos_antes_insert before insert on public.pedidos
  for each row execute function public.pedido_antes_insert();

-- Al pasar a "pagado" una primera compra referida, se crea la recompensa.
create or replace function public.pedido_despues_update() returns trigger
language plpgsql set search_path = public as $$
begin
  if new.estado = 'pagado' and old.estado <> 'pagado'
     and new.codigo_ref is not null and new.primera_compra then
    insert into public.recompensas (codigo_referidor, pedido_id, ref_id)
      values (new.codigo_ref, new.id, new.ref_id)
      on conflict (pedido_id) do nothing;
  end if;
  return new;
end $$;

create trigger pedidos_despues_update after update on public.pedidos
  for each row execute function public.pedido_despues_update();

-- ── Funciones públicas (única vía de escritura del sitio) ─────────────────
create or replace function public.codigo_valido(p_codigo text) returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.referidores where codigo = p_codigo and activo);
$$;

create or replace function public.registrar_visita(p_codigo text, p_pagina text, p_origen text)
returns boolean language plpgsql security definer set search_path = public as $$
begin
  if not public.codigo_valido(p_codigo) then return false; end if;
  insert into public.referido_visitas (codigo, pagina, origen)
    values (p_codigo, left(p_pagina, 200), left(p_origen, 60));
  return true;
end $$;

create or replace function public.crear_pedido(
  p_items jsonb, p_subtotal integer, p_subtotal_elegible integer, p_descuento integer,
  p_total integer, p_whatsapp text, p_direccion text, p_nota text, p_codigo text,
  p_idioma text, p_origen text)
returns text language plpgsql security definer set search_path = public as $$
declare
  v_id text;
  v_intentos integer := 0;
begin
  if p_codigo is not null and not public.codigo_valido(p_codigo) then
    raise exception 'codigo_invalido' using errcode = 'P0001';
  end if;
  loop
    v_intentos := v_intentos + 1;
    v_id := 'W-' || to_char(now() at time zone 'America/Bogota', 'YYMMDD') || '-' ||
            upper(substr(md5(random()::text || clock_timestamp()::text), 1, 4));
    begin
      insert into public.pedidos (id, items, subtotal, subtotal_elegible, descuento, total,
                                  whatsapp, direccion, nota, codigo_ref, idioma, origen)
      values (v_id, p_items, p_subtotal, coalesce(p_subtotal_elegible, 0),
              coalesce(p_descuento, 0), p_total, p_whatsapp,
              left(p_direccion, 200), left(p_nota, 300), p_codigo, left(p_idioma, 5),
              left(p_origen, 60));
      return v_id;
    exception when unique_violation then
      if v_intentos > 5 then raise; end if;
    end;
  end loop;
end $$;

create or replace function public.crear_opinion(
  p_nombre text, p_ciudad text, p_calificacion integer, p_texto text,
  p_contacto text, p_autorizo boolean)
returns bigint language plpgsql security definer set search_path = public as $$
declare v_id bigint;
begin
  insert into public.opiniones (nombre, ciudad, calificacion, texto, contacto, autorizo)
  values (trim(p_nombre), trim(p_ciudad), p_calificacion, trim(p_texto), trim(p_contacto), p_autorizo)
  returning id into v_id;
  return v_id;
end $$;

-- ── Seguridad: nada abierto por defecto ───────────────────────────────────
alter table public.referidores        enable row level security;
alter table public.referido_visitas   enable row level security;
alter table public.pedidos            enable row level security;
alter table public.recompensas        enable row level security;
alter table public.opiniones          enable row level security;

revoke all on all tables in schema public from anon, authenticated;

-- Opiniones aprobadas: lectura pública SIN la columna de contacto.
grant select (id, created_at, nombre, ciudad, calificacion, texto, estado, aprobada_at)
  on public.opiniones to anon;
create policy opiniones_aprobadas_publicas on public.opiniones
  for select to anon using (estado = 'aprobada');

-- Las funciones corren con permisos del dueño; anon solo puede ejecutarlas.
revoke execute on all functions in schema public from public, authenticated;
grant execute on function public.codigo_valido(text)                                       to anon;
grant execute on function public.registrar_visita(text, text, text)                        to anon;
grant execute on function public.crear_pedido(jsonb, integer, integer, integer, integer, text, text, text, text, text, text) to anon;
grant execute on function public.crear_opinion(text, text, integer, text, text, boolean)   to anon;

-- Datos de arranque: ERIKPUE-001 (WhatsApp pendiente de confirmar).
insert into public.referidores (codigo, nombre, whatsapp)
  values ('ERIKPUE-001', 'Erik Puentes', null)
  on conflict (codigo) do nothing;

-- ── Operación (solo desde el panel de Supabase, nunca desde el sitio) ─────
-- Marcar un pedido como pagado: update public.pedidos set estado = 'pagado' where id = 'W-…';
-- Entregar recompensa:          update public.recompensas set estado = 'entregada', entregada_at = now() where id = …;
-- Aprobar una opinión:          update public.opiniones set estado = 'aprobada', aprobada_at = now() where id = …;
