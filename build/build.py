# -*- coding: utf-8 -*-
"""
CLUBCAFECOL — Generador estático del catálogo.
Uso:  python3 build.py        (escribe ../index.html, ../sitemap.xml, ../robots.txt)
"""
import json, os, sys, io, datetime
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from skus import (SKUS, CLUB, BUNDLES, TESTIMONIOS, FAQ, QUIZ, FORMATOS, TAZAS,
                  EXOTICOS, WA_NUM, NIT, ENVIO_GRATIS, SITE, ASSET_VER,
                  MOLIENDAS, DESTACADOS, LEALTAD, REFERIDOS, USD_COP,
                  VITRINA, VIDEO_ORIGEN, REGIONES, NAPA)

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
LANGS = [("es","Español","🇪🇸"),("en","English","🇬🇧"),("pt","Português","🇧🇷"),
         ("fr","Français","🇫🇷"),("de","Deutsch","🇩🇪"),("it","Italiano","🇮🇹"),
         ("ja","日本語","🇯🇵"),("zh","中文","🇨🇳"),("ko","한국어","🇰🇷"),("ar","العربية","🇸🇦")]

def cop(n): return "$" + f"{n:,}".replace(",", ".")

# ── Cálculo de valor: puntos SCA por cada $1.000 de costo por taza ──────
def enriquecer():
    for s in SKUS:
        p250 = s["precios"]["250g"]
        s["taza"] = round(p250 / TAZAS["250g"])
        # El índice de valor solo se calcula sobre lotes con puntaje SCA publicado.
        # Inventar un puntaje para el blend de entrada sería un dato falso.
        s["valor"] = round(s["sca"] / (s["taza"] / 1000), 1) if s.get("sca") else None
        s["exotico"] = s["varietal"] in EXOTICOS
        s["img"] = "assets/productos/" + s["id"].lower()
        s["destacado"] = s["id"] in DESTACADOS
        # Línea de procedencia: solo si hay dato real de finca o caficultor
        if s.get("caficultor") and s.get("finca"):
            s["proc_txt"] = "Cultivado por %s en %s" % (s["caficultor"], s["finca"])
        elif s.get("finca"):
            s["proc_txt"] = "Cultivado en %s" % s["finca"]
        elif s.get("caficultor"):
            s["proc_txt"] = "Cultivado por %s" % s["caficultor"]
        else:
            s["proc_txt"] = None
    # Etiquetas de mejor relación calidad-precio
    conf = [x for x in SKUS if x.get("sca")]
    mejor_global = max(conf, key=lambda x: x["valor"])
    alta = [x for x in conf if x["sca"] >= 87]
    mejor_alta = max(alta, key=lambda x: x["valor"])
    premiados = [x for x in conf if x["sca"] >= 88]
    mejor_prem = max(premiados, key=lambda x: x["valor"])
    mejor_global["valor_tag"] = ("valor-top", "Mejor relación calidad-precio")
    if mejor_alta is not mejor_global:
        mejor_alta["valor_tag"] = ("valor-alta", "Mejor valor SCA 87+")
    if mejor_prem is not mejor_global and mejor_prem is not mejor_alta:
        mejor_prem["valor_tag"] = ("valor-prem", "Mejor valor premiado")
    return mejor_global, mejor_alta, mejor_prem

MEJOR_G, MEJOR_A, MEJOR_P = enriquecer()

COL_LABEL = {"origen":"Origen","temporada":"Temporada","premio":"Premio Nacional","reserva":"Reserva"}

def wa(txt):
    from urllib.parse import quote
    return "https://wa.me/%s?text=%s" % (WA_NUM, quote(txt))

# ═══════════════════════════════════════════════════════════════════════
#  TARJETAS DE PRODUCTO
# ═══════════════════════════════════════════════════════════════════════
def card(s, i):
    badges = ['<span class="bdg bdg--col bdg--%s">%s</span>' % (s["col"], COL_LABEL[s["col"]])]
    if s.get("premio"):
        badges.append('<span class="bdg bdg--premio">%s %s</span>' % (s["premio_icon"], s["premio"]))
    if s.get("exotico"):
        badges.append('<span class="bdg bdg--exotico" title="Variedad de siembra escasa en Colombia">✦ Variedad exclusiva</span>')
    if s.get("bajo_cafeina"):
        badges.append('<span class="bdg bdg--deca">Bajo en cafeína</span>')
    if s.get("valor_tag"):
        cls, txt = s["valor_tag"]
        badges.append('<span class="bdg bdg--%s">★ %s</span>' % (cls, txt))

    sca = ('<div class="card__sca" title="Puntaje SCA: escala de 0 a 100 evaluada por catador certificado">'
           '<b>%d</b><span>SCA</span></div>' % s["sca"]) if s.get("sca") else ""

    chips = "".join(
        '<button type="button" class="fmt%s" data-fmt="%s" data-precio="%d" data-label="%s">'
        '<span class="fmt__g">%s</span><span class="fmt__p">%s</span></button>'
        % (" is-active" if k == "250g" else "", k, s["precios"][k], lbl, lbl, cop(s["precios"][k]))
        for k, lbl in FORMATOS)

    notas = "".join('<span>%s</span>' % n for n in s["notas"])

    mol_ops = "".join('<option value="%s">%s</option>' % (v, l) for v, l in MOLIENDAS)

    # Micro-reseñas — solo si hay datos reales en skus.py
    rs = s.get("resenas")
    resenas = ""
    if rs and rs.get("n") and rs.get("prom"):
        llenas = int(round(rs["prom"]))
        estrellas = "★" * llenas + "☆" * (5 - llenas)
        resenas = ('<div class="card__rate"><span class="card__stars" aria-hidden="true">%s</span>'
                   '<b>%s</b><span class="card__rate-n">%d reseñas</span></div>'
                   % (estrellas, str(rs["prom"]).replace(".", ","), rs["n"]))

    # Escasez — solo si hay inventario real declarado
    stock = ""
    if s.get("stock") is not None and s["stock"] <= 12:
        stock = ('<div class="card__stock"><i></i>Solo quedan %d bolsas de este lote</div>'
                 % s["stock"])

    proc = ('<p class="card__proc">%s</p>' % s["proc_txt"]) if s.get("proc_txt") else ""

    return """
      <article class="card%(extra)s" id="%(id)s" data-sku="%(id)s" data-idx="%(i)d" data-col="%(col)s"
               data-sca="%(scanum)d" data-precio="%(p250)d" data-valor="%(valor)s"
               data-exotico="%(exo)d" data-premio="%(prem)d" data-dest="%(dest)d">
        <div class="card__media">
          <picture>
            <source srcset="%(img)s.webp" type="image/webp">
            <img src="%(img)s.jpg" alt="Etiqueta del café de especialidad %(nombre)s — %(varietal)s, proceso %(proceso)s, %(msnm)s msnm, Huila, Colombia"
                 loading="lazy" decoding="async" width="760" height="1429">
          </picture>
          %(sca)s
          <button type="button" class="card__zoom" data-open="%(i)d" aria-label="Ver ficha completa de %(nombre)s">Ver ficha</button>
        </div>
        <div class="card__body">
          <div class="card__badges">%(badges)s</div>
          <h3 class="card__name">%(nombre)s</h3>
          %(resenas)s
          <p class="card__var">%(varietal)s · %(proceso)s · %(msnm)s msnm</p>
          %(proc)s
          <div class="card__notas">%(notas)s</div>
          %(stock)s
          <div class="card__opt">
            <span class="card__opt-lbl" data-i18n="opt.fmt">Tamaño</span>
            <div class="card__fmts" role="group" aria-label="Formato de %(nombre)s">%(chips)s</div>
          </div>
          <div class="card__opt">
            <label class="card__opt-lbl" for="mol-%(id)s" data-i18n="opt.mol">Molienda · sin costo</label>
            <select class="card__mol" id="mol-%(id)s" data-mol-sel>%(mol_ops)s</select>
          </div>
          <div class="card__price">
            <div><span class="card__price-now" data-price-out>%(p250fmt)s</span>
                 <span class="card__price-unit" data-unit-out>250 g</span></div>
            <div class="card__taza" data-taza-out title="Costo aproximado por taza con dosis de 15 g">≈ %(taza)s / taza</div>
          </div>
          <div class="card__actions">
            <button type="button" class="btn btn--add" data-add="%(i)d">
              <span data-i18n="cta.add">Agregar</span>
            </button>
            <a class="btn btn--wa-icon" href="%(waurl)s" target="_blank" rel="noopener"
               data-wa-direct="%(nombre)s" aria-label="Pedir %(nombre)s directo por WhatsApp" title="Pedir directo por WhatsApp">
              <svg viewBox="0 0 24 24" width="19" height="19" aria-hidden="true"><path fill="currentColor" d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.9 9.9 0 0 0 4.79 1.22h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2m0 1.67c2.2 0 4.27.86 5.82 2.42a8.19 8.19 0 0 1 2.42 5.83c0 4.54-3.7 8.23-8.24 8.23a8.23 8.23 0 0 1-4.19-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.18 8.18 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.24-8.24M8.53 7.33c-.16 0-.43.06-.66.31-.22.25-.86.85-.86 2.07 0 1.22.89 2.4 1.01 2.56.12.17 1.71 2.74 4.22 3.74 2.09.82 2.51.66 2.97.62.46-.04 1.48-.6 1.69-1.19.21-.58.21-1.08.15-1.19-.07-.1-.23-.16-.48-.28-.25-.13-1.47-.73-1.7-.82-.23-.08-.39-.12-.56.12-.16.25-.64.81-.78.97-.14.17-.29.19-.54.06-.25-.12-1.05-.39-2-1.23-.74-.66-1.24-1.48-1.38-1.72-.15-.25-.02-.38.11-.5.11-.11.25-.29.37-.43.13-.15.17-.25.25-.41.08-.17.04-.31-.02-.43-.06-.13-.55-1.34-.76-1.83-.2-.48-.4-.42-.55-.42h-.48z"/></svg>
            </a>
          </div>
        </div>
      </article>""" % dict(
        id=s["id"], i=i, col=s["col"], scanum=s.get("sca") or 0, p250=s["precios"]["250g"],
        valor=("%.1f" % s["valor"]) if s["valor"] else "0",
        exo=1 if s.get("exotico") else 0, prem=1 if s.get("premio") else 0,
        dest=1 if s["destacado"] else 0, extra="" if s["destacado"] else " is-extra",
        resenas=resenas, stock=stock, proc=proc, mol_ops=mol_ops,
        img=s["img"], nombre=s["nombre"], varietal=s["varietal"], proceso=s["proceso"],
        msnm=s["msnm"], sca=sca, badges="".join(badges), notas=notas, chips=chips,
        p250fmt=cop(s["precios"]["250g"]), taza=cop(s["taza"]),
        waurl=wa("Hola CLUBCAFECOL, me antojé del %s (%s) en presentación de 250 g. Mi ciudad es ____ y lo quiero molido para ____. ¿Me confirman total con envío?" % (s["nombre"], ", ".join(s["notas"][:3]).lower())))

# ═══════════════════════════════════════════════════════════════════════
#  JSON-LD
# ═══════════════════════════════════════════════════════════════════════
def jsonld():
    productos = []
    for s in SKUS:
        offers = [{
            "@type": "Offer",
            "name": "%s — %s" % (s["nombre"], lbl),
            "sku": "%s-%s" % (s["id"], k.upper()),
            "price": str(s["precios"][k]),
            "priceCurrency": "COP",
            "priceValidUntil": "2026-12-31",
            "availability": "https://schema.org/InStock",
            "itemCondition": "https://schema.org/NewCondition",
            "url": "%s/#%s" % (SITE, s["id"]),
            "shippingDetails": {
                "@type": "OfferShippingDetails",
                "shippingRate": {"@type": "MonetaryAmount", "value": "0", "currency": "COP"},
                "shippingDestination": {"@type": "DefinedRegion", "addressCountry": "CO"},
                "deliveryTime": {"@type": "ShippingDeliveryTime",
                                 "handlingTime": {"@type": "QuantitativeValue", "minValue": 0, "maxValue": 1, "unitCode": "DAY"},
                                 "transitTime": {"@type": "QuantitativeValue", "minValue": 1, "maxValue": 5, "unitCode": "DAY"}}},
            "seller": {"@type": "Organization", "name": "CLUBCAFECOL"}
        } for k, lbl in FORMATOS]

        props = [
            {"@type": "PropertyValue", "name": "Variedad", "value": s["varietal"]},
            {"@type": "PropertyValue", "name": "Proceso", "value": s["proceso"]},
            {"@type": "PropertyValue", "name": "Altitud", "value": "%s msnm" % s["msnm"]},
            {"@type": "PropertyValue", "name": "Origen", "value": s["origen"]},
            {"@type": "PropertyValue", "name": "Cuerpo", "value": s["cuerpo"]},
            {"@type": "PropertyValue", "name": "Notas de cata", "value": ", ".join(s["notas"])},
        ]
        if s.get("sca"):
            props.append({"@type": "PropertyValue", "name": "Puntaje SCA", "value": str(s["sca"])})

        productos.append({
            "@type": "Product",
            "@id": "%s/#%s" % (SITE, s["id"]),
            "name": s["nombre"],
            "sku": s["id"],
            "mpn": s["id"],
            "category": "Café de especialidad > %s" % COL_LABEL[s["col"]],
            "description": "Café de especialidad colombiano %s. Variedad %s, proceso %s, cultivado a %s msnm en %s.%s Notas de cata: %s. Tostado bajo pedido y molido a tu medida sin costo." % (
                s["nombre"], s["varietal"], s["proceso"].lower(), s["msnm"], s["origen"],
                (" Puntaje SCA %d." % s["sca"]) if s.get("sca") else "", ", ".join(s["notas"]).lower()),
            "image": ["%s/%s.jpg" % (SITE, s["img"])],
            "brand": {"@type": "Brand", "name": "CLUBCAFECOL"},
            "countryOfOrigin": {"@type": "Country", "name": "Colombia"},
            "additionalProperty": props,
            "offers": {"@type": "AggregateOffer", "priceCurrency": "COP",
                       "lowPrice": str(min(s["precios"].values())),
                       "highPrice": str(max(s["precios"].values())),
                       "offerCount": len(FORMATOS), "offers": offers},
        })

    graph = [
        {"@type": "Organization", "@id": SITE + "/#org", "name": "CLUBCAFECOL",
         "url": SITE + "/", "logo": SITE + "/assets/img/logo.jpg",
         "description": "Tostador colombiano de café de especialidad. 21 variedades del Huila, SCA 85–89, tostado bajo pedido.",
         "taxID": NIT, "email": "corporacionclubdelcafe@gmail.com",
         "contactPoint": [{"@type": "ContactPoint", "telephone": "+57" + WA_NUM[2:],
                           "contactType": "sales", "areaServed": "CO",
                           "availableLanguage": ["es", "en"]}],
         "sameAs": ["https://instagram.com/clubcafecol"]},
        {"@type": "WebSite", "@id": SITE + "/#web", "url": SITE + "/",
         "name": "CLUBCAFECOL", "inLanguage": "es-CO",
         "publisher": {"@id": SITE + "/#org"}},
        {"@type": "LocalBusiness", "@id": SITE + "/#local", "name": "CLUBCAFECOL",
         "image": SITE + "/assets/img/logo.jpg", "url": SITE + "/",
         "telephone": "+57" + WA_NUM[2:], "priceRange": "$4.900 – $1.100.000 COP",
         "address": {"@type": "PostalAddress", "addressLocality": "Bogotá",
                     "addressRegion": "Cundinamarca", "addressCountry": "CO"},
         "areaServed": {"@type": "Country", "name": "Colombia"},
         "parentOrganization": {"@id": SITE + "/#org"}},
        {"@type": "FAQPage", "@id": SITE + "/#faq",
         "mainEntity": [{"@type": "Question", "name": q,
                         "acceptedAnswer": {"@type": "Answer", "text": a}} for q, a in FAQ]},
        {"@type": "ItemList", "@id": SITE + "/#catalogo",
         "name": "Catálogo CLUBCAFECOL 2026", "numberOfItems": len(SKUS),
         "itemListElement": [{"@type": "ListItem", "position": i + 1,
                              "url": "%s/#%s" % (SITE, s["id"]), "name": s["nombre"]}
                             for i, s in enumerate(SKUS)]},
    ] + productos

    return json.dumps({"@context": "https://schema.org", "@graph": graph},
                      ensure_ascii=False, separators=(",", ":"))

# ═══════════════════════════════════════════════════════════════════════
#  SECCIONES
# ═══════════════════════════════════════════════════════════════════════
def sec_trofeos():
    campeon = next(s for s in SKUS if s.get("premio") == "Campeón Nacional")
    sub = next(s for s in SKUS if s.get("premio") == "Subcampeón Nacional")
    idx = {s["id"]: s for s in SKUS}
    raros = [idx[i] for i in VITRINA if i in idx]

    def trofeo(s, icon, kicker):
        return """
        <a class="trofeo" href="#%(id)s" data-open-sku="%(id)s">
          <div class="trofeo__img"><picture><source srcset="%(img)s.webp" type="image/webp">
            <img src="%(img)s.jpg" alt="%(nombre)s — %(kick)s" loading="lazy" width="760" height="1429"></picture></div>
          <div class="trofeo__txt">
            <div class="trofeo__kicker">%(icon)s %(kick)s</div>
            <h3>%(nombre)s</h3>
            <p class="trofeo__var">%(varietal)s · %(proceso)s</p>
            <div class="trofeo__sca"><b>%(sca)d</b> puntos SCA</div>
            <p class="trofeo__notas">%(notas)s</p>
            <span class="trofeo__cta">Ver ficha →</span>
          </div></a>""" % dict(id=s["id"], img=s["img"], nombre=s["nombre"], icon=icon,
                               kick=kicker, varietal=s["varietal"], proceso=s["proceso"],
                               sca=s["sca"], notas=" · ".join(s["notas"]))

    raros_html = "".join(
        '<li><button type="button" class="raro" data-open-sku="%s">'
        '<span class="raro__img"><picture><source srcset="%s.webp" type="image/webp">'
        '<img src="%s.jpg" alt="%s" loading="lazy" width="760" height="1429"></picture></span>'
        '<span class="raro__txt"><b>%s</b><span>%s%s</span></span>'
        '<span class="raro__go" aria-hidden="true">→</span></button></li>'
        % (s["id"], s["img"], s["img"], s["nombre"], s["nombre"], s["varietal"],
           (" · SCA %d" % s["sca"]) if s.get("sca") else "")
        for s in raros)

    return """
<section class="trofeos" id="trofeos">
  <div class="wrap">
    <div class="kicker" data-i18n="tro.kicker">Lo que nos separa del resto</div>
    <h2 data-i18n="tro.title">La Selección de los<br><em>Granos Premiados</em></h2>
    <p class="sec-sub" data-i18n="tro.sub">Dos de nuestras variedades subieron al podio del campeonato nacional de cafés especiales. El resto del portafolio se cultiva con el mismo estándar.</p>
    <div class="trofeos__grid">%(camp)s%(sub)s</div>
    <div class="raros">
      <div class="raros__head">
        <h3 data-i18n="tro.raros">Los más pedidos de la casa</h3>
        <p data-i18n="tro.rarosSub">Las seis variedades que más salen de nuestra tostadora, entre clásicos de origen y perfiles de competencia. Toca cualquiera para ver su ficha completa.</p>
      </div>
      <ul class="raros__list">%(raros)s</ul>
    </div>
  </div>
</section>""" % dict(camp=trofeo(campeon, "🏆", "Campeón Nacional"),
                     sub=trofeo(sub, "🥈", "Subcampeón Nacional"), raros=raros_html)


def sec_origen():
    """Bloque humano: quién está detrás del café + video de Instagram."""
    return """
<section class="origen" id="origen">
  <div class="wrap origen__in">
    <div class="origen__txt">
      <div class="kicker" data-i18n="or.kicker">Quiénes están detrás</div>
      <h2 data-i18n="or.title">No compramos el café.<br><em>Lo cultivamos.</em></h2>
      <p data-i18n="or.p1">CLUBCAFECOL nace en el Huila, entre Pitalito y Acevedo, y hoy cultivamos también en Barbosa (Santander), Sevilla (Valle del Cauca), el Macizo del Cauca y el altiplano de Nariño. Somos caficultores: la misma gente que poda, recolecta y controla la fermentación es la que decide la curva de tueste y sella la bolsa que llega a tu casa.</p>
      <p data-i18n="or.p2">Entre el grano y tu taza no hay intermediarios, ni comisionistas, ni una bodega donde el café espere meses. Eso cambia dos cosas: el margen se queda en la finca, y podemos arriesgarnos con variedades especiales, exóticas y cofermentadas, aclamadas por su excelente sabor.</p>
      <ul class="origen__reg">%(regiones)s</ul>
      <div class="origen__stats">
        <div><b>1.650–1.700</b><span data-i18n="or.s1">msnm de cultivo</span></div>
        <div><b>5</b><span data-i18n="or.s2">departamentos cafeteros</span></div>
        <div><b>0</b><span data-i18n="or.s3">intermediarios</span></div>
      </div>
      <a class="btn btn--ig" href="https://instagram.com/clubcafecol" target="_blank" rel="noopener" data-i18n="or.cta">Ver más en @clubcafecol</a>
    </div>

    <figure class="origen__video">
      <div class="igwrap" id="igWrap" data-ig="%(video)s">
        <blockquote class="instagram-media" data-instgrm-permalink="%(video)s"
                    data-instgrm-version="14"
                    style="background:#0B1728;border:0;border-radius:16px;margin:0;max-width:540px;min-width:260px;padding:0;width:100%%">
          <a class="igfall" href="%(video)s" target="_blank" rel="noopener">
            <span class="igfall__play" aria-hidden="true">▶</span>
            <span class="igfall__txt" data-i18n="or.play">Ver el video en Instagram</span>
          </a>
        </blockquote>
      </div>
      <figcaption data-i18n="or.cap">Del árbol al tueste: así trabajamos. Video publicado en @clubcafecol.</figcaption>
    </figure>
  </div>
</section>""" % dict(video=VIDEO_ORIGEN, regiones="".join(
        '<li><b>%s</b><span>%s</span></li>' % (d, m) for d, m in REGIONES))


def sec_valor():
    """Comparación visual del rendimiento: barras, medallas y color."""
    orden = sorted([x for x in SKUS if x["valor"]], key=lambda x: -x["valor"])
    top = orden[0]["valor"]
    medallas = {0: ("oro", "🥇"), 1: ("plata", "🥈"), 2: ("bronce", "🥉")}

    def barra(s, i):
        pct = max(14, int(s["valor"] / top * 100))
        med = medallas.get(i)
        cls = " is-podio is-%s" % med[0] if med else ""
        icono = ('<span class="vb__med">%s</span>' % med[1]) if med else \
                ('<span class="vb__pos">%d</span>' % (i + 1))
        return ('<button type="button" class="vb%s" data-open-sku="%s" data-col="%s">'
                '%s'
                '<span class="vb__img"><picture><source srcset="%s.webp" type="image/webp">'
                '<img src="%s.jpg" alt="%s" loading="lazy" width="760" height="1429"></picture></span>'
                '<span class="vb__main">'
                '<span class="vb__top"><b>%s</b><span class="vb__sca">SCA %d</span></span>'
                '<span class="vb__bar"><i style="width:%d%%"></i></span>'
                '<span class="vb__meta">%s la bolsa de 250 g</span></span>'
                '<span class="vb__taza"><b>%s</b><span>por taza</span></span></button>'
                % (cls, s["id"], s["col"], icono, s["img"], s["img"], s["nombre"],
                   s["nombre"], s["sca"], pct, cop(s["precios"]["250g"]), cop(s["taza"])))

    barras = "".join(barra(s, i) for i, s in enumerate(orden))
    return """
<section class="valorsec" id="valor">
  <div class="wrap">
    <div class="kicker kicker--hot" data-i18n="val.kicker">💰 Relación calidad-precio</div>
    <h2 data-i18n="val.title">¿Cuál rinde <em>más por peso invertido?</em></h2>
    <p class="sec-sub" data-i18n="val.sub">Una bolsa de 250 g rinde unas 16 tazas. Mientras más larga la barra, más puntaje SCA te llevas por cada peso. Toca cualquiera para ver su ficha.</p>
    <div class="valorsec__bars">%(barras)s</div>
    <p class="valorsec__nota" data-i18n="val.nota">Índice de valor = puntos SCA por cada $1.000 de costo por taza. Un café de competencia a $7.188 la taza sigue costando menos que uno de cafetería.</p>
  </div>
</section>""" % dict(barras=barras)


def _sec_valor_tabla_legacy():
    def fila(s):
        if s["valor"]:
            idx = '<span class="vbar"><i style="width:%d%%"></i></span>' % min(
                100, int(s["valor"] / MEJOR_G["valor"] * 100))
        else:
            idx = '<span class="vbar-na" title="Sin puntaje SCA publicado para este lote">sin puntaje</span>'
        return ('<tr class="%s"><td><b>%s</b><span>%s</span></td><td>%s</td><td>%s</td>'
                '<td><b>%s</b></td><td>%s</td></tr>'
                % ("is-best" if s.get("valor_tag") else "", s["nombre"], s["varietal"],
                   ("SCA %d" % s["sca"]) if s.get("sca") else "—",
                   cop(s["precios"]["250g"]), cop(s["taza"]), idx))
    filas = "".join(fila(s) for s in sorted(SKUS, key=lambda x: -(x["valor"] or 0)))
    return """
<section class="valorsec" id="valor">
  <div class="wrap">
    <div class="kicker" data-i18n="val.kicker">Relación calidad-precio</div>
    <h2 data-i18n="val.title">¿Cuál rinde <em>más por peso invertido?</em></h2>
    <p class="sec-sub" data-i18n="val.sub">Una bolsa de 250 g rinde unas 16 tazas con dosis de 15 g. Así se ve el costo real por taza frente al puntaje SCA de cada variedad, de mejor a menor valor.</p>
    <div class="valorsec__tabla">
      <table>
        <thead><tr><th data-i18n="val.c1">Café</th><th data-i18n="val.c2">Puntaje</th><th data-i18n="val.c3">Bolsa 250 g</th><th data-i18n="val.c4">Por taza</th><th data-i18n="val.c5">Índice de valor</th></tr></thead>
        <tbody>%(filas)s</tbody>
      </table>
    </div>
    <p class="valorsec__nota" data-i18n="val.nota">Índice de valor = puntos SCA obtenidos por cada $1.000 de costo por taza. Un café de competencia a $7.188 la taza sigue costando menos que un café de cafetería de especialidad.</p>
  </div>
</section>""" % dict(filas=filas)


def sec_quiz():
    pasos = ""
    for i, p in enumerate(QUIZ["preguntas"]):
        ops = "".join(
            '<button type="button" class="qz__op" data-q="%s" data-v="%s"><span class="qz__emo">%s</span>%s</button>'
            % (p["id"], v, e, t) for v, e, t in p["ops"])
        pasos += '<div class="qz__step%s" data-step="%d"><h3>%s</h3><div class="qz__ops">%s</div></div>' % (
            " is-active" if i == 0 else "", i, p["titulo"], ops)
    return """
<section class="quiz" id="quiz">
  <div class="wrap">
    <div class="kicker kicker--hot" data-i18n="qz.kicker">✨ Test rápido · 30 segundos</div>
    <h2 data-i18n="qz.title">21 cafés son muchos.<br><em>Encontremos el tuyo en 30 segundos.</em></h2>
    <p class="sec-sub" data-i18n="qz.sub">Cuatro preguntas, treinta segundos. Te decimos exactamente cuál pedir y por qué.</p>
    <div class="qz" id="qz">
      <div class="qz__bar"><i id="qzBar"></i></div>
      %(pasos)s
      <div class="qz__step qz__result" data-step="99">
        <h3 data-i18n="qz.rTitle">Tu café es…</h3>
        <div id="qzOut"></div>
        <div class="qzpromo">
          <div class="qzpromo__head">
            <span class="qzpromo__gift">🎁</span>
            <h4 data-i18n="qz.promoT">Presume tu café y llévate otro gratis</h4>
          </div>
          <ol class="qzpromo__pasos">
            <li><b>1</b><span data-i18n="qz.pa1">Toma un <b>pantallazo</b> de este resultado</span></li>
            <li><b>2</b><span data-i18n="qz.pa2">Súbelo a tu <b>historia de Instagram</b> y etiquétanos</span></li>
            <li><b>3</b><span data-i18n="qz.pa3"><b>Síguenos</b> en @clubcafecol y muéstranos la historia por WhatsApp</span></li>
          </ol>
          <p class="qzpromo__premio" data-i18n="qz.promoP">Con cualquier pedido que hagas, te sumamos un <b>drip de temporada de regalo</b>. Sin letra pequeña.</p>
          <a class="btn btn--ig btn--block" href="https://instagram.com/clubcafecol" target="_blank" rel="noopener" data-i18n="qz.seguir">Seguir a @clubcafecol</a>
        </div>
        <div class="qz__foot">
          <button type="button" class="btn btn--ig" id="qzShare">
            <svg viewBox="0 0 24 24" width="17" height="17" aria-hidden="true"><path fill="currentColor" d="M12 2.16c3.2 0 3.58.01 4.85.07 1.17.05 1.8.25 2.23.41.56.22.96.48 1.38.9.42.42.68.82.9 1.38.16.42.36 1.06.41 2.23.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.05 1.17-.25 1.8-.41 2.23-.22.56-.48.96-.9 1.38-.42.42-.82.68-1.38.9-.42.16-1.06.36-2.23.41-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.05-1.8-.25-2.23-.41-.56-.22-.96-.48-1.38-.9a3.7 3.7 0 0 1-.9-1.38c-.16-.42-.36-1.06-.41-2.23-.06-1.27-.07-1.65-.07-4.85s.01-3.58.07-4.85c.05-1.17.25-1.8.41-2.23.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.42-.16 1.06-.36 2.23-.41C8.42 2.17 8.8 2.16 12 2.16M12 0C8.74 0 8.33.01 7.05.07 5.78.13 4.9.33 4.14.63a5.9 5.9 0 0 0-2.13 1.38A5.9 5.9 0 0 0 .63 4.14C.33 4.9.13 5.78.07 7.05.01 8.33 0 8.74 0 12s.01 3.67.07 4.95c.06 1.27.26 2.15.56 2.91.31.79.72 1.46 1.38 2.13a5.9 5.9 0 0 0 2.13 1.38c.76.3 1.64.5 2.91.56C8.33 23.99 8.74 24 12 24s3.67-.01 4.95-.07c1.27-.06 2.15-.26 2.91-.56a5.9 5.9 0 0 0 2.13-1.38 5.9 5.9 0 0 0 1.38-2.13c.3-.76.5-1.64.56-2.91.06-1.28.07-1.69.07-4.95s-.01-3.67-.07-4.95c-.06-1.27-.26-2.15-.56-2.91a5.9 5.9 0 0 0-1.38-2.13A5.9 5.9 0 0 0 19.86.63c-.76-.3-1.64-.5-2.91-.56C15.67.01 15.26 0 12 0m0 5.84a6.16 6.16 0 1 0 0 12.32 6.16 6.16 0 0 0 0-12.32M12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8m7.85-10.4a1.44 1.44 0 1 1-2.88 0 1.44 1.44 0 0 1 2.88 0"/></svg>
            <span data-i18n="qz.share">Compartir en mi historia</span></button>
          <button type="button" class="btn btn--ghost" id="qzReset" data-i18n="qz.again">Repetir el test</button>
        </div>
      </div>
    </div>
  </div>
</section>""" % dict(pasos=pasos)


def sec_bundles():
    items = ""
    for b in [x for x in BUNDLES if x.get("activo", True)]:
        inc = "".join("<li>%s</li>" % x for x in b["incluye"])
        gam = ""
        if b.get("gamificacion"):
            gam = ('<div class="bdl__gam"><b>🎟️ Pasaporte físico incluido</b>'
                   '<span>Completa los 21 orígenes del Club del Café, sube la foto con todos '
                   'los empaques etiquetando a @clubcafecol y te regalamos una bolsa de 250 g '
                   'de café de temporada.</span></div>')
        tach = '<s>%s</s>' % cop(b["tachado"]) if b.get("tachado") else ""
        ahorro = ('<span class="bdl__save">Ahorras %s</span>' % cop(b["tachado"] - b["precio"])) if b.get("tachado") else ""
        items += """
      <article class="bdl" data-bundle="%(id)s">
        <div class="bdl__emo">%(emoji)s</div>
        <span class="bdl__tag">%(tag)s</span>
        <h3>%(nombre)s</h3>
        <p class="bdl__desc">%(desc)s</p>
        <ul class="bdl__inc">%(inc)s</ul>
        %(gam)s
        <div class="bdl__price">%(tach)s<b>%(precio)s</b>%(ahorro)s</div>
        <button type="button" class="btn btn--add" data-add-bundle="%(id)s" data-nombre="%(nombre)s" data-precio="%(pnum)d">
          <span data-i18n="cta.add">Agregar</span></button>
      </article>""" % dict(id=b["id"], emoji=b["emoji"], tag=b["tag"], nombre=b["nombre"],
                           desc=b["desc"], inc=inc, tach=tach, precio=cop(b["precio"]),
                           ahorro=ahorro, pnum=b["precio"], gam=gam)
    return """
<section class="bundles" id="kits">
  <div class="wrap">
    <div class="kicker kicker--hot" data-i18n="bdl.kicker">🎁 Kits y experiencias</div>
    <h2 data-i18n="bdl.title">Combinaciones que <em>valen más juntas</em></h2>
    <div class="bundles__grid">%(items)s</div>
  </div>
</section>""" % dict(items=items)


def sec_club():
    cards = ""
    for c in CLUB:
        ben = "".join("<li>%s</li>" % b for b in c["beneficios"])
        cards += """
      <article class="club__card%(pop)s">
        %(poptag)s
        <div class="club__lvl">%(icon)s %(nombre)s</div>
        <div class="club__price">%(precio)s<span>/mes</span></div>
        <div class="club__taza">≈ %(taza)s por taza</div>
        <ul>%(ben)s</ul>
        <a class="btn btn--club" href="%(wa)s" target="_blank" rel="noopener" data-sub="%(nombre)s" data-valor="%(pnum)d">
          <span data-i18n="cta.sub">Suscribirme</span> →</a>
      </article>""" % dict(
            pop=" is-popular" if c.get("popular") else "",
            poptag='<div class="club__pop" data-i18n="club.pop">Más popular</div>' if c.get("popular") else "",
            icon=c["icon"], nombre=c["nombre"], precio=cop(c["precio"]),
            taza=cop(round(c["precio"] / 16)), ben=ben, pnum=c["precio"],
            wa=wa("Hola CLUBCAFECOL, quiero suscribirme al Club %s (%s/mes). Mi ciudad es ____ y preparo el café en ____. ¿Cómo activo la suscripción?" % (c["nombre"], cop(c["precio"]))))
    return """
<section class="club" id="club">
  <div class="wrap">
    <div class="kicker" data-i18n="club.kicker">Suscripción mensual</div>
    <h2 data-i18n="club.title">Club de Temporada</h2>
    <p class="sec-sub" data-i18n="club.sub">Un café distinto cada mes, curado para tu nivel. Sin permanencia: cancelas cuando quieras.</p>
    <div class="club__grid">%(cards)s</div>
  </div>
</section>""" % dict(cards=cards)


def sec_lealtad():
    niveles = "".join(
        '<div class="lv"><div class="lv__ico">%s</div><h3>%s</h3>'
        '<div class="lv__desde">%s</div><ul>%s</ul></div>'
        % (n["icon"], n["nombre"],
           "Desde el primer pedido" if n["desde"] == 0 else "Desde %s puntos" % f"{n['desde']:,}".replace(",", "."),
           "".join("<li>%s</li>" % b for b in n["benef"]))
        for n in LEALTAD["niveles"])
    canje = "".join('<div class="cj"><b>%s</b><span>%s</span></div>' % (p, r)
                    for p, r in LEALTAD["canje"])
    return """
<section class="lealtad" id="lealtad">
  <div class="wrap">
    <div class="kicker kicker--hot" data-i18n="ly.kicker">⭐ Club de la Semilla · programa de puntos</div>
    <h2 data-i18n="ly.title">Cada taza <em>te acerca al próximo café gratis</em></h2>
    <p class="sec-sub" data-i18n="ly.sub">Acumulas 1 punto por cada $1.000 de compra, seas suscriptor o no. Los niveles suben solos y los puntos se canjean por café de verdad, no por descuentos. No caducan mientras compres al menos una vez al año.</p>
    <h3 class="lealtad__h3" data-i18n="ly.niveles">Niveles</h3>
    <div class="lealtad__grid">%(niveles)s</div>
    <div class="canje">
      <h3 data-i18n="ly.canje">En qué se convierten tus puntos</h3>
      <div class="canje__grid">%(canje)s</div>
    </div>
    <div class="napa">
      <div class="napa__ico">🎁</div>
      <div class="napa__txt">
        <h3 data-i18n="ly.napaT">Y la ñapa, que nunca falta</h3>
        <p data-i18n="ly.napaP">Como en la tienda de la esquina: en todo pedido desde <b>%(napa)s</b> te metemos <b>%(napaR)s</b> sin que lo pidas. No es un descuento, es un gesto.</p>
      </div>
    </div>
    <div class="lealtad__cta">
      <a class="btn btn--gold btn--lg" href="%(wa)s" target="_blank" rel="noopener" data-i18n="ly.cta">Activar mi cuenta de puntos</a>
      <p data-i18n="ly.nota">Se activa con tu número de WhatsApp: no hay que registrarse ni crear contraseña.</p>
    </div>
  </div>
</section>""" % dict(niveles=niveles, canje=canje,
                     napa=cop(NAPA["desde"]), napaR=NAPA["regalo"],
                     wa=wa("Hola CLUBCAFECOL, quiero activar mi cuenta del Club de la Semilla para acumular puntos. Mi nombre es ____."))


def sec_referidos():
    return """
<section class="refer" id="referidos">
  <div class="wrap refer__in">
    <div class="refer__txt">
      <div class="kicker kicker--hot" data-i18n="rf.kicker">🔥 Programa de referidos</div>
      <h2 data-i18n="rf.title">Trae a un amigo<br><em>y el café va por la casa</em></h2>
      <p data-i18n="rf.sub">Pide tu enlace por WhatsApp y compártelo con quien quieras. Tu amigo estrena con %(dto)s%% de descuento en su primera compra y, cuando esa compra se confirme, tú recibes %(premio)s %(cuando)s, o %(pts)s puntos si prefieres. Sin tope: si traes cinco, ganas cinco veces.</p>
      <div class="refer__steps">
        <div><b>1</b><span data-i18n="rf.s1">Pides tu enlace único</span></div>
        <div><b>2</b><span data-i18n="rf.s2">Tu amigo compra con %(dto)s%% off</span></div>
        <div><b>3</b><span data-i18n="rf.s3">Tú recibes tu recompensa</span></div>
      </div>
      <a class="btn btn--gold btn--lg" href="%(wa)s" target="_blank" rel="noopener" data-i18n="rf.cta">Quiero mi enlace de referido</a>
    </div>
    <div class="refer__card">
      <div class="refer__badge">🎁</div>
      <div class="refer__big">%(dto)s%%</div>
      <p data-i18n="rf.card1">de descuento para quien invites</p>
      <div class="refer__sep"></div>
      <div class="refer__big refer__big--alt">%(premio)s</div>
      <p data-i18n="rf.card2">para ti, por cada amigo que compre</p>
    </div>
  </div>
</section>""" % dict(dto=REFERIDOS["dto_amigo"], premio=REFERIDOS["premio_referente"],
                     pts=f"{REFERIDOS['puntos_referente']:,}".replace(",", "."), cuando=REFERIDOS["cuando"],
                     wa=wa("Hola CLUBCAFECOL, quiero mi enlace de referido para invitar amigos al club. Mi nombre es ____."))


def sec_testimonios():
    items = "".join(
        '<figure class="tst" lang="%s"><div class="tst__stars">%s</div><blockquote>%s</blockquote>'
        '<figcaption><b>%s</b><span>%s %s · %s</span></figcaption></figure>'
        % (t.get("lang", "es"), "★" * t["r"], t["q"], t["n"], t.get("p", ""), t["c"], t["t"])
        for t in TESTIMONIOS)
    return """
<section class="testi" id="opiniones">
  <div class="wrap">
    <div class="kicker kicker--hot" data-i18n="tst.kicker">⭐ Lo que dicen quienes ya lo probaron</div>
    <h2 data-i18n="tst.title">Confianza que <em>se toma</em></h2>
    <p class="sec-sub" data-i18n="tst.sub">De Bogotá a Tokio: despachamos a Estados Unidos, Europa, Brasil y Asia con guía rastreable.</p>
    <div class="testi__grid">%(items)s</div>
    <div class="trustbar">
      <div class="trustbar__i"><b>🔒</b><span data-i18n="trust.t1">Pago confirmado antes de despachar</span></div>
      <div class="trustbar__i"><b>📦</b><span data-i18n="trust.t2">Empacado al vacío tras el tueste</span></div>
      <div class="trustbar__i"><b>🛡️</b><span data-i18n="trust.t3"><strong>Garantía de Satisfacción 100%%</strong>Si tu café no llega perfecto, lo solucionamos de inmediato</span></div>
      <div class="trustbar__i"><b>🧾</b><span data-i18n="trust.t4">NIT %(nit)s · empresa registrada</span></div>
    </div>
  </div>
</section>""" % dict(items=items, nit=NIT)


def sec_faq():
    items = "".join(
        '<details class="faq__i"><summary>%s</summary><div class="faq__a">%s</div></details>'
        % (q, "".join('<p>%s</p>' % x for x in a.split("\n\n")))
        for q, a in FAQ)
    return """
<section class="faq" id="faq">
  <div class="wrap">
    <div class="kicker" data-i18n="faq.kicker">Preguntas frecuentes</div>
    <h2 data-i18n="faq.title">Todo lo que <em>deberías preguntar</em></h2>
    <div class="faq__list">%(items)s</div>
  </div>
</section>""" % dict(items=items)


# ═══════════════════════════════════════════════════════════════════════
#  DOCUMENTO
# ═══════════════════════════════════════════════════════════════════════
def build():
    v = "?v=" + ASSET_VER
    cards = "".join(card(s, i) for i, s in enumerate(SKUS))

    # Mosaico del catálogo editorial: 6 etiquetas representativas de las 4 colecciones
    mosaico = ["pre-008", "pre-007", "tem-007", "pre-004", "ori-002", "res-001"]
    nombres = {"pre-008": "CORONA · Geisha Top, Campeón Nacional",
               "pre-007": "BOURBON PASIÓN · Subcampeón Nacional",
               "tem-007": "TÉ SALVAJE · Wush Wush",
               "pre-004": "ARÁNDANOS · Landrace",
               "ori-002": "PANELA DORADA · Caturra",
               "res-001": "MORA DE NIEBLA · Moka"}
    dlart = "".join(
        '<picture><source srcset="assets/productos/%s.webp" type="image/webp">'
        '<img src="assets/productos/%s.jpg" alt="Etiqueta %s" loading="lazy" '
        'decoding="async" width="760" height="1429"></picture>' % (k, k, nombres[k])
        for k in mosaico)
    hreflang = "\n".join(
        '<link rel="alternate" hreflang="%s" href="%s/">' % (c, SITE) for c, _, _ in LANGS)
    langopts = "".join(
        '<button type="button" class="lang__op" data-lang="%s"><span>%s</span>%s</button>' % (c, f, n)
        for c, n, f in LANGS)

    skus_json = json.dumps([{
        "id": s["id"], "nombre": s["nombre"], "col": s["col"], "varietal": s["varietal"],
        "proceso": s["proceso"], "msnm": s["msnm"], "sca": s.get("sca"), "cuerpo": s["cuerpo"],
        "origen": s["origen"], "notas": s["notas"], "precios": s["precios"],
        "taza": s["taza"], "valor": s["valor"], "img": s["img"],
        "premio": s.get("premio"), "exotico": s.get("exotico", False),
        "deca": s.get("bajo_cafeina", False), "proc": s.get("proc_txt"),
        "resenas": s.get("resenas"), "stock": s.get("stock"),
        "dest": s["destacado"],
    } for s in SKUS], ensure_ascii=False)

    bundles_json = json.dumps([{"id": b["id"], "nombre": b["nombre"], "precio": b["precio"]}
                               for b in BUNDLES if b.get("activo", True)], ensure_ascii=False)
    mol_json = json.dumps([{"v": v, "l": l} for v, l in MOLIENDAS], ensure_ascii=False)

    html = """<!DOCTYPE html>
<html lang="es" dir="ltr">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<meta name="theme-color" content="#07101F">
<title>Café de especialidad colombiano | 21 variedades SCA 82-89 | CLUBCAFECOL</title>
<meta name="description" content="Compra café de especialidad colombiano: 21 variedades de 82 a 89 puntos SCA, incluida la Campeona Nacional. Tostado bajo pedido, molienda gratis y envío a toda Colombia desde $30.900.">
<meta name="author" content="CLUBCAFECOL">
<meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1">
<link rel="canonical" href="%(site)s/">
%(hreflang)s
<link rel="alternate" hreflang="x-default" href="%(site)s/">

<meta property="og:type" content="website">
<meta property="og:site_name" content="CLUBCAFECOL">
<meta property="og:locale" content="es_CO">
<meta property="og:title" content="Café de especialidad colombiano — 21 variedades, SCA 82-89">
<meta property="og:description" content="Campeones Nacionales directos a tu taza. Tostado bajo pedido, molienda sin costo, envío gratis desde $85.000.">
<meta property="og:image" content="%(site)s/assets/productos/pre-008.jpg">
<meta property="og:image:alt" content="Etiqueta del café CORONA, Geisha Top Roast, Campeón Nacional">
<meta property="og:url" content="%(site)s/">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="CLUBCAFECOL — Café de especialidad del Huila">
<meta name="twitter:description" content="21 variedades SCA 82-89. Tostado bajo pedido. Envío a toda Colombia.">
<meta name="twitter:image" content="%(site)s/assets/productos/pre-008.jpg">

<link rel="icon" type="image/jpeg" href="assets/img/logo.jpg">
<link rel="apple-touch-icon" href="assets/img/logo.jpg">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,500;0,700;1,500&family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
<link rel="preload" as="image" href="assets/productos/pre-008.webp" type="image/webp">
<link rel="stylesheet" href="styles.css%(v)s">

<script type="application/ld+json">
%(jsonld)s
</script>

<!-- ══ ANALÍTICA ══ Reemplaza los IDs y descomenta para activar ══════════ -->
<script>
window.CCC_CONFIG = {
  GA4_ID:  '',            /* p.ej. 'G-XXXXXXXXXX' */
  META_ID: '',            /* p.ej. '1234567890'   */
  WA_NUM:  '%(wa)s',
  ENVIO_GRATIS: %(envio)d,
  ASSET_VER: '%(ver)s'
};
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
(function(){
  var c = window.CCC_CONFIG;
  if (c.GA4_ID) {
    var g = document.createElement('script'); g.async = true;
    g.src = 'https://www.googletagmanager.com/gtag/js?id=' + c.GA4_ID;
    document.head.appendChild(g);
    gtag('js', new Date()); gtag('config', c.GA4_ID, {currency:'COP'});
  }
  if (c.META_ID) {
    !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
    n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
    n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
    t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}
    (window,document,'script','https://connect.facebook.net/en_US/fbevents.js');
    fbq('init', c.META_ID); fbq('track', 'PageView');
  }
})();
</script>
</head>
<body>
<a class="skip" href="#catalogo">Saltar al catálogo</a>

<!-- ══ BARRA DE ANUNCIO ═════════════════════════════════════════════════ -->
<div class="topbar" id="topbar">
  <span data-i18n="top.msg">☕ Tostamos bajo pedido · Envío gratis desde %(enviofmt)s · Molienda sin costo</span>
</div>

<!-- ══ NAVEGACIÓN ═══════════════════════════════════════════════════════ -->
<header class="nav" id="nav">
  <div class="nav__in">
    <a class="nav__brand" href="#top"><img src="assets/img/logo.jpg" alt="CLUBCAFECOL" width="40" height="40"><span>CLUBCAFECOL</span></a>
    <nav class="nav__links" aria-label="Principal">
      <a href="#origen" data-i18n="nav.origen">Origen</a>
      <a href="#trofeos" data-i18n="nav.trofeos">Premiados</a>
      <a href="#quiz" data-i18n="nav.quiz">Test</a>
      <a href="#catalogo" data-i18n="nav.catalogo">Catálogo</a>
      <a href="#kits" data-i18n="nav.kits">Kits</a>
      <a href="#club" data-i18n="nav.club">Club</a>
      <a href="#lealtad" data-i18n="nav.puntos">Puntos</a>
      <a href="#faq" data-i18n="nav.faq">FAQ</a>
    </nav>
    <div class="nav__tools">
      <div class="lang" id="lang">
        <button type="button" class="lang__btn" id="langBtn" aria-haspopup="true" aria-expanded="false" aria-label="Cambiar idioma">
          <svg viewBox="0 0 24 24" width="17" height="17" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="1.7" d="M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18Zm0 0c-2.5 2.3-3.8 5.4-3.8 9s1.3 6.7 3.8 9m0-18c2.5 2.3 3.8 5.4 3.8 9s-1.3 6.7-3.8 9M3.5 9h17m-17 6h17"/></svg>
          <span id="langCur">ES</span>
        </button>
        <div class="lang__menu" id="langMenu" role="menu">%(langopts)s</div>
      </div>
      <button type="button" class="cartbtn" id="cartBtn" aria-label="Abrir carrito">
        <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" d="M3 4h2.2l2 12.2a2 2 0 0 0 2 1.7h8.4a2 2 0 0 0 2-1.6L21 8H6.2M10 21a1 1 0 1 0 0-2 1 1 0 0 0 0 2Zm8 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z"/></svg>
        <span class="cartbtn__n" id="cartCount" hidden>0</span>
      </button>
      <a class="btn btn--gold nav__cta" href="#catalogo" data-i18n="nav.cta">Pedir ahora</a>
      <button type="button" class="burger" id="burger" aria-label="Menú" aria-expanded="false"><span></span><span></span><span></span><i data-i18n="nav.menu">Menú</i></button>
    </div>
  </div>
  <div class="nav__mobile" id="navMobile">
    <a href="#trofeos" data-i18n="nav.trofeos">Premiados</a>
    <a href="#quiz" data-i18n="nav.quiz">Test</a>
    <a href="#catalogo" data-i18n="nav.catalogo">Catálogo</a>
    <a href="#kits" data-i18n="nav.kits">Kits</a>
    <a href="#club" data-i18n="nav.club">Club</a>
    <a href="#faq" data-i18n="nav.faq">FAQ</a>
    <a class="btn btn--gold" href="#catalogo" data-i18n="nav.cta">Pedir ahora</a>
  </div>
</header>

<!-- ══ HERO ═════════════════════════════════════════════════════════════ -->
<section class="hero" id="top">
  <div class="hero__bg" id="heroVideo" aria-hidden="true">
    <video class="hero__vid is-active" muted loop playsinline autoplay preload="none" poster="assets/productos/pre-008.jpg"></video>
    <video class="hero__vid" muted loop playsinline preload="none"></video>
    <div class="hero__scrim"></div>
  </div>
  <div class="wrap hero__in">
    <div class="hero__pre"><span class="dot"></span><span data-i18n="hero.pre">Café 100%% Colombiano · Tostado bajo pedido</span></div>
    <h1 data-i18n="hero.title">Tu Café de Especialidad Colombiano<em>Campeones Nacionales directos a tu Taza</em></h1>
    <p class="hero__sub" data-i18n="hero.sub">21 variedades de café de especialidad de las montañas de Colombia, con 82 a 89 puntos SCA. Tostados el día de tu pedido y molidos a la medida de tu cafetera.</p>
    <div class="hero__cta">
      <a class="btn btn--gold btn--lg" href="#catalogo" data-i18n="hero.cta1">Ver las 21 variedades</a>
      <a class="btn btn--hot btn--lg" href="#quiz" data-i18n="hero.cta2">✨ Ayúdame a elegir</a>
    </div>
    <div class="hero__stats">
      <div><b>21</b><span data-i18n="hero.s1">variedades únicas</span></div>
      <div><b>SCA 82–89</b><span data-i18n="hero.s2">puntaje de catación</span></div>
      <div><b>1.650+</b><span data-i18n="hero.s3">msnm de altura</span></div>
      <div><b>24 h</b><span data-i18n="hero.s4">del tueste al despacho</span></div>
    </div>
  </div>
</section>

<!-- ══ PILARES ══════════════════════════════════════════════════════════ -->
<section class="pilares">
  <div class="wrap pilares__grid">
    <div class="pilar"><div class="pilar__i">🌄</div><h3 data-i18n="pil.t1">Del grano a tu taza.</h3><p data-i18n="pil.d1">Fincas propias en Huila, Santander, Valle del Cauca, Cauca y Nariño, entre 1.650 y 1.700 msnm. Somos caficultores, sin intermediarios.</p></div>
    <div class="pilar"><div class="pilar__i">🔥</div><h3 data-i18n="pil.t2">Tueste bajo pedido</h3><p data-i18n="pil.d2">Tostamos en pequeñas cantidades el mismo día que compras. Nunca café de bodega.</p></div>
    <div class="pilar"><div class="pilar__i">⚙️</div><h3 data-i18n="pil.t3">Molienda a tu medida</h3><p data-i18n="pil.d3">Eliges el método al agregar el café — espresso, V60, prensa, moka — y molemos sin costo.</p></div>
    <div class="pilar"><div class="pilar__i">🚚</div><h3 data-i18n="pil.t4">Entrega rápida</h3><p data-i18n="pil.d4">Empacado al vacío tras el tueste. Bogotá 24-48 h, resto del país 2-5 días.</p></div>
  </div>
</section>

%(origen)s
%(trofeos)s
%(valorsec)s
%(quiz)s

<!-- ══ CATÁLOGO ═════════════════════════════════════════════════════════ -->
<section class="cat" id="catalogo">
  <div class="wrap">
    <div class="kicker" data-i18n="cat.kicker">El catálogo completo</div>
    <h2 data-i18n="cat.title">Cuatro colecciones,<br><em>veintiuna variedades</em></h2>
    <div class="scaexp">
      <div class="scaexp__badge"><b>SCA</b><span>82–89</span></div>
      <div class="scaexp__txt">
        <h3 data-i18n="cat.scaT">¿Qué significa ese número?</h3>
        <p data-i18n="cat.scaP">Es el puntaje que un catador certificado le da a la taza sobre 100, siguiendo el protocolo de la <b>Specialty Coffee Association</b>. Evalúa aroma, sabor, acidez, cuerpo y dulzor. De 80 para arriba ya se considera café de especialidad: en Colombia solo una fracción muy pequeña de la cosecha llega ahí. Nuestras variedades van de <b>82 a 89</b>.</p>
      </div>
    </div>
    <div class="cat__controls">
      <div class="cat__tabs" role="tablist">
        <button type="button" class="tab is-active" data-col="all" data-i18n="tab.all">Todos <i>21</i></button>
        <button type="button" class="tab" data-col="origen" data-i18n="tab.origen">Origen <i>2</i></button>
        <button type="button" class="tab" data-col="temporada" data-i18n="tab.temporada">Temporada <i>7</i></button>
        <button type="button" class="tab" data-col="premio" data-i18n="tab.premio">Premio Nacional <i>8</i></button>
        <button type="button" class="tab" data-col="reserva" data-i18n="tab.reserva">Reserva <i>4</i></button>
      </div>
      <label class="cat__sort">
        <span class="cat__cur" id="curNote" data-i18n="cat.moneda">Precios en pesos colombianos (COP)</span>
        <span data-i18n="cat.sort">Ordenar por</span>
        <select id="sortSel">
          <option value="destacado" data-i18n="sort.dest">Recomendados</option>
          <option value="valor" data-i18n="sort.valor">Mejor relación calidad-precio</option>
          <option value="sca" data-i18n="sort.sca">Mayor puntaje SCA</option>
          <option value="precio-asc" data-i18n="sort.pasc">Precio: menor a mayor</option>
          <option value="precio-desc" data-i18n="sort.pdesc">Precio: mayor a menor</option>
        </select>
      </label>
    </div>
    <p class="cat__curada" id="curadaMsg" data-i18n="cat.curada">Empieza por la selección del fundador: las ocho variedades que mejor representan la casa.</p>
    <div class="cat__grid" id="grid">%(cards)s</div>
    <div class="cat__more" id="moreWrap">
      <button type="button" class="btn btn--hot btn--lg btn--late" id="verTodos">
        <span data-i18n="cat.verTodos">Ver las 21 variedades</span> ↓</button>
    </div>
    <div class="cat__help">
      <p data-i18n="cat.help">¿Sigues dudando? Te asesoramos gratis, sin compromiso.</p>
      <a class="btn btn--wa btn--lg" href="%(wahelp)s" target="_blank" rel="noopener" data-i18n="cat.helpCta">☕ Pregúntale al catador →</a>
    </div>
  </div>
</section>

%(bundles)s
%(club)s
%(lealtad)s
%(referidos)s
%(testi)s

<!-- ══ DESCARGA PDF (con captura de correo) ═════════════════════════════ -->
<section class="dl" id="descarga">
  <div class="wrap dl__in">
    <div class="dl__txt">
      <div class="kicker" data-i18n="dl.kicker">Catálogo editorial</div>
      <h2 data-i18n="dl.title">Las 21 Variedades,<br><em>en tu bolsillo</em></h2>
      <p data-i18n="dl.sub">Perfiles sensoriales, procesos de fermentación, altitudes y la historia de cada variedad. Te lo enviamos al correo junto con una guía de extracción y un cupón de bienvenida.</p>
      <form class="dl__form" id="dlForm" novalidate>
        <input type="email" id="dlEmail" required placeholder="tu@correo.com" aria-label="Correo electrónico" autocomplete="email">
        <button type="submit" class="btn btn--gold" data-i18n="dl.btn">Enviarme el catálogo</button>
        <label class="dl__ok"><input type="checkbox" id="dlOk" required>
          <span data-i18n="dl.legal">Autorizo el tratamiento de mis datos según la <a href="legal/politica-datos.html" target="_blank" rel="noopener">política de privacidad</a>.</span></label>
        <p class="dl__msg" id="dlMsg" role="status"></p>
      </form>
      <a class="dl__skip" href="assets/pdf/Catalogo_CLUBCAFECOL_2026_B2C.pdf" download data-i18n="dl.skip">o descárgalo directamente sin dejar tu correo</a>
    </div>
    <div class="dl__art">%(dlart)s</div>
  </div>
</section>

%(faq)s

<!-- ══ FOOTER ═══════════════════════════════════════════════════════════ -->
<footer class="ft">
  <div class="wrap ft__in">
    <div class="ft__brand">
      <img src="assets/img/logo.jpg" alt="CLUBCAFECOL" width="56" height="56">
      <p><b>CLUBCAFECOL</b><br><span data-i18n="ft.tag">Tu comunidad cafetera<br>Bogotá · Colombia</span></p>
    </div>
    <div class="ft__col">
      <h4 data-i18n="ft.cat">Catálogo</h4>
      <a href="#catalogo" data-i18n="tab.origen">Origen</a>
      <a href="#catalogo" data-i18n="tab.temporada">Temporada</a>
      <a href="#catalogo" data-i18n="tab.premio">Premio Nacional</a>
      <a href="#catalogo" data-i18n="tab.reserva">Reserva</a>
      <a href="#kits" data-i18n="nav.kits">Kits y experiencias</a>
    </div>
    <div class="ft__col">
      <h4 data-i18n="ft.emp">Empresa</h4>
      <a href="#club" data-i18n="nav.club">Club de Temporada</a>
      <a href="#lealtad" data-i18n="ft.puntos">Club de la Semilla · puntos</a>
      <a href="#referidos" data-i18n="ft.ref">Programa de referidos</a>
      <a href="#opiniones" data-i18n="ft.op">Opiniones</a>
      <a href="#faq" data-i18n="nav.faq">Preguntas frecuentes</a>
      <a href="%(wab2b)s" target="_blank" rel="noopener" data-i18n="ft.b2b">Venta a empresas (B2B)</a>
    </div>
    <div class="ft__col">
      <h4 data-i18n="ft.leg">Legal</h4>
      <a href="legal/politica-datos.html" data-i18n="ft.l1">Tratamiento de datos</a>
      <a href="legal/envios-devoluciones.html" data-i18n="ft.l2">Envíos y devoluciones</a>
      <a href="legal/terminos.html" data-i18n="ft.l3">Términos y condiciones</a>
    </div>
    <div class="ft__col">
      <h4 data-i18n="ft.con">Contacto</h4>
      <a href="https://wa.me/%(wa)s" target="_blank" rel="noopener">WhatsApp +57 315 451 0390</a>
      <a href="https://instagram.com/clubcafecol" target="_blank" rel="noopener">@clubcafecol</a>
      <a href="mailto:corporacionclubdelcafe@gmail.com">corporacionclubdelcafe@gmail.com</a>
    </div>
  </div>
  <div class="ft__bot"><div class="wrap">
    <span>© 2026 CLUBCAFECOL · NIT %(nit)s · <span data-i18n="ft.rights">Todos los derechos reservados</span></span>
    <span data-i18n="ft.sig">Envío gratis desde %(enviofmt)s · Molienda sin costo</span>
  </div></div>
</footer>

<!-- ══ CARRITO ══════════════════════════════════════════════════════════ -->
<div class="cart" id="cart" aria-hidden="true">
  <div class="cart__scrim" id="cartScrim"></div>
  <aside class="cart__panel" role="dialog" aria-modal="true" aria-labelledby="cartTitle">
    <header class="cart__head">
      <h2 id="cartTitle" data-i18n="cart.title">Tu pedido</h2>
      <button type="button" class="cart__x" id="cartClose" aria-label="Cerrar carrito">×</button>
    </header>
    <!-- Un único contenedor con scroll: evita que la lista quede aplastada
         entre varias zonas desplazables compitiendo por la altura. -->
    <div class="cart__scroll">
      <div class="cart__ship" id="cartShip"></div>
      <div class="cart__items" id="cartItems"></div>
      <div class="cart__add" id="cartAddMore" hidden>
        <button type="button" class="btn btn--ghost btn--sm" id="cartMore">
          + <span data-i18n="cart.more">Agregar más</span></button>
      </div>
      <div class="cart__empty" id="cartEmpty" hidden>
        <p data-i18n="cart.empty">Tu carrito está vacío.</p>
        <button type="button" class="btn btn--ghost btn--sm" id="cartGo" data-i18n="cart.go">Ver el catálogo</button>
      </div>
      <div class="cart__order" id="cartOrder" hidden>
        <div class="cart__fields">
          <label class="cart__field">
            <span data-i18n="cart.addr">Ciudad y dirección de entrega</span>
            <input type="text" id="cartAddr" placeholder="Bogotá · Cra 13 #45-32, apto 501" autocomplete="street-address">
          </label>
          <label class="cart__field">
            <span data-i18n="cart.note">Nota para el tostador (opcional)</span>
            <input type="text" id="cartNote" placeholder="Ej: es un regalo, incluir tarjeta">
          </label>
        </div>
        <div class="cart__tot">
          <div><span data-i18n="cart.sub">Subtotal</span><b id="cartSub">$0</b></div>
          <div class="cart__ship-row"><span data-i18n="cart.shipping">Envío</span><b id="cartShipTxt">—</b></div>
          <div class="cart__tot-row"><span data-i18n="cart.total">Total</span>
            <span class="cart__tot-val"><b id="cartTotal">$0</b><i id="cartTotalUsd"></i></span></div>
        </div>
      </div>
    </div>
    <footer class="cart__foot" id="cartFoot" hidden>
      <button type="button" class="btn btn--wa btn--lg btn--block" id="cartCheckout">
        <span data-i18n="cart.checkout">Enviar pedido por WhatsApp</span> →</button>
      <p class="cart__legal" data-i18n="cart.legal">Te confirmamos disponibilidad, total con envío y medio de pago antes de cobrar. No se cobra nada desde esta página.</p>
    </footer>
  </aside>
</div>

<!-- ══ MODAL DE PRODUCTO ════════════════════════════════════════════════ -->
<div class="mdl" id="mdl" aria-hidden="true">
  <div class="mdl__scrim" id="mdlScrim"></div>
  <div class="mdl__box" role="dialog" aria-modal="true" aria-labelledby="mdlName">
    <button type="button" class="mdl__x" id="mdlClose" aria-label="Cerrar">×</button>
    <div class="mdl__grid">
      <div class="mdl__media"><img id="mdlImg" alt="" width="760" height="1429" loading="lazy"></div>
      <div class="mdl__info">
        <div class="mdl__badges" id="mdlBadges"></div>
        <h3 id="mdlName"></h3>
        <p class="mdl__var" id="mdlVar"></p>
        <div class="mdl__notas" id="mdlNotas"></div>
        <dl class="mdl__specs" id="mdlSpecs"></dl>
        <div class="mdl__prices" id="mdlPrices"></div>
        <label class="mdl__mol">
          <span data-i18n="opt.mol">Molienda · sin costo</span>
          <select id="mdlMol"></select>
        </label>
        <div class="mdl__actions">
          <button type="button" class="btn btn--gold btn--block" id="mdlAdd" data-i18n="cta.addCart">Agregar al carrito</button>
          <a class="btn btn--ghost btn--block" id="mdlWa" href="#" target="_blank" rel="noopener" data-i18n="cta.waDirect">Pedir directo por WhatsApp</a>
        </div>
      </div>
    </div>
  </div>
</div>

<!-- ══ WHATSAPP FLOTANTE ════════════════════════════════════════════════ -->
<div class="wa" id="wa">
  <div class="wa__panel" id="waPanel" aria-hidden="true">
    <div class="wa__head">
      <img src="assets/img/logo.jpg" alt="" width="38" height="38">
      <div><b>CLUBCAFECOL</b><span data-i18n="wa.status">Normalmente respondemos en minutos</span></div>
      <button type="button" class="wa__x" id="waClose" aria-label="Cerrar">×</button>
    </div>
    <div class="wa__body">
      <p data-i18n="wa.greet">¡Hola! ☕ Cuéntanos qué buscas y te asesoramos en minutos:</p>
      <div class="wa__quick" id="waQuick"></div>
    </div>
  </div>
  <a class="wa__ig" id="igBtn" href="https://instagram.com/clubcafecol" target="_blank" rel="noopener"
     aria-label="Ver el origen del café en Instagram @clubcafecol">
    <span class="wa__ig-txt" data-i18n="ig.cta">Mira el origen ☕</span>
    <span class="wa__ig-ico">
      <svg viewBox="0 0 24 24" width="25" height="25" aria-hidden="true"><path fill="currentColor" d="M12 2.16c3.2 0 3.58.01 4.85.07 1.17.05 1.8.25 2.23.41.56.22.96.48 1.38.9.42.42.68.82.9 1.38.16.42.36 1.06.41 2.23.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.05 1.17-.25 1.8-.41 2.23-.22.56-.48.96-.9 1.38-.42.42-.82.68-1.38.9-.42.16-1.06.36-2.23.41-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.05-1.8-.25-2.23-.41-.56-.22-.96-.48-1.38-.9a3.7 3.7 0 0 1-.9-1.38c-.16-.42-.36-1.06-.41-2.23-.06-1.27-.07-1.65-.07-4.85s.01-3.58.07-4.85c.05-1.17.25-1.8.41-2.23.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.42-.16 1.06-.36 2.23-.41C8.42 2.17 8.8 2.16 12 2.16M12 0C8.74 0 8.33.01 7.05.07 5.78.13 4.9.33 4.14.63a5.9 5.9 0 0 0-2.13 1.38A5.9 5.9 0 0 0 .63 4.14C.33 4.9.13 5.78.07 7.05.01 8.33 0 8.74 0 12s.01 3.67.07 4.95c.06 1.27.26 2.15.56 2.91.31.79.72 1.46 1.38 2.13a5.9 5.9 0 0 0 2.13 1.38c.76.3 1.64.5 2.91.56C8.33 23.99 8.74 24 12 24s3.67-.01 4.95-.07c1.27-.06 2.15-.26 2.91-.56a5.9 5.9 0 0 0 2.13-1.38 5.9 5.9 0 0 0 1.38-2.13c.3-.76.5-1.64.56-2.91.06-1.28.07-1.69.07-4.95s-.01-3.67-.07-4.95c-.06-1.27-.26-2.15-.56-2.91a5.9 5.9 0 0 0-1.38-2.13A5.9 5.9 0 0 0 19.86.63c-.76-.3-1.64-.5-2.91-.56C15.67.01 15.26 0 12 0m0 5.84a6.16 6.16 0 1 0 0 12.32 6.16 6.16 0 0 0 0-12.32M12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8m7.85-10.4a1.44 1.44 0 1 1-2.88 0 1.44 1.44 0 0 1 2.88 0"/></svg>
    </span>
    <span class="wa__ig-dot" aria-hidden="true"></span>
  </a>
  <button type="button" class="wa__launcher" id="waLauncher" aria-label="Abrir chat de WhatsApp" aria-expanded="false">
    <svg viewBox="0 0 24 24" width="26" height="26" aria-hidden="true"><path fill="currentColor" d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.9 9.9 0 0 0 4.79 1.22c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2m5.4 13.9c-.21.59-1.23 1.15-1.69 1.19-.46.04-.88.2-2.97-.62-2.51-1-4.1-3.57-4.22-3.74-.12-.16-1.01-1.34-1.01-2.56 0-1.22.64-1.82.86-2.07.23-.25.5-.31.66-.31h.48c.15 0 .35-.06.55.42.21.49.7 1.7.76 1.83.06.12.1.26.02.43-.08.16-.12.26-.25.41-.12.14-.26.32-.37.43-.13.12-.26.25-.11.5.14.24.64 1.06 1.38 1.72.95.84 1.75 1.11 2 1.23.25.13.4.11.54-.06.14-.16.62-.72.78-.97.17-.24.33-.2.56-.12.23.09 1.45.69 1.7.82.25.12.41.18.48.28.06.11.06.61-.15 1.19"/></svg>
    <span class="wa__pulse"></span>
  </button>
  <div class="wa__bubble" data-i18n="wa.bubble">¿Te asesoramos? ☕</div>
</div>

<!-- ══ POP-UP DE INTENCIÓN DE SALIDA ════════════════════════════════════ -->
<div class="exit" id="exit" aria-hidden="true">
  <div class="exit__scrim" id="exitScrim"></div>
  <div class="exit__box" role="dialog" aria-modal="true" aria-labelledby="exitTitle">
    <button type="button" class="exit__x" id="exitClose" aria-label="Cerrar">×</button>
    <div class="exit__art">
      <picture><source srcset="assets/productos/pre-008.webp" type="image/webp">
      <img src="assets/productos/pre-008.jpg" alt="Etiqueta CORONA, Campeón Nacional" width="760" height="1429" loading="lazy"></picture>
    </div>
    <div class="exit__body">
      <div class="exit__tag" data-i18n="ex.tag">Antes de que te vayas</div>
      <h3 id="exitTitle" data-i18n="ex.title">Llévate el catálogo <em>y un 10 %% de descuento</em></h3>
      <p data-i18n="ex.sub">Te enviamos las 21 variedades en PDF y un cupón del 10 %% para tu primera compra. Un solo correo, sin spam.</p>
      <form class="exit__form" id="exitForm" novalidate>
        <input type="email" id="exitEmail" required placeholder="tu@correo.com" aria-label="Correo electrónico" autocomplete="email">
        <button type="submit" class="btn btn--gold" data-i18n="ex.btn">Quiero mi cupón</button>
        <label class="exit__ok"><input type="checkbox" id="exitOk" required>
          <span data-i18n="ex.legal">Autorizo el tratamiento de mis datos según la <a href="legal/politica-datos.html" target="_blank" rel="noopener">política de privacidad</a>.</span></label>
        <p class="exit__msg" id="exitMsg" role="status"></p>
      </form>
      <button type="button" class="exit__no" id="exitNo" data-i18n="ex.no">No, gracias</button>
    </div>
  </div>
</div>

<!-- ══ TOAST ════════════════════════════════════════════════════════════ -->
<div class="toast" id="toast" role="status" aria-live="polite"></div>

<script>window.CCC_SKUS = %(skusjson)s; window.CCC_BUNDLES = %(bundlesjson)s;
window.CCC_MOLIENDAS = %(moljson)s; window.CCC_DTO_REF = %(dtoref)d; window.CCC_USD_COP = %(usdcop)d;</script>
<script src="i18n.js%(v)s"></script>
<script src="script.js%(v)s"></script>
</body>
</html>
""" % dict(site=SITE, hreflang=hreflang, v=v, jsonld=jsonld(), wa=WA_NUM, nit=NIT,
           envio=ENVIO_GRATIS, enviofmt=cop(ENVIO_GRATIS), ver=ASSET_VER,
           langopts=langopts, cards=cards, trofeos=sec_trofeos(), valorsec=sec_valor(), quiz=sec_quiz(),
           bundles=sec_bundles(), club=sec_club(), testi=sec_testimonios(), faq=sec_faq(),
           lealtad=sec_lealtad(), referidos=sec_referidos(), dtoref=REFERIDOS["dto_amigo"],
           origen=sec_origen(),
           skusjson=skus_json, bundlesjson=bundles_json, moljson=mol_json,
           dlart=dlart, usdcop=USD_COP,
           wahelp=wa("Hola CLUBCAFECOL, necesito asesoría para elegir mi café. Preparo el café en ____ y me gustan los sabores ____. ¿Qué me recomiendan?"),
           wab2b=wa("Hola CLUBCAFECOL, represento una empresa/cafetería y quiero cotizar café de especialidad al por mayor. Consumimos aprox. ____ kg al mes."))

    open(os.path.join(ROOT, "index.html"), "w", encoding="utf-8").write(html)

    # ── robots.txt ──────────────────────────────────────────────────────
    open(os.path.join(ROOT, "robots.txt"), "w", encoding="utf-8").write(
        "User-agent: *\nAllow: /\n\nSitemap: %s/sitemap.xml\n" % SITE)

    # ── sitemap.xml ─────────────────────────────────────────────────────
    hoy = datetime.date.today().isoformat()
    urls = [(SITE + "/", "1.0", "weekly"),
            (SITE + "/legal/politica-datos.html", "0.3", "yearly"),
            (SITE + "/legal/envios-devoluciones.html", "0.4", "yearly"),
            (SITE + "/legal/terminos.html", "0.3", "yearly")]
    body = "".join(
        '<url><loc>%s</loc><lastmod>%s</lastmod><changefreq>%s</changefreq><priority>%s</priority>%s</url>\n'
        % (u, hoy, cf, pr,
           "".join('<xhtml:link rel="alternate" hreflang="%s" href="%s"/>' % (c, SITE + "/") for c, _, _ in LANGS) if u.endswith("/") else "")
        for u, pr, cf in urls)
    imgs = "".join(
        '<url><loc>%s/#%s</loc><lastmod>%s</lastmod><image:image><image:loc>%s/%s.jpg</image:loc>'
        '<image:title>%s</image:title><image:caption>%s · %s · SCA %s</image:caption></image:image></url>\n'
        % (SITE, s["id"], hoy, SITE, s["img"], s["nombre"], s["varietal"], s["proceso"], s.get("sca") or "—")
        for s in SKUS)
    open(os.path.join(ROOT, "sitemap.xml"), "w", encoding="utf-8").write(
        '<?xml version="1.0" encoding="UTF-8"?>\n'
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" '
        'xmlns:xhtml="http://www.w3.org/1999/xhtml" '
        'xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n' + body + imgs + '</urlset>\n')

    print("✓ index.html   %6.1f KB" % (len(html) / 1024))
    print("✓ robots.txt / sitemap.xml")
    sin_sca = [s["nombre"] for s in SKUS if not s.get("sca")]
    print("✓ %d SKUs · mejor valor: %s (%s/taza, índice %.1f)"
          % (len(SKUS), MEJOR_G["nombre"], cop(MEJOR_G["taza"]), MEJOR_G["valor"]))
    if sin_sca:
        print("  sin puntaje SCA (excluidos del índice): %s" % ", ".join(sin_sca))
    print("  mejor SCA 87+: %s · mejor premiado: %s" % (MEJOR_A["nombre"], MEJOR_P["nombre"]))


if __name__ == "__main__":
    build()
