-- Seed data for development. Idempotent (uses ON CONFLICT).

INSERT INTO sources (slug, name, organization, url, license, description) VALUES
  -- Chile
  ('sermig', 'Servicio Nacional de Migraciones', 'Servicio Nacional de Migraciones (SERMIG)', 'https://serviciomigraciones.cl', 'CC BY 4.0', 'Estadísticas oficiales de permanencias y residencias temporales/definitivas otorgadas en Chile.'),
  ('ine', 'Instituto Nacional de Estadísticas', 'INE Chile', 'https://www.ine.gob.cl', 'CC BY 4.0', 'Censo, encuestas de empleo, estimaciones intercensales y estadísticas de población.'),
  ('sii', 'Servicio de Impuestos Internos', 'SII', 'https://www.sii.cl', 'datos.gob.cl', 'Estadísticas de tributación: renta, IVA, contribuyentes activos.'),
  ('sp', 'Superintendencia de Pensiones', 'Superintendencia de Pensiones', 'https://www.spensiones.cl', 'CC BY 4.0', 'Cotizantes y afiliados al sistema de AFP por nacionalidad y región.'),
  ('mineduc', 'Ministerio de Educación', 'MINEDUC', 'https://datosabiertos.mineduc.cl', 'CC BY 4.0', 'Matrícula escolar y estadísticas educativas.'),
  ('sjm', 'Servicio Jesuita a Migrantes', 'SJM Chile', 'https://www.migracionenchile.cl', 'CC BY-NC 4.0', 'Estimaciones de migración irregular e informes anuales sobre migración en Chile.'),
  -- Venezuela / global
  ('world-bank', 'World Bank Open Data', 'Banco Mundial', 'https://data.worldbank.org/', 'CC BY 4.0', 'Indicadores macroeconómicos y de desarrollo consolidados de OMS, UNICEF, FMI, OIT y oficinas estadísticas nacionales. API JSON pública sin autenticación.'),
  ('freedom-house', 'Freedom in the World', 'Freedom House', 'https://freedomhouse.org/report/freedom-world', 'citada con atribución', 'Evaluación anual de derechos políticos y libertades civiles para 195 países. Score 0-100 + estatus F/PF/NF, publicado en febrero cada año.'),
  ('unhcr', 'UNHCR Population Statistics', 'Alto Comisionado de la ONU para los Refugiados (ACNUR)', 'https://www.unhcr.org/refugee-statistics/', 'CC BY 4.0', 'Refugiados, solicitantes de asilo y otros desplazados por país de origen y destino. Datos mensuales/anuales vía API JSON pública.'),
  ('unodc', 'UN Office on Drugs and Crime', 'UNODC', 'https://dataunodc.un.org/', 'CC BY 4.0', 'Estadísticas mundiales de homicidios intencionales por 100k habitantes. Consolidado por el Banco Mundial.'),
  ('mapa-olvido-base', 'Mapa del Olvido (datos comunitarios)', 'Cuentas Venezuela', 'https://cuentasvenezuela.org/mapa-del-olvido/metodologia', 'CC BY-SA 4.0', 'Catálogo abierto de obras públicas paralizadas, críticas o inoperativas en Venezuela. Compilado de informes oficiales, prensa y reportes ciudadanos. Cada obra cita su fuente primaria.')
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  organization = EXCLUDED.organization,
  url = EXCLUDED.url,
  license = EXCLUDED.license,
  description = EXCLUDED.description;

INSERT INTO datasets (slug, source_id, title, description, parquet_key, extracted_at) VALUES
  ('sermig-stock-region',  (SELECT id FROM sources WHERE slug='sermig'),  'Stock migratorio venezolano por región',  'Permanencias vigentes por región y año',  'sermig/stock_region.parquet',  NOW()),
  ('sermig-stock-comuna',  (SELECT id FROM sources WHERE slug='sermig'),  'Stock migratorio venezolano por comuna', 'Permanencias vigentes por comuna y año',  'sermig/stock_comuna.parquet', NOW()),
  ('ine-empleo-nacionalidad',  (SELECT id FROM sources WHERE slug='ine'),  'Empleo por nacionalidad', 'Tasa de ocupación, formal/informal, por nacionalidad', 'ine/empleo_nacionalidad.parquet', NOW()),
  ('sp-cotizantes',  (SELECT id FROM sources WHERE slug='sp'),  'Cotizantes AFP por nacionalidad y sector', 'Serie mensual de cotizantes activos', 'sp/cotizantes.parquet', NOW()),
  ('sii-aporte-tributario',  (SELECT id FROM sources WHERE slug='sii'),  'Aporte tributario estimado', 'Aporte de impuesto a la renta e IVA estimado', 'sii/aporte.parquet', NOW()),
  ('mineduc-matricula',  (SELECT id FROM sources WHERE slug='mineduc'),  'Matrícula escolar venezolana', 'Estudiantes matriculados por región', 'mineduc/matricula.parquet', NOW()),
  ('sjm-irregularidad',  (SELECT id FROM sources WHERE slug='sjm'),  'Estimación de irregularidad', 'Estimación anual de migración irregular', 'sjm/irregularidad.parquet', NOW())
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  parquet_key = EXCLUDED.parquet_key,
  extracted_at = EXCLUDED.extracted_at;

INSERT INTO indicators (slug, name, category, unit, description, dataset_id) VALUES
  ('stock-legal-region',     'Stock legal por región',          'Demografía', 'personas',     'Permanencias vigentes por región',                       (SELECT id FROM datasets WHERE slug='sermig-stock-region')),
  ('stock-legal-comuna',     'Stock legal por comuna',          'Demografía', 'personas',     'Permanencias vigentes por comuna',                       (SELECT id FROM datasets WHERE slug='sermig-stock-comuna')),
  ('estimado-irregular',     'Estimación de irregularidad',      'Demografía', 'personas',     'Estimación de migración irregular (SJM)',                (SELECT id FROM datasets WHERE slug='sjm-irregularidad')),
  ('tasa-ocupacion',         'Tasa de ocupación',                'Trabajo',    'porcentaje',   'Porcentaje de ocupados sobre PEA migrante',              (SELECT id FROM datasets WHERE slug='ine-empleo-nacionalidad')),
  ('tasa-formalidad',        'Tasa de formalidad laboral',       'Trabajo',    'porcentaje',   'Porcentaje de empleo con contrato formal',               (SELECT id FROM datasets WHERE slug='ine-empleo-nacionalidad')),
  ('cotizantes-afp',         'Cotizantes AFP',                   'Pensiones', 'personas',      'Cotizantes activos en el sistema AFP',                   (SELECT id FROM datasets WHERE slug='sp-cotizantes')),
  ('cotizantes-sector',      'Cotizantes por sector',            'Pensiones', 'personas',      'Distribución de cotizantes por sector económico',        (SELECT id FROM datasets WHERE slug='sp-cotizantes')),
  ('aporte-renta',           'Aporte impuesto a la renta',       'Tributario','CLP',           'Aporte estimado por impuesto a la renta',                (SELECT id FROM datasets WHERE slug='sii-aporte-tributario')),
  ('aporte-iva',             'Aporte IVA',                       'Tributario','CLP',           'Aporte estimado por IVA',                                (SELECT id FROM datasets WHERE slug='sii-aporte-tributario')),
  ('matricula-escolar',      'Matrícula escolar',                'Educación', 'estudiantes',   'Estudiantes venezolanos matriculados',                   (SELECT id FROM datasets WHERE slug='mineduc-matricula'))
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  unit = EXCLUDED.unit,
  description = EXCLUDED.description,
  dataset_id = EXCLUDED.dataset_id;

-- ===== Mapa del Olvido: seed obras (mirror of mapa-olvido-vnzla scraper/seed.py) =====
INSERT INTO obras (
  id, nombre, lat, lng, geohash, presupuesto_usd, anio_inicio, categoria,
  estado_venezuela, estatus, ente_responsable, fuente_url, fotos_url,
  descripcion, progreso_pct, sobrecosto_pct, presupuesto_original_usd,
  responsable_politico, partido_politico, contratista
) VALUES
  ('hospital-maracaibo', 'Hospital Universitario de Maracaibo',
   10.651, -71.614, 'e6ku4p',
   45000000, 2003, 'Salud',
   'Zulia', 'paralizada', 'MPPS',
   'https://transparenciave.org/obras/1', '[]'::jsonb,
   'Centro de atención médica de alta complejidad anunciado para descongestionar el Hospital Central. Tras 22 años, las estructuras están abandonadas y vandalizadas.',
   35, 180, 16000000,
   'Manuel Rosales', 'Un Nuevo Tiempo', 'Constructora Norberto Odebrecht'),

  ('viaducto-la-cabrera', 'Viaducto La Cabrera',
   10.327, -66.104, 'djvqkp',
   120000000, 2007, 'Infraestructura',
   'Miranda', 'critica', 'MINFRA',
   'https://transparenciave.org/obras/2', '[]'::jsonb,
   'Conexión vial estratégica entre Caracas y los Valles del Tuy. Estructura presenta fallas geológicas sin resolver.',
   78, 95, 61500000,
   'Diosdado Cabello', 'PSUV', 'Odebrecht Venezuela'),

  ('estadio-puerto-la-cruz', 'Estadio de Béisbol Puerto La Cruz',
   10.213, -64.638, 'dju8kp',
   18000000, 2011, 'Deporte',
   'Anzoátegui', 'inoperativa', 'MPPE',
   'https://transparenciave.org/obras/3', '[]'::jsonb,
   'Estadio anunciado para Serie del Caribe 2014. Inaugurado parcialmente, hoy sin uso por daños estructurales.',
   90, 50, 12000000,
   'Tarek William Saab', 'PSUV', 'Constructora del Caribe'),

  ('linea5-metro-caracas', 'Línea 5 Metro de Caracas',
   10.491, -66.878, 'djv0kp',
   890000000, 1999, 'Transporte',
   'Distrito Capital', 'paralizada', 'Metro de Caracas',
   'https://transparenciave.org/obras/4', '[]'::jsonb,
   'Línea anunciada hace 26 años para conectar Plaza Venezuela con Parque del Este. Túneles excavados parcialmente, sin estaciones funcionales.',
   22, 245, 258000000,
   'Hugo Chávez Frías', 'MVR / PSUV', 'Consorcio Constructora Norberto Odebrecht-Ghella'),

  ('universidad-tachira', 'Universidad Bolivariana del Táchira',
   7.773, -72.226, 'd39jkp',
   25000000, 2014, 'Educación',
   'Táchira', 'critica', 'MPPES',
   'https://transparenciave.org/obras/5', '[]'::jsonb,
   'Sede universitaria anunciada con capacidad para 8.000 estudiantes. Edificios sin terminar, sin servicios básicos.',
   55, 30, 19200000,
   'José Vielma Mora', 'PSUV', 'Sin licitación pública'),

  ('central-tocoma', 'Central Hidroeléctrica Tocoma',
   7.892, -63.103, 'd6vk7p',
   4300000000, 2007, 'Energía',
   'Bolívar', 'paralizada', 'CORPOELEC',
   'https://transparenciave.org/obras/6', '[]'::jsonb,
   'Central hidroeléctrica anunciada con capacidad de 2.160 MW. Tras 18 años, opera al 40% de capacidad por fallas en turbinas.',
   60, 110, 2050000000,
   'Hugo Chávez Frías', 'PSUV', 'Constructora OAS')
ON CONFLICT (id) DO UPDATE SET
  nombre = EXCLUDED.nombre,
  lat = EXCLUDED.lat,
  lng = EXCLUDED.lng,
  presupuesto_usd = EXCLUDED.presupuesto_usd,
  estatus = EXCLUDED.estatus,
  updated_at = NOW();
