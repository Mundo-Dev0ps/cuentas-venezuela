"""Unit tests for SERMIG pipeline transforms."""

from pipelines import extranjeria


def test_demo_dataframe_has_correct_schema_and_rows():
    df = extranjeria.fetch_demo()
    expected = {"year", "region_code", "region", "stock_legal"}
    assert set(df.columns) == expected
    # 16 regions × 7 years = 112 rows.
    assert df.height == 112
    assert df.schema["year"].is_integer()
    assert df.schema["stock_legal"].is_integer()


def test_demo_weights_sum_to_one():
    total = sum(extranjeria.DEMO_WEIGHTS.values())
    assert abs(total - 1.0) < 1e-6


def test_demo_totals_sum_per_year_matches_published_total():
    df = extranjeria.fetch_demo()
    for year, expected_total in extranjeria.DEMO_TOTALS.items():
        actual = df.filter(df["year"] == year)["stock_legal"].sum()
        # Allow rounding drift up to 16 (one per region).
        assert abs(actual - expected_total) <= 16, f"year={year}"


def test_parse_csv_with_aliased_columns():
    csv = b"anio,region,codigo_region,permanencias\n2023,Metropolitana,CL-RM,300000\n"
    df = extranjeria.parse_sermig_csv(csv)
    assert "year" in df.columns
    assert "region_code" in df.columns
    assert "stock_legal" in df.columns
    assert df.height == 1
