"""S3-compatible storage helpers (works with MinIO local and R2 prod).

Parquet writes are best-effort: pipelines should treat the archive
copy as optional. The Postgres upsert is the source of truth for the
API; if R2 happens to be down or misconfigured, the pipeline still
finishes and dashboards still get fresh data.
"""

from __future__ import annotations

import logging
import os
from io import BytesIO

import boto3
from botocore.client import Config
from botocore.exceptions import BotoCoreError, ClientError

log = logging.getLogger("etl._storage")


def _missing_envs() -> list[str]:
    return [k for k in ("S3_ENDPOINT", "S3_KEY", "S3_SECRET", "S3_BUCKET") if not os.environ.get(k)]


def s3_client():
    return boto3.client(
        "s3",
        endpoint_url=os.environ["S3_ENDPOINT"],
        region_name=os.environ.get("S3_REGION", "auto"),
        aws_access_key_id=os.environ["S3_KEY"],
        aws_secret_access_key=os.environ["S3_SECRET"],
        config=Config(signature_version="s3v4", s3={"addressing_style": "path"}),
    )


def put_parquet(key: str, data: bytes) -> bool:
    """Upload to S3-compatible storage. Returns True on success.

    Failures (missing env vars, bad creds, network) are LOGGED, never
    raised. Pipelines must keep going to the Postgres upsert step so
    the API has fresh data even when R2 is unavailable.
    """
    missing = _missing_envs()
    if missing:
        log.warning("put_parquet.skip key=%s reason=missing_env vars=%s", key, missing)
        return False
    bucket = os.environ["S3_BUCKET"]
    try:
        s3_client().put_object(
            Bucket=bucket,
            Key=key,
            Body=BytesIO(data),
            ContentType="application/vnd.apache.parquet",
        )
        return True
    except (ClientError, BotoCoreError) as e:
        log.warning("put_parquet.failed key=%s bucket=%s error=%s", key, bucket, e)
        return False


def get_parquet(key: str) -> bytes:
    bucket = os.environ["S3_BUCKET"]
    obj = s3_client().get_object(Bucket=bucket, Key=key)
    return obj["Body"].read()
