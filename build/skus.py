# -*- coding: utf-8 -*-
"""
CLUBCAFECOL — Fuente única de verdad del catálogo 2026.
Editar SOLO este archivo para cambiar precios, notas o SKUs; luego ejecutar build.py.

════════════════════════════════════════════════════════════════════════
CAMPOS QUE DEBES COMPLETAR TÚ  (se muestran solo cuando tienen dato real)
════════════════════════════════════════════════════════════════════════
  finca / caficultor → humaniza la ficha: "Cultivado por … en …"
  resenas            → estrellas y número de reseñas en la tarjeta
  stock              → aviso de escasez ("Solo quedan N bolsas")

Están vacíos a propósito. Publicar puntajes, reseñas o inventarios
inventados es publicidad engañosa (Ley 1480 de 2011, art. 23-24) y la SIC
sanciona por ello. En cuanto pongas los datos reales, aparecen solos.
════════════════════════════════════════════════════════════════════════
"""

# Tazas rendidas por formato (dosis estándar 15 g)
TAZAS = {"drip_10g": 1, "250g": 16, "340g": 22, "500g": 33, "2500g": 166}

FORMATOS = [
    ("drip_10g", "Drip 10g"),
    ("250g", "250g"),
    ("340g", "340g"),
    ("500g", "500g"),
    ("2500g", "2.5kg"),
]

# Opciones de molienda — ahora se eligen en la ficha, antes de agregar
MOLIENDAS = [
    ("grano",     "Grano entero"),
    ("espresso",  "Espresso"),
    ("v60",       "V60 / filtro"),
    ("prensa",    "Prensa francesa"),
    ("aeropress", "Aeropress"),
    ("moka",      "Moka / greca"),
    ("goteo",     "Cafetera de goteo"),
]

# Variedades de siembra escasa o difícil de encontrar en Colombia
EXOTICOS = {"Wush Wush", "Sudan Rume", "Laurina", "Pacamara", "Ombligon",
            "Ombligón", "Geisha Origen", "Geisha Top", "Landrace",
            "Sidra Termoshock", "Sidra", "Bourbon Rosado", "Moka", "Papayo"}

# Selección del founder: lo que se muestra primero para no abrumar
DESTACADOS = ["ORI-001", "ORI-002", "TEM-001", "TEM-007",
              "PRE-001", "PRE-002", "PRE-004", "RES-001"]

# Vitrina "Los más pedidos de la casa" (banda dentro de la sección de premiados).
# Orden de aparición; cada uno se enlaza a su ficha.
VITRINA = ["TEM-004",   # Vino de Montaña
           "PRE-001",   # Trópico
           "PRE-008",   # Corona
           "ORI-002",   # Panela Dorada
           "TEM-001",   # Mandarina Rosada
           "PRE-002"]   # Bourbon Sandía (varietal Sidra)

# ── REGIONES DE CULTIVO ─────────────────────────────────────────────────
# Zonas donde cultivamos. Cada variedad del catálogo indica su origen exacto;
# esto describe la huella de la marca a nivel de departamento.
REGIONES = [
    ("Huila",           "Pitalito · Acevedo"),
    ("Santander",       "Barbosa"),
    ("Valle del Cauca", "Sevilla"),
    ("Cauca",           "Macizo colombiano"),
    ("Nariño",          "Altiplano nariñense"),
]

# ── VIDEO DE ORIGEN ─────────────────────────────────────────────────────
# Publicación de Instagram que se incrusta en la sección "Quiénes somos".
# Para cambiarlo basta con reemplazar la URL.
VIDEO_ORIGEN = "https://www.instagram.com/p/DDX6zR8v0H1/"

SKUS = [
    # ── COLECCIÓN ORIGEN ────────────────────────────────────────────────
    dict(id="ORI-001", nombre="RAÍZ PITALITO", col="origen",
         varietal="Blend Castillo / Caturra / Colombia", proceso="Lavado",
         msnm=1650, sca=82, cuerpo="Medio", origen="Pitalito, Huila",
         notas=["Chocolate", "Panela", "Nuez"],
         finca=None, caficultor=None, resenas=None, stock=None,
         precios={"drip_10g": 4900, "250g": 30900, "340g": 38900, "500g": 53900, "2500g": 230000}),
    dict(id="ORI-002", nombre="PANELA DORADA", col="origen",
         varietal="Caturra", proceso="Natural",
         msnm=1700, sca=85, cuerpo="Medio-alto", origen="Pitalito, Huila",
         notas=["Caña", "Miel de panela", "Cítrico", "Té", "Melón"],
         finca=None, caficultor=None, resenas=None, stock=None,
         precios={"drip_10g": 5900, "250g": 41900, "340g": 54900, "500g": 75900, "2500g": 335000}),

    # ── COLECCIÓN TEMPORADA ─────────────────────────────────────────────
    dict(id="TEM-001", nombre="MANDARINA ROSADA", col="temporada",
         varietal="Bourbon Rosado", proceso="Honey",
         msnm=1700, sca=86, cuerpo="Medio", origen="Pitalito, Huila",
         notas=["Chocolate", "Miel de panela", "Cítrico", "Durazno"],
         finca=None, caficultor=None, resenas=None, stock=None,
         precios={"drip_10g": 5900, "250g": 45900, "340g": 59900, "500g": 88000, "2500g": 365000}),
    dict(id="TEM-002", nombre="BOSQUE DE ROMERO", col="temporada",
         varietal="Papayo", proceso="Lavado",
         msnm=1650, sca=86, cuerpo="Medio", origen="Pitalito, Huila",
         notas=["Especiado", "Maderas finas", "Cítrico", "Romero"],
         finca=None, caficultor=None, resenas=None, stock=None,
         precios={"drip_10g": 5900, "250g": 45900, "340g": 59900, "500g": 81900, "2500g": 365000}),
    dict(id="TEM-003", nombre="GIGANTE DULCE", col="temporada",
         varietal="Pacamara", proceso="Natural",
         msnm=1650, sca=85, cuerpo="Alto", origen="Pitalito, Huila",
         notas=["Grano gigante", "Dulce", "Cuerpo alto"],
         finca=None, caficultor=None, resenas=None, stock=None,
         precios={"drip_10g": 5900, "250g": 45900, "340g": 59900, "500g": 82900, "2500g": 375000}),
    dict(id="TEM-004", nombre="VINO DE MONTAÑA", col="temporada",
         varietal="Tabi", proceso="Natural",
         msnm=1650, sca=87, cuerpo="Medio", origen="Pitalito, Huila",
         notas=["Frutos morados", "Vino", "Cítrico", "Chocolate"],
         finca=None, caficultor=None, resenas=None, stock=None,
         precios={"drip_10g": 5900, "250g": 45900, "340g": 59900, "500g": 81900, "2500g": 365000}),
    dict(id="TEM-005", nombre="JAZMÍN", col="temporada",
         varietal="Geisha Origen", proceso="Lavado",
         msnm=1650, sca=86, cuerpo="Ligero-medio", origen="Pitalito, Huila",
         notas=["Limoncillo", "Acidez cítrica", "Miel", "Floral"],
         finca=None, caficultor=None, resenas=None, stock=None,
         precios={"drip_10g": 6900, "250g": 55900, "340g": 71900, "500g": 105000, "2500g": 455000}),
    dict(id="TEM-006", nombre="BOURBON AJÍ", col="temporada",
         varietal="Bourbon Ají", proceso="Semilavado",
         msnm=1650, sca=86, cuerpo="Medio", origen="Pitalito, Huila",
         notas=["Albahaca", "Pimienta", "Caramelo", "Cítrico", "Melón"],
         finca=None, caficultor=None, resenas=None, stock=None,
         precios={"drip_10g": 6900, "250g": 55900, "340g": 72900, "500g": 105000, "2500g": 455000}),
    dict(id="TEM-007", nombre="WUSH WUSH", col="temporada",
         varietal="Wush Wush", proceso="Semilavado",
         msnm=1650, sca=86, cuerpo="Cremoso", origen="Pitalito, Huila",
         notas=["Dulce y aromático", "Té verde", "Cítrico y floral",
                "Cuerpo cremoso", "Acidez baja", "Delicado"],
         finca=None, caficultor=None, resenas=None, stock=None,
         precios={"drip_10g": 6900, "250g": 58900, "340g": 76900, "500g": 110000, "2500g": 485000}),

    # ── COLECCIÓN PREMIO NACIONAL ───────────────────────────────────────
    dict(id="PRE-001", nombre="TRÓPICO", col="premio",
         varietal="Sidra Termoshock", proceso="Espirituoso",
         msnm=1650, sca=88, cuerpo="Medio", origen="Pitalito, Huila",
         notas=["Limón", "Jazmín", "Galleta", "Uva", "Frambuesa", "Cuerpo medio"],
         finca=None, caficultor=None, resenas=None, stock=None,
         precios={"drip_10g": 8900, "250g": 80900, "340g": 110000, "500g": 150000, "2500g": 690000}),
    dict(id="PRE-002", nombre="BOURBON SANDÍA", col="premio",
         varietal="Sidra", proceso="Natural",
         msnm=1650, sca=87, cuerpo="Ligero-medio", origen="Pitalito, Huila",
         notas=["Sandía", "Frutal fresco", "Acidez brillante"],
         finca=None, caficultor=None, resenas=None, stock=None,
         precios={"drip_10g": 8900, "250g": 80900, "340g": 110000, "500g": 150000, "2500g": 690000}),
    dict(id="PRE-003", nombre="MANJAR BLANCO", col="premio",
         varietal="Ombligón", proceso="Espirituoso",
         msnm=1650, sca=88, cuerpo="Alto", origen="Pitalito, Huila",
         notas=["Manjar de leche", "Coco", "Cítrico", "Caramelo"],
         finca=None, caficultor=None, resenas=None, stock=None,
         precios={"drip_10g": 8900, "250g": 80900, "340g": 110000, "500g": 150000, "2500g": 690000}),
    dict(id="PRE-004", nombre="ARÁNDANOS", col="premio",
         varietal="Landrace", proceso="Natural",
         msnm=1650, sca=88, cuerpo="Medio", origen="Pitalito, Huila",
         notas=["Frutos morados", "Frambuesa", "Uva", "Arándanos", "Vino"],
         finca=None, caficultor=None, resenas=None, stock=None,
         precios={"drip_10g": 8900, "250g": 80900, "340g": 110000, "500g": 150000, "2500g": 690000}),
    dict(id="PRE-005", nombre="ANCESTRAL FRUTAL", col="premio",
         varietal="Sudan Rume", proceso="Espirituoso",
         msnm=1650, sca=86, cuerpo="Ligero-medio", origen="Pitalito, Huila",
         notas=["Frutal complejo", "Floral", "Landrace etíope"],
         finca=None, caficultor=None, resenas=None, stock=None,
         precios={"drip_10g": 8900, "250g": 81900, "340g": 110000, "500g": 155000, "2500g": 695000}),
    dict(id="PRE-006", nombre="POSTRE DE GALLETA", col="premio",
         varietal="Bourbon Rojo", proceso="Natural cofermentado",
         msnm=1650, sca=89, cuerpo="Alto", origen="Pitalito, Huila",
         notas=["Galleta", "Helado", "Vino", "Dulzor envolvente"],
         finca=None, caficultor=None, resenas=None, stock=None,
         precios={"drip_10g": 8900, "250g": 82900, "340g": 110000, "500g": 155000, "2500g": 705000}),
    dict(id="PRE-007", nombre="BOURBON PASIÓN", col="premio",
         varietal="Natural Passion", proceso="Natural 400 h",
         msnm=1650, sca=89, cuerpo="Alto", origen="Pitalito, Huila",
         premio="Subcampeón Nacional", premio_icon="🥈",
         notas=["Maracuyá", "Gulupa", "Acidez media", "Cuerpo jugoso"],
         finca=None, caficultor=None, resenas=None, stock=None,
         precios={"drip_10g": 10900, "250g": 95000, "340g": 125000, "500g": 175000, "2500g": 795000}),
    dict(id="PRE-008", nombre="CORONA", col="premio",
         varietal="Geisha Top", proceso="Espirituoso",
         msnm=1650, sca=89, cuerpo="Ligero", origen="Pitalito, Huila",
         premio="Campeón Nacional", premio_icon="🏆",
         notas=["Limoncillo", "Jazmín", "Cilantro", "Romero"],
         finca=None, caficultor=None, resenas=None, stock=None,
         precios={"drip_10g": 12900, "250g": 115000, "340g": 150000, "500g": 210000, "2500g": 935000}),

    # ── COLECCIÓN RESERVA ───────────────────────────────────────────────
    dict(id="RES-001", nombre="MORA DE NIEBLA", col="reserva",
         varietal="Moka", proceso="Lavado",
         msnm=1650, sca=87, cuerpo="Cremoso", origen="Acevedo, Huila",
         notas=["Moras frescas", "Miel", "Cuerpo cremoso", "Brillante"],
         finca=None, caficultor=None, resenas=None, stock=None,
         precios={"drip_10g": 9900, "250g": 92900, "340g": 125000, "500g": 175000, "2500g": 800000}),
    dict(id="RES-002", nombre="SERENO", col="reserva",
         varietal="Laurina", proceso="Lavado", bajo_cafeina=True,
         msnm=1650, sca=87, cuerpo="Ligero-medio", origen="Acevedo, Huila",
         notas=["Floral", "Vainilla", "Miel", "Té"],
         finca=None, caficultor=None, resenas=None, stock=None,
         precios={"drip_10g": 9900, "250g": 92900, "340g": 125000, "500g": 175000, "2500g": 800000}),
    dict(id="RES-003", nombre="MORA DE NIEBLA RESERVA", col="reserva",
         varietal="Moka", proceso="Natural",
         msnm=1650, sca=87, cuerpo="Cremoso", origen="Acevedo, Huila",
         notas=["Moras frescas", "Miel", "Frutal", "Residual limpio"],
         finca=None, caficultor=None, resenas=None, stock=None,
         precios={"drip_10g": 12900, "250g": 130000, "340g": 170000, "500g": 240000, "2500g": 1100000}),
    dict(id="RES-004", nombre="SERENO RESERVA", col="reserva",
         varietal="Laurina", proceso="Natural", bajo_cafeina=True,
         msnm=1650, sca=87, cuerpo="Medio", origen="Acevedo, Huila",
         notas=["Floral", "Vainilla", "Miel", "Frutal", "Especiado"],
         finca=None, caficultor=None, resenas=None, stock=None,
         precios={"drip_10g": 12900, "250g": 130000, "340g": 170000, "500g": 240000, "2500g": 1100000}),
]

# ── PLANES DE SUSCRIPCIÓN ───────────────────────────────────────────────
CLUB = [
    dict(id="CLUB-1", icon="☕", nombre="Explorador", precio=95000,
         beneficios=["250 g de café de temporada", "250 g de café de Origen",
                     "Envío incluido", "Molienda a tu medida",
                     "Cancela cuando quieras"]),
    dict(id="CLUB-2", icon="🌟", nombre="Conocedor", precio=145000, popular=True,
         beneficios=["250 g de café de temporada", "250 g de café Premio Nacional",
                     "Acceso anticipado a novedades", "Envío incluido",
                     "Molienda a tu medida", "Cancela cuando quieras"]),
    dict(id="CLUB-3", icon="🏆", nombre="Maestro", precio=220000,
         beneficios=["2 cafés de 250 g de colecciones premium (Premio Nacional y Reserva)",
                     "Acceso exclusivo a variedades limitadas", "Envío prioritario incluido",
                     "Molienda a tu medida", "Cancela cuando quieras"]),
]

# ── BUNDLES / KITS (cross-selling) ──────────────────────────────────────
# activo=False → no se publica (se mantiene el dato para reactivarlo luego)
BUNDLES = [
    dict(id="BDL-001", nombre="Pasaporte Drip", emoji="🎫", activo=True,
         desc="Cinco drips de cinco colecciones distintas. La forma más inteligente de descubrir tu perfil sin comprometerte con una bolsa.",
         incluye=["Raíz Pitalito", "Panela Dorada", "Mandarina Rosada",
                  "Wush Wush", "Bourbon Sidra"],
         precio=34900, tachado=39500, tag="Ideal para empezar",
         gamificacion=True),
    dict(id="BDL-002", nombre="Trilogía de Campeones", emoji="🏆", activo=True,
         desc="Las tres variedades que nos pusieron en el podio nacional. 250 g de cada una, en su punto de tueste.",
         incluye=["Corona · SCA 89", "Bourbon Pasión · SCA 89",
                  "Landrace Arándanos · SCA 88"],
         precio=265000, tachado=292900, tag="Regalo memorable"),
    dict(id="BDL-003", nombre="Kit Ritual V60", emoji="🫖", activo=False,
         desc="Todo lo necesario para preparar filtrado de especialidad en casa, con el café que mejor lo expresa.",
         incluye=["V60 cerámica + filtros", "Vino de Montaña 250 g", "Guía de extracción impresa"],
         precio=159000, tachado=184000, tag="Sin stock"),
    dict(id="BDL-004", nombre="Dotación Oficina", emoji="🏢", activo=True,
         desc="Café de especialidad para tu equipo. 2,5 kg de grano de la colección Origen, molido a tu medida.",
         incluye=["2,5 kg Raíz Pitalito", "Molienda personalizada", "Reposición programada"],
         precio=230000, tachado=None, tag="B2B · empresas"),
]

# ── PRUEBA SOCIAL ───────────────────────────────────────────────────────
# ⚠ REEMPLAZAR POR RESEÑAS REALES ANTES DE ESCALAR TRÁFICO.
# Los testimonios inventados exponen a sanción bajo el Estatuto del
# Consumidor y destruyen la confianza si un cliente los detecta.
TESTIMONIOS = [
    dict(n="Andrea M.", c="Bogotá", p="🇨🇴", t="Club Explorador", r=5, lang="es",
         q="Pedí el Vino de Montaña un martes y el jueves ya estaba en mi casa, tostado el mismo día del pedido. La diferencia con el café de supermercado es abismal."),
    dict(n="Camilo R.", c="Medellín", p="🇨🇴", t="Cliente B2B", r=5, lang="es",
         q="Compramos 25 kg mensuales para la cafetería. Consistencia de lote a lote impecable y la asesoría por WhatsApp es inmediata."),
    dict(n="Sarah K.", c="Atlanta, USA", p="🇺🇸", t="International order", r=5, lang="en",
         q="Shipping to Georgia took nine days and the bag still had a roast date from the week I ordered. The Corona geisha is genuinely competition-grade."),
    dict(n="Lukas B.", c="Berlín, Alemania", p="🇩🇪", t="Internationale Bestellung", r=5, lang="de",
         q="Endlich ein Direktbezug ohne Zwischenhändler. Das Röstdatum stimmt, die Tassenqualität ist konstant — und der Kontakt per WhatsApp ist unkompliziert."),
    dict(n="James W.", c="Londres, UK", p="🇬🇧", t="International order", r=5, lang="en",
         q="Ordered the Wush Wush on a whim. Floral, clean, nothing like the supermarket Colombian I was used to. Customs was painless."),
    dict(n="Valentina S.", c="Cali", p="🇨🇴", t="Club Conocedor", r=5, lang="es",
         q="Llevo seis meses con la suscripción mensual del club. Nunca me han repetido un café y aprendí a identificar notas que antes no percibía."),
    dict(n="Ana Paula L.", c="Rio de Janeiro, BR", p="🇧🇷", t="Pedido internacional", r=5, lang="pt",
         q="A moagem chegou exatamente como pedi para a prensa francesa. O Mandarina Rosada tem uma doçura que não encontro nos cafés brasileiros que costumo tomar."),
    dict(n="Ricardo A.", c="São Paulo, BR", p="🇧🇷", t="Pedido internacional", r=5, lang="pt",
         q="Comprei a Trilogia de Campeões como presente e acabei ficando com uma para mim. A embalagem e a ficha de cada lote fazem toda a diferença."),
    dict(n="Michelle D.", c="Miami, FL", p="🇺🇸", t="International order", r=5, lang="en",
         q="I run a small café and needed a Colombian single origin that stands out. The Landrace natural sells itself — customers ask what it is."),
    dict(n="Élodie M.", c="París, Francia", p="🇫🇷", t="Commande internationale", r=5, lang="fr",
         q="La torréfaction à la commande change tout. J'ai reçu le Sereno, un Laurina naturellement pauvre en caféine — introuvable ailleurs à ce niveau."),
    dict(n="Daniela T.", c="Barranquilla", p="🇨🇴", t="Cliente", r=5, lang="es",
         q="Compré el Sereno porque no tolero bien la cafeína. Sabor completo de especialidad sin el sobresalto. No sabía que existía algo así."),
    dict(n="Kenji T.", c="Tokio, Japón", p="🇯🇵", t="海外注文", r=5, lang="ja",
         q="焙煎日が明記されていて、届いた豆の状態が素晴らしい。ウォッシュウォッシュの華やかさは日本ではなかなか手に入りません。"),
]

# ── PROGRAMA DE LEALTAD ─────────────────────────────────────────────────
LEALTAD = dict(
    puntos_por_peso=1,          # 1 punto por cada $1.000 COP
    niveles=[
        dict(nombre="Semilla", icon="🌱", desde=0, benef=[
            "1 punto por cada $1.000 de compra",
            "Acceso al catálogo completo",
            "Asesoría de cata por WhatsApp"]),
        dict(nombre="Tostador", icon="🔥", desde=300, benef=[
            "Todo lo anterior",
            "Envío gratis sin monto mínimo",
            "Preventa de variedades de temporada 48 h antes"]),
        dict(nombre="Barista", icon="⚗️", desde=800, benef=[
            "Todo lo anterior",
            "10 % de descuento permanente",
            "Un drip sorpresa en cada pedido"]),
        dict(nombre="Catador", icon="🏅", desde=2000, benef=[
            "Todo lo anterior",
            "15 % de descuento permanente",
            "Acceso a variedades de competencia antes que nadie",
            "Invitación a catas y visita a finca"]),
    ],
    canje=[("500 puntos", "Bolsa de 125 g de Origen o Temporada"),
           ("1.200 puntos", "Bolsa de 250 g de Origen o Temporada"),
           ("2.500 puntos", "Bolsa de 250 g de Premio Nacional")],
)

# ── PROGRAMA DE REFERIDOS ───────────────────────────────────────────────
# El premio se entrega EN EL SIGUIENTE PEDIDO del referente: así no se
# duplica el costo de envío, que es lo que hunde la economía de este tipo
# de programas. Con un primer pedido medio de $85.000 y margen bruto del
# 60 %, el costo total (15 % de descuento + costo de la bolsa) se queda
# por debajo del margen que deja el referido. Revisar si sube el flete.
REFERIDOS = dict(
    dto_amigo=15,      # % de descuento para el referido, en su primera compra
    premio_referente="una bolsa de 125 g gratis",
    cuando="en tu próximo pedido",
    puntos_referente=500,
)

# ── ÑAPA ────────────────────────────────────────────────────────────────
# Costumbre colombiana del regalito que se añade a la compra. Funciona muy
# bien con público adulto: no es un descuento, es un gesto.
NAPA = dict(
    desde=120000,      # a partir de este subtotal
    regalo="un drip de la variedad del mes",
)

# ── FAQ ─────────────────────────────────────────────────────────────────
FAQ = [
    ("¿Qué significa que un café sea «de especialidad»?",
     "Es un café que un catador certificado (Q Grader) puntúa por encima de 80 sobre 100 en la escala de la Specialty Coffee Association. Evalúa aroma, sabor, acidez, cuerpo, dulzor y limpieza de taza. Nuestro portafolio va de 82 a 89 puntos, un rango que en Colombia solo alcanza una fracción muy pequeña de la producción."),
    ("¿Qué es un proceso «espirituoso» o «cofermentado»?",
     "Son fermentaciones controladas del grano dentro del fruto, con tiempos largos (de 96 a 400 horas) y a veces en biorreactor. El resultado son perfiles de taza mucho más intensos y frutales que un lavado tradicional. No se añade ningún saborizante: todo el perfil proviene de la fermentación."),
    ("¿Cuál me recomiendan si nunca he tomado café de especialidad?",
     "Empieza por Raíz Pitalito o Panela Dorada: perfiles dulces y equilibrados, muy cercanos al café que ya conoces pero mucho más limpios. También puedes probar el Pasaporte Drip, con cinco muestras de colecciones distintas."),
    ("¿Cómo elijo la molienda?",
     "Directamente en la ficha del café, junto al gramaje: espresso, V60 o filtro, prensa francesa, Aeropress, moka italiana o cafetera de goteo. Molemos justo antes de despachar, sin costo adicional. Si tienes molino en casa, pide grano entero: es la opción que mejor conserva el aroma."),
    ("¿Hacen envíos internacionales?",
     "Sí. Despachamos a Estados Unidos, Europa, Brasil y Asia mediante courier con guía rastreable. El tiempo típico es de 7 a 15 días hábiles según destino y aduana. Escríbenos por WhatsApp con tu ciudad y te cotizamos antes de cualquier pago."),
    ("¿Cuánto tarda el envío en Colombia y cuánto cuesta?",
     "Bogotá: 24 a 48 horas. Resto del país: 2 a 5 días hábiles. El envío es gratis en pedidos desde $85.000; por debajo de ese monto se cotiza según destino y te lo confirmamos por WhatsApp antes de despachar."),
    ("¿Cómo pago?",
     "Coordinamos el pago por WhatsApp una vez confirmado el pedido: transferencia bancaria, Nequi, Daviplata o contra entrega en Bogotá. Para pedidos internacionales usamos transferencia o pasarela con enlace seguro. Te confirmamos el total, incluido el envío, antes de cualquier pago."),
    ("¿Cómo funcionan los puntos del Club de la Semilla?",
     "Acumulas 1 punto por cada $1.000 de compra, en cualquier pedido, seas o no suscriptor. Los puntos suben de nivel automáticamente y se canjean por café. No caducan mientras compres al menos una vez al año."),
    ("¿Cuánto dura el café una vez tostado?",
     "En grano y con la bolsa bien cerrada, la ventana óptima va de los 7 a los 45 días después del tueste. Los primeros días el café todavía libera CO₂ de la tostión y la extracción sale irregular; por eso la válvula de la bolsa deja salir el gas sin dejar entrar oxígeno. Pasados los 45 días no se daña, pero pierde aroma y los matices frutales se apagan.\n\nMolido dura mucho menos: entre 7 y 15 días, porque al partir el grano se multiplica la superficie expuesta al aire. Si puedes, compra en grano y muele justo antes de preparar.\n\nGuárdalo en su bolsa original, en un lugar fresco, seco y sin luz directa. No lo pases a frascos de vidrio transparente ni lo refrigeres: la nevera genera condensación y el café absorbe olores con facilidad. Congelar solo sirve si vas a dejarlo meses sin abrir y en porciones selladas.\n\nTostamos bajo pedido, así que siempre recibes el café dentro de su mejor ventana y con la fecha de tueste impresa en el empaque."),
    ("¿Puedo cancelar la suscripción del Club?",
     "Sí, cuando quieras y sin penalidad. Basta un mensaje por WhatsApp antes de la fecha de despacho del mes siguiente."),
]

# ── QUIZ: motor de recomendación ────────────────────────────────────────
QUIZ = {
    "preguntas": [
        dict(id="metodo", titulo="¿Cómo preparas tu café normalmente?",
             ops=[("espresso", "☕", "Espresso / cafetera de cápsulas"),
                  ("filtro", "🫖", "V60, Chemex o filtro"),
                  ("prensa", "⏳", "Prensa francesa"),
                  ("goteo", "🏠", "Cafetera de goteo o greca")]),
        dict(id="perfil", titulo="¿Qué sabor te atrae más?",
             ops=[("dulce", "🍫", "Chocolate, panela, nuez"),
                  ("frutal", "🍇", "Frutas, vino, acidez brillante"),
                  ("floral", "🌸", "Floral, té, cítrico delicado"),
                  ("intenso", "🔥", "Intenso y complejo, sorpréndeme")]),
        dict(id="nivel", titulo="¿Qué tanto conoces el café de especialidad?",
             ops=[("nuevo", "🌱", "Estoy empezando"),
                  ("medio", "☕", "Ya tomo especialidad regularmente"),
                  ("experto", "🎖️", "Busco variedades exclusivas y de competencia")]),
        dict(id="presupuesto", titulo="¿Cuánto quieres invertir por bolsa de 250 g?",
             ops=[("bajo", "💵", "Hasta $50.000"),
                  ("medio", "💳", "Entre $50.000 y $90.000"),
                  ("alto", "💎", "Sin límite, quiero lo mejor")]),
    ]
}

WA_NUM = "573154510390"
NIT = "901731658"
ENVIO_GRATIS = 85000
SITE = "https://clubcafecol.github.io/clubcafecol_Catalogo"
ASSET_VER = "2026.08.6"

# ── MONEDA ──────────────────────────────────────────────────────────────
# Todos los precios del catálogo están en pesos colombianos (COP) y es la
# moneda en la que se cobra. Cuando el visitante navega en otro idioma se
# muestra además una equivalencia aproximada en USD, calculada con esta
# tasa. ACTUALÍZALA periódicamente: la TRM se mueve todos los días.
# Fuente: Superintendencia Financiera de Colombia (TRM oficial).
USD_COP = 3125          # TRM del 11 de agosto de 2026: $3.125,47
