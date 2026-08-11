# -*- coding: utf-8 -*-
"""
CLUBCAFECOL — Fuente única de verdad del catálogo 2026.
Editar SOLO este archivo para cambiar precios, notas o SKUs; luego ejecutar build.py.
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

# Varietales raros / difíciles de encontrar en Colombia
EXOTICOS = {"Wush Wush", "Sudan Rume", "Laurina", "Pacamara", "Ombligon",
            "Ombligón", "Geisha Origen", "Geisha Top", "Landrace",
            "Sidra Termochok", "Sidra", "Bourbon Rosado", "Moka", "Papayo"}

SKUS = [
    # ── COLECCIÓN ORIGEN ────────────────────────────────────────────────
    dict(id="ORI-001", nombre="RAÍZ PITALITO", col="origen",
         varietal="Blend Castillo / Caturra / Colombia", proceso="Lavado",
         msnm=1650, sca=None, cuerpo="Medio", origen="Pitalito, Huila",
         notas=["Chocolate", "Panela", "Nuez"],
         precios={"drip_10g": 4900, "250g": 30900, "340g": 38900, "500g": 53900, "2500g": 230000}),
    dict(id="ORI-002", nombre="PANELA DORADA", col="origen",
         varietal="Caturra", proceso="Natural",
         msnm=1700, sca=85, cuerpo="Medio-alto", origen="Pitalito, Huila",
         notas=["Caña", "Miel de panela", "Cítrico", "Té", "Melón"],
         precios={"drip_10g": 5900, "250g": 41900, "340g": 54900, "500g": 75900, "2500g": 335000}),

    # ── COLECCIÓN TEMPORADA ─────────────────────────────────────────────
    dict(id="TEM-001", nombre="MANDARINA ROSADA", col="temporada",
         varietal="Bourbon Rosado", proceso="Honey",
         msnm=1700, sca=86, cuerpo="Medio", origen="Pitalito, Huila",
         notas=["Chocolate", "Miel de panela", "Cítrico", "Durazno"],
         precios={"drip_10g": 5900, "250g": 45900, "340g": 59900, "500g": 88000, "2500g": 365000}),
    dict(id="TEM-002", nombre="BOSQUE DE ROMERO", col="temporada",
         varietal="Papayo", proceso="Lavado",
         msnm=1650, sca=86, cuerpo="Medio", origen="Pitalito, Huila",
         notas=["Especiado", "Maderas finas", "Cítrico", "Romero"],
         precios={"drip_10g": 5900, "250g": 45900, "340g": 59900, "500g": 81900, "2500g": 365000}),
    dict(id="TEM-003", nombre="GIGANTE DULCE", col="temporada",
         varietal="Pacamara", proceso="Natural",
         msnm=1650, sca=85, cuerpo="Alto", origen="Pitalito, Huila",
         notas=["Grano gigante", "Dulce", "Cuerpo alto"],
         precios={"drip_10g": 5900, "250g": 45900, "340g": 59900, "500g": 82900, "2500g": 375000}),
    dict(id="TEM-004", nombre="VINO DE MONTAÑA", col="temporada",
         varietal="Tabi", proceso="Natural",
         msnm=1650, sca=87, cuerpo="Medio", origen="Pitalito, Huila",
         notas=["Frutos rojos", "Vino", "Cítrico", "Chocolate"],
         precios={"drip_10g": 5900, "250g": 45900, "340g": 59900, "500g": 81900, "2500g": 365000}),
    dict(id="TEM-005", nombre="JAZMÍN", col="temporada",
         varietal="Geisha Origen", proceso="Lavado",
         msnm=1650, sca=86, cuerpo="Ligero-medio", origen="Pitalito, Huila",
         notas=["Limoncillo", "Toronja", "Miel", "Floral"],
         precios={"drip_10g": 6900, "250g": 55900, "340g": 71900, "500g": 105000, "2500g": 455000}),
    dict(id="TEM-006", nombre="PIMIENTA SUAVE", col="temporada",
         varietal="Bourbon Ají", proceso="Semilavado",
         msnm=1650, sca=86, cuerpo="Medio", origen="Pitalito, Huila",
         notas=["Albahaca", "Pimienta", "Caramelo", "Cítrico", "Melón"],
         precios={"drip_10g": 6900, "250g": 55900, "340g": 72900, "500g": 105000, "2500g": 455000}),
    dict(id="TEM-007", nombre="TÉ SALVAJE", col="temporada",
         varietal="Wush Wush", proceso="Semilavado",
         msnm=1650, sca=86, cuerpo="Ligero", origen="Pitalito, Huila",
         notas=["Floral intenso", "Frutal", "Té", "Dulzor prolongado"],
         precios={"drip_10g": 6900, "250g": 58900, "340g": 76900, "500g": 110000, "2500g": 485000}),

    # ── COLECCIÓN PREMIO NACIONAL ───────────────────────────────────────
    dict(id="PRE-001", nombre="TRÓPICO", col="premio",
         varietal="Sidra Termochok", proceso="Espirituoso",
         msnm=1650, sca=88, cuerpo="Medio", origen="Pitalito, Huila",
         notas=["Maracuyá", "Gulupa", "Uchuva", "Frutos amarillos"],
         precios={"drip_10g": 8900, "250g": 80900, "340g": 110000, "500g": 150000, "2500g": 690000}),
    dict(id="PRE-002", nombre="BOURBON SANDÍA", col="premio",
         varietal="Sidra", proceso="Natural",
         msnm=1650, sca=87, cuerpo="Ligero-medio", origen="Pitalito, Huila",
         notas=["Sandía", "Frutal fresco", "Acidez brillante"],
         precios={"drip_10g": 8900, "250g": 80900, "340g": 110000, "500g": 150000, "2500g": 690000}),
    dict(id="PRE-003", nombre="MANJAR BLANCO", col="premio",
         varietal="Ombligón", proceso="Espirituoso",
         msnm=1650, sca=88, cuerpo="Alto", origen="Pitalito, Huila",
         notas=["Manjar de leche", "Coco", "Cítrico", "Caramelo"],
         precios={"drip_10g": 8900, "250g": 80900, "340g": 110000, "500g": 150000, "2500g": 690000}),
    dict(id="PRE-004", nombre="ARÁNDANOS", col="premio",
         varietal="Landrace", proceso="Natural",
         msnm=1650, sca=88, cuerpo="Medio", origen="Pitalito, Huila",
         notas=["Frutos morados", "Frambuesa", "Uva", "Lichi", "Vino"],
         precios={"drip_10g": 8900, "250g": 80900, "340g": 110000, "500g": 150000, "2500g": 690000}),
    dict(id="PRE-005", nombre="ANCESTRAL FRUTAL", col="premio",
         varietal="Sudan Rume", proceso="Espirituoso",
         msnm=1650, sca=86, cuerpo="Ligero-medio", origen="Pitalito, Huila",
         notas=["Frutal complejo", "Floral", "Landrace etíope"],
         precios={"drip_10g": 8900, "250g": 81900, "340g": 110000, "500g": 155000, "2500g": 695000}),
    dict(id="PRE-006", nombre="POSTRE DE GALLETA", col="premio",
         varietal="Bourbon Rojo", proceso="Natural cofermentado",
         msnm=1650, sca=89, cuerpo="Alto", origen="Pitalito, Huila",
         notas=["Galleta", "Helado", "Vino", "Dulzor envolvente"],
         precios={"drip_10g": 8900, "250g": 82900, "340g": 110000, "500g": 155000, "2500g": 705000}),
    dict(id="PRE-007", nombre="PASIÓN 400", col="premio",
         varietal="Natural Passion", proceso="Natural 400 h",
         msnm=1650, sca=89, cuerpo="Alto", origen="Pitalito, Huila",
         premio="Subcampeón Nacional", premio_icon="🥈",
         notas=["Tamarindo", "Sandía", "Chocolate negro", "Licor"],
         precios={"drip_10g": 10900, "250g": 95000, "340g": 125000, "500g": 175000, "2500g": 795000}),
    dict(id="PRE-008", nombre="CORONA", col="premio",
         varietal="Geisha Top", proceso="Espirituoso",
         msnm=1650, sca=89, cuerpo="Ligero", origen="Pitalito, Huila",
         premio="Campeón Nacional", premio_icon="🏆",
         notas=["Limoncillo", "Jazmín", "Cilantro", "Romero"],
         precios={"drip_10g": 12900, "250g": 115000, "340g": 150000, "500g": 210000, "2500g": 935000}),

    # ── COLECCIÓN RESERVA ───────────────────────────────────────────────
    dict(id="RES-001", nombre="MORA DE NIEBLA", col="reserva",
         varietal="Moka", proceso="Lavado",
         msnm=1650, sca=87, cuerpo="Cremoso", origen="Acevedo, Huila",
         notas=["Moras frescas", "Miel", "Cuerpo cremoso", "Brillante"],
         precios={"drip_10g": 9900, "250g": 92900, "340g": 125000, "500g": 175000, "2500g": 800000}),
    dict(id="RES-002", nombre="SERENO", col="reserva",
         varietal="Laurina", proceso="Lavado", bajo_cafeina=True,
         msnm=1650, sca=87, cuerpo="Ligero-medio", origen="Acevedo, Huila",
         notas=["Floral", "Vainilla", "Miel", "Té"],
         precios={"drip_10g": 9900, "250g": 92900, "340g": 125000, "500g": 175000, "2500g": 800000}),
    dict(id="RES-003", nombre="MORA DE NIEBLA RESERVA", col="reserva",
         varietal="Moka", proceso="Natural",
         msnm=1650, sca=87, cuerpo="Cremoso", origen="Acevedo, Huila",
         notas=["Moras frescas", "Miel", "Frutal", "Residual limpio"],
         precios={"drip_10g": 12900, "250g": 130000, "340g": 170000, "500g": 240000, "2500g": 1100000}),
    dict(id="RES-004", nombre="SERENO RESERVA", col="reserva",
         varietal="Laurina", proceso="Natural", bajo_cafeina=True,
         msnm=1650, sca=87, cuerpo="Medio", origen="Acevedo, Huila",
         notas=["Floral", "Vainilla", "Miel", "Frutal", "Especiado"],
         precios={"drip_10g": 12900, "250g": 130000, "340g": 170000, "500g": 240000, "2500g": 1100000}),
]

# ── PLANES DE SUSCRIPCIÓN ───────────────────────────────────────────────
CLUB = [
    dict(id="CLUB-1", icon="☕", nombre="Explorador", precio=95000,
         beneficios=["250 g de café de temporada", "Tarjeta de cata", "Envío incluido",
                     "Molienda a tu medida", "Cancela cuando quieras"]),
    dict(id="CLUB-2", icon="🌟", nombre="Conocedor", precio=145000, popular=True,
         beneficios=["250 g de temporada + sorpresa", "Acceso anticipado a novedades",
                     "Guía de preparación", "Envío incluido", "Molienda a tu medida",
                     "Cancela cuando quieras"]),
    dict(id="CLUB-3", icon="🏆", nombre="Maestro", precio=220000,
         beneficios=["2 cafés de colecciones premium", "Acceso exclusivo a lotes limitados",
                     "Visita virtual a finca", "Envío prioritario incluido",
                     "Molienda a tu medida", "Cancela cuando quieras"]),
]

# ── BUNDLES / KITS (cross-selling) ──────────────────────────────────────
BUNDLES = [
    dict(id="BDL-001", nombre="Pasaporte Drip", emoji="🎫",
         desc="5 drips de 5 colecciones distintas. La forma más inteligente de descubrir tu perfil sin comprometerte con una bolsa.",
         incluye=["Raíz Pitalito", "Vino de Montaña", "Té Salvaje", "Trópico", "Corona"],
         precio=34900, tachado=39500, tag="Ideal para empezar"),
    dict(id="BDL-002", nombre="Trilogía de Campeones", emoji="🏆",
         desc="Los tres cafés que nos pusieron en el podio nacional. 250 g de cada uno, en su punto de tueste.",
         incluye=["Corona · SCA 89", "Pasión 400 · SCA 89", "Postre de Galleta · SCA 89"],
         precio=265000, tachado=292900, tag="Regalo memorable"),
    dict(id="BDL-003", nombre="Kit Ritual V60", emoji="🫖",
         desc="Todo lo necesario para preparar filtrado de especialidad en casa, con el café que mejor lo expresa.",
         incluye=["V60 cerámica + filtros", "Vino de Montaña 250 g", "Guía de extracción impresa"],
         precio=159000, tachado=184000, tag="Kit completo"),
    dict(id="BDL-004", nombre="Dotación Oficina", emoji="🏢",
         desc="Café de especialidad para tu equipo. 2,5 kg de grano de la colección Origen, molido a tu medida.",
         incluye=["2,5 kg Raíz Pitalito", "Molienda personalizada", "Reposición programada"],
         precio=230000, tachado=None, tag="B2B · empresas"),
]

# ── PRUEBA SOCIAL ───────────────────────────────────────────────────────
TESTIMONIOS = [
    dict(n="Andrea M.", c="Bogotá", t="Explorador", r=5,
         q="Pedí el Vino de Montaña un martes y el jueves ya estaba en mi casa, tostado el mismo día del pedido. La diferencia con el café de supermercado es abismal."),
    dict(n="Camilo R.", c="Medellín", t="Cliente B2B", r=5,
         q="Compramos 2,5 kg mensuales para la cafetería. Consistencia de lote a lote impecable y la asesoría por WhatsApp es inmediata."),
    dict(n="Valentina S.", c="Cali", t="Club Conocedor", r=5,
         q="Llevo seis meses en el Club. Nunca me han repetido un café y la tarjeta de cata me enseñó a identificar notas que antes no percibía."),
    dict(n="Julián P.", c="Bucaramanga", t="Cliente", r=5,
         q="El Corona es otro nivel. Entiendo por qué ganó el campeonato: floral, limpio y con un final que se queda largo rato."),
    dict(n="Daniela T.", c="Barranquilla", t="Cliente", r=5,
         q="Compré el Sereno porque no tolero bien la cafeína. Sabor completo de especialidad sin el sobresalto. No sabía que existía algo así."),
    dict(n="Mateo G.", c="Bogotá", t="Regalo corporativo", r=5,
         q="Regalamos 40 kits a clientes en diciembre. La presentación y el empaque generaron más comentarios que cualquier regalo anterior."),
]

# ── FAQ ─────────────────────────────────────────────────────────────────
FAQ = [
    ("¿Qué significa que un café sea «de especialidad»?",
     "Es un café que un catador certificado (Q Grader) puntúa por encima de 80 sobre 100 en la escala de la Specialty Coffee Association. Evalúa aroma, sabor, acidez, cuerpo, dulzor y limpieza de taza. Nuestro portafolio va de 85 a 89 puntos, un rango que en Colombia solo alcanza una fracción muy pequeña de la producción."),
    ("¿Qué es un proceso «espirituoso» o «cofermentado»?",
     "Son fermentaciones controladas del grano dentro del fruto, con tiempos largos (de 96 a 400 horas) y a veces en biorreactor. El resultado son perfiles de taza mucho más intensos y frutales que un lavado tradicional. No se añade ningún saborizante: todo el perfil proviene de la fermentación."),
    ("¿Cuál me recomiendan si nunca he tomado café de especialidad?",
     "Empieza por Raíz Pitalito o Panela Dorada: perfiles dulces y equilibrados, muy cercanos al café que ya conoces pero mucho más limpios. También puedes probar el Pasaporte Drip, con cinco muestras de colecciones distintas."),
    ("¿Cómo elijo la molienda?",
     "En el carrito eliges el método que usas: espresso, V60 o filtro, prensa francesa, Aeropress, moka italiana o cafetera de goteo. Molemos justo antes de despachar, sin costo adicional. Si tienes molino en casa, pide grano entero: es la opción que mejor conserva el aroma."),
    ("¿Cuánto tarda el envío y cuánto cuesta?",
     "Bogotá: 24 a 48 horas. Resto del país: 2 a 5 días hábiles. El envío es gratis en pedidos desde $85.000; por debajo de ese monto se cotiza según destino y te lo confirmamos por WhatsApp antes de despachar."),
    ("¿Cómo pago?",
     "Coordinamos el pago por WhatsApp una vez confirmado el pedido: transferencia bancaria, Nequi, Daviplata o contra entrega en Bogotá. Te confirmamos el total, incluido el envío, antes de cualquier pago."),
    ("¿Cuánto dura el café una vez tostado?",
     "En grano y bien cerrado, el punto óptimo va de los 7 a los 45 días después del tueste. Tostamos bajo pedido, así que recibes el café dentro de su mejor ventana. Guárdalo en un lugar fresco, seco y sin luz directa; no lo refrigeres."),
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
                  ("experto", "🎖️", "Busco lotes raros y competencia")]),
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
ASSET_VER = "2026.08"
