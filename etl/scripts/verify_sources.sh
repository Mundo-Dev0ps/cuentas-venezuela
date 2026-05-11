#!/usr/bin/env bash
# Smoke-test data source endpoints before committing to ETL pipelines.
# Reports per-source: HTTP status, content-type, response size, sample.
#
# Usage:
#   bash etl/scripts/verify_sources.sh
#   bash etl/scripts/verify_sources.sh --only chile
set -uo pipefail

ONLY="${2:-all}"
[[ "${1:-}" == "--only" ]] && ONLY="${2:-all}"

TIMEOUT=10
UA="cuentas-venezuela-etl/0.1 (verify-sources)"

pad() { printf "%-44s" "$1"; }

probe() {
  local label="$1" url="$2" group="$3"
  if [[ "$ONLY" != "all" && "$ONLY" != "$group" ]]; then return; fi
  local out status ctype size
  out=$(curl -sS -L --max-time "$TIMEOUT" -A "$UA" \
        -o /tmp/_probe.body \
        -w "%{http_code}|%{content_type}|%{size_download}" \
        "$url" 2>&1) || true
  if [[ "$out" =~ ^[0-9]{3}\| ]]; then
    status="${out%%|*}"
    rest="${out#*|}"
    ctype="${rest%%|*}"
    size="${rest##*|}"
    local mark="✓"
    [[ "$status" =~ ^(2|3) ]] || mark="✗"
    printf "  [%s] %s %s  ct=%s  size=%s\n" "$mark" "$(pad "$label")" "$status" "${ctype:-?}" "$size"
  else
    printf "  [✗] %s ERROR  %s\n" "$(pad "$label")" "${out:0:80}"
  fi
}

section() { echo; echo "── $1 ──"; }

section "CHILE"
probe "INE bde API root"        "https://bdeapi.ine.gob.cl/api/series" chile
probe "INE censo descargas"     "https://www.ine.gob.cl/estadisticas/sociales/censos-de-poblacion-y-vivienda" chile
probe "datos.gob.cl CKAN API"   "https://datos.gob.cl/api/3/action/package_search?q=migracion&rows=3" chile
probe "datos.gob.cl SNM"        "https://datos.gob.cl/api/3/action/package_search?q=extranjeria" chile
probe "SII datos abiertos"      "https://www.sii.cl/sobre_el_sii/estadisticas_de_empresas.html" chile
probe "SP datos.gob.cl"         "https://datos.gob.cl/api/3/action/package_search?q=superintendencia+pensiones" chile
probe "Casen observatorio"      "https://observatorio.ministeriodesarrollosocial.gob.cl/encuesta-casen" chile
probe "BCCh API series"         "https://si3.bcentral.cl/SieteRestWS/SieteRestWS.ashx?user=&pass=&function=GetSeries" chile
probe "Mineduc datos"           "https://datosabiertos.mineduc.cl/" chile
probe "Registro Civil"          "https://datos.gob.cl/api/3/action/package_search?q=registro+civil" chile
probe "CEAD Carabineros"        "https://cead.spd.gov.cl/" chile

section "MIGRACION GLOBAL"
probe "R4V site"                "https://www.r4v.info/" migracion
probe "ACNUR API population"    "https://api.unhcr.org/population/v1/population/?coa_iso=CHL&coo_iso=VEN" migracion
probe "IOM portal"              "https://www.migrationdataportal.org/" migracion
probe "WB migration indicator"  "https://api.worldbank.org/v2/country/VEN/indicator/SM.POP.NETM?format=json&date=2010:2024" migracion
probe "OECD migration"          "https://stats.oecd.org/SDMX-JSON/data/MIG/all/all" migracion

section "MACRO VE / CRISIS"
probe "WB country VE"           "https://api.worldbank.org/v2/country/VEN?format=json" macro
probe "WB GDP per cap VE"       "https://api.worldbank.org/v2/country/VEN/indicator/NY.GDP.PCAP.CD?format=json&date=1998:2024" macro
probe "IMF WEO REST"            "https://www.imf.org/external/datamapper/api/v1/NGDPDPC/VEN" macro
probe "OVF site"                "https://observatoriodefinanzas.com/" macro
probe "Encovi UCAB"             "https://www.proyectoencovi.com/" macro
probe "OPEC MOMR landing"       "https://www.opec.org/opec_web/en/publications/202.htm" macro

section "DDHH"
probe "V-Dem datasets"          "https://v-dem.net/data/the-v-dem-dataset/" ddhh
probe "Freedom House CSV"       "https://freedomhouse.org/sites/default/files/2024-02/All_data_FIW_2013-2024.xlsx" ddhh
probe "RSF index"               "https://rsf.org/en/index" ddhh
probe "Foro Penal"              "https://foropenal.com/" ddhh
probe "HRW VE"                  "https://www.hrw.org/world-report/2024/country-chapters/venezuela" ddhh

echo
echo "Done. Marks: ✓=2xx/3xx  ✗=4xx/5xx/error"
