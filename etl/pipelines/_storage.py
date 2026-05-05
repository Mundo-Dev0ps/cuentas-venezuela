"""S3-compatible storage helpers (works with MinIO local and R2 prod)."""

from __future__ import annotations

import os
from io import BytesIO

import boto3
from botocore.client import Config


def s3_client():
    return boto3.client(
        "s3",
        endpoint_url=os.environ["S3_ENDPOINT"],
        region_name=os.environ.get("S3_REGION", "auto"),
        aws_access_key_id=os.environ["S3_KEY"],
        aws_secret_access_key=os.environ["S3_SECRET"],
        config=Config(signature_version="s3v4", s3={"addressing_style": "path"}),
    )


def put_parquet(key: str, data: bytes) -> None:
    bucket = os.environ["S3_BUCKET"]
    s3_client().put_object(
        Bucket=bucket,
        Key=key,
        Body=BytesIO(data),
        ContentType="application/vnd.apache.parquet",
    )


def get_parquet(key: str) -> bytes:
    bucket = os.environ["S3_BUCKET"]
    obj = s3_client().get_object(Bucket=bucket, Key=key)
    return obj["Body"].read()
