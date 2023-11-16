from typing import Tuple, NamedTuple
from contextlib import asynccontextmanager
from fastapi import FastAPI, HTTPException, Security, status
from fastapi.security import APIKeyHeader
import yaml
from databases import Database
from pydantic import BaseModel


class Count(BaseModel):
    wifi: int
    bluetooth: int


class Location(BaseModel):
    lat: float
    long: float


@asynccontextmanager
async def lifespan(app: FastAPI):
    await database.connect()
    yield
    await database.disconnect()


app = FastAPI(lifespan=lifespan)

api_key_header = APIKeyHeader(name="X-API-Key")

with open("keys.yaml") as f:
    api_keys = yaml.safe_load(f)

database = Database("sqlite:///device-data.db")


def get_api_key(api_key_header: str = Security(api_key_header)) -> str:
    if api_key_header in api_keys:
        return api_key_header
    raise HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Invalid or missing API Key",
    )


@app.get("/")
async def root():
    return "alive"


@app.post("/data/", status_code=204)
async def save_data(id: int, timestamp_unix_epoch: int, location: Location, device_count: Count,
                    api_key: str = Security(get_api_key)):
    corrected_device_count = int((device_count.bluetooth + device_count.wifi) / 0.7)

    # enforced types should mean no sql injection occurs
    query = "INSERT INTO device_data VALUES(:id, :timestamp, :lat, :long, :count)"
    values = {'id': id, 'timestamp': timestamp_unix_epoch, 'lat': location.lat, 'long': location.long,
              'count': corrected_device_count}

    await database.execute(query=query, values=values)
    return
