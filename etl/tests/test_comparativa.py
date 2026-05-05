"""Smoke tests for comparativa pipeline data shape."""

from pipelines import comparativa


def test_data_has_5_nationalities_per_year():
    years = sorted({row[0] for row in comparativa.DATA})
    for y in years:
        nationalities = {row[1] for row in comparativa.DATA if row[0] == y}
        assert nationalities == {
            "Venezuela",
            "Perú",
            "Haití",
            "Colombia",
            "Bolivia",
        }, f"year={y}"


def test_no_typos_in_nationalities():
    nationalities = {row[1] for row in comparativa.DATA}
    assert "Haític" not in nationalities
