-- Seed data for development. Idempotent (uses ON CONFLICT).

INSERT INTO sources (slug, name, organization, url, license, description) VALUES
  ('sermig', 'Servicio Nacional de Migraciones', 'Servicio Nacional de Migraciones (SERMIG)', 'https://serviciomigraciones.cl', 'CC BY 4.0', 'Estadísticas oficiales de permanencias y residencias temporales/definitivas otorgadas en Chile.'),
  ('ine', 'Instituto Nacional de Estadísticas', 'INE Chile', 'https://www.ine.gob.cl', 'CC BY 4.0', 'Censo, encuestas de empleo, estimaciones intercensales y estadísticas de población.'),
  ('sii', 'Servicio de Impuestos Internos', 'SII', 'https://www.sii.cl', 'datos.gob.cl', 'Estadísticas de tributación: renta, IVA, contribuyentes activos.'),
  ('sp', 'Superintendencia de Pensiones', 'Superintendencia de Pensiones', 'https://www.spensiones.cl', 'CC BY 4.0', 'Cotizantes y afiliados al sistema de AFP por nacionalidad y región.'),
  ('mineduc', 'Ministerio de Educación', 'MINEDUC', 'https://datosabiertos.mineduc.cl', 'CC BY 4.0', 'Matrícula escolar y estadísticas educativas.'),
  ('sjm', 'Servicio Jesuita a Migrantes', 'SJM Chile', 'https://www.migracionenchile.cl', 'CC BY-NC 4.0', 'Estimaciones de migración irregular e informes anuales sobre migración en Chile.')
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
