from typing import Tuple, NamedTuple

from fastapi import FastAPI, HTTPException, Security, status
from fastapi.security import APIKeyHeader
import yaml
import sqlite3


class Count(NamedTuple):
    wifi: int
    bluetooth: int


app = FastAPI()

api_key_header = APIKeyHeader(name="X-API-Key")

with open("keys.yaml") as f:
    api_keys = yaml.safe_load(f)


def get_api_key(api_key_header: str = Security(api_key_header)) -> str:
    if api_key_header in api_keys:
        return api_key_header
    raise HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Invalid or missing API Key",
    )


@app.get("/")
async def root():
    return


@app.post("/data/")
async def save_data(id: int, timestamp_unix_epoch: int, location: Tuple[float, float], device_count: Count):
    raise NotImplementedError
