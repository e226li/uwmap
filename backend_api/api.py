import os
import time
import asyncio
from collections import defaultdict
from datetime import datetime, timedelta
from itertools import chain
from typing import List
from contextlib import asynccontextmanager
from fastapi import FastAPI, HTTPException, Security, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import APIKeyHeader
import yaml
from databases import Database
from pydantic import BaseModel
from starlette.responses import RedirectResponse


class DeviceInfo(BaseModel):
    mac: str
    rssi: str


class Detected(BaseModel):
    device_info: List[DeviceInfo]


class Density(BaseModel):
    density: dict = dict()
    current_hour: int = datetime.now().hour


class AverageDensity(Density):
    density: dict = dict.fromkeys(range(24), dict())


@asynccontextmanager
async def lifespan(app: FastAPI):
    await database.connect()
    await database.execute("PRAGMA optimize")
    # for litestream support
    await database.execute("PRAGMA busy_timeout = 5000")
    await database.execute("PRAGMA journal_mode=WAL")
    yield
    await database.disconnect()


app = FastAPI(lifespan=lifespan, title="UWMap API", version="0.3.2", contact={"email": "info@uwmap.live"})

origins = [
    "https://uwmap.live",
    "http://localhost",
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)

api_key_header = APIKeyHeader(name="X-API-Key")

with open("keys.yaml") as f:
    api_keys = yaml.safe_load(f)

if os.getenv('TEST_ENV') == '1':
    database = Database("sqlite:///mock-backend.db")
else:
    database = Database("sqlite:///device-data.db")


def get_api_key(api_key_header: str = Security(api_key_header)) -> str:
    if api_key_header in api_keys:
        return api_key_header
    raise HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Invalid or missing API Key",
    )


async def fetch_from_db(target_hour, now_hour):
    current_hour_epoch = now_hour.timestamp() - (now_hour.hour - target_hour) % 24 * 3600
    query = "SELECT * FROM device_data WHERE timestamp >= :start AND timestamp <= :stop;"
    values = {'start': current_hour_epoch, 'stop': current_hour_epoch + 3600}
    return_values = await database.fetch_all(query=query, values=values)
    return return_values


@app.get("/", include_in_schema=False)
async def root():
    return RedirectResponse("docs")


@app.post("/send-data/", status_code=204)
async def save_data(device_id: int,  device_count: int, detected: Detected = None,
                    api_key: str = Security(get_api_key)):
    # enforced types should mean no sql injection occurs
    query = "INSERT INTO device_data VALUES(:id, :timestamp, :lat, :long, :count)"
    values = {'id': device_id, 'timestamp': time.time(), 'lat': 0, 'long': 0,
              'count': device_count}

    await database.execute(query=query, values=values)
    return


@app.get("/get-average-density/")
async def get_average_density(api_key: str = Security(get_api_key)) -> AverageDensity:
    density = AverageDensity()

    now = datetime.now()
    now_hour = now.replace(second=0, microsecond=0, minute=0, hour=now.hour) + timedelta(hours=now.minute//30)
    for hour in range(24):
        return_values_coroutines = [fetch_from_db(hour, now_hour - timedelta(days=day)) for day in range(3)]
        return_values_list = await asyncio.gather(*return_values_coroutines)
        return_values = chain.from_iterable(return_values_list)

        data_sum = defaultdict(int)
        data_num = defaultdict(int)
        for value in return_values:
            data_sum[value['id']] += value['count']
            data_num[value['id']] += 1

        density.density[hour] = dict()
        for device_id in data_sum.keys():
            density.density[hour][device_id] = data_sum[device_id] / data_num[device_id]

    return density


@app.get("/get-average-density-transposed/")
async def get_average_density_transposed(api_key: str = Security(get_api_key)) -> Density:
    average_density = await get_average_density()
    new_density = Density()

    transposed_density_dict = defaultdict(dict)
    for hour in average_density.density.keys():
        for device_id in average_density.density[hour].keys():
            transposed_density_dict[device_id][hour] = average_density.density[hour][device_id]

    new_density.density = transposed_density_dict

    return new_density


@app.get("/get-latest-density/")
async def get_latest_density(api_key: str = Security(get_api_key)) -> Density:
    density = Density()

    now = datetime.now()
    now_hour = now.replace(second=0, microsecond=0, minute=0, hour=now.hour) + timedelta(hours=1)
    for hour in range(24):
        return_values = await fetch_from_db(hour, now_hour)

        last_run_time = defaultdict(int)
        last_run_count = defaultdict(int)
        for value in return_values:
            if last_run_time[value['id']] < value['timestamp'] <= time.time():
                last_run_time[value['id']] = value['timestamp']
                last_run_count[value['id']] = value['count']

        for device_id in last_run_time.keys():
            if hour == now_hour.hour - 1:
                density.density[device_id] = last_run_count[device_id]

    return density
