import os
from collections import defaultdict
from datetime import datetime, timedelta
from typing import Tuple, NamedTuple
from contextlib import asynccontextmanager
from fastapi import FastAPI, HTTPException, Security, status
from fastapi.security import APIKeyHeader
import yaml
from databases import Database
from pydantic import BaseModel
from starlette.responses import RedirectResponse


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


@app.get("/", include_in_schema=False)
async def root():
    return RedirectResponse("docs")


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


@app.get("/get-density/")
async def get_density(api_key: str = Security(get_api_key)):
    average = dict()
    latest = dict()

    now = datetime.now()
    now_hour = now.replace(second=0, microsecond=0, minute=0, hour=now.hour) + timedelta(hours=now.minute//30)
    now_hour_epoch = now_hour.timestamp()
    for hour in range(24):
        current_hour = (now_hour.hour - hour) % 24
        current_hour_epoch = now_hour.timestamp() + hour * 3600 * 1000

        query = "SELECT * FROM device_data WHERE timestamp >= :start AND timestamp <= :stop;"
        values = {'start': current_hour_epoch, 'stop': current_hour_epoch + 3600*1000}

        return_values = await database.fetch_all(query=query, values=values)
        data_sum = defaultdict(int)
        data_num = defaultdict(int)
        last_run_time = defaultdict(int)
        last_run_count = defaultdict(int)
        for value in return_values:
            data_sum[value['id']] += value['count']
            data_num[value['id']] += 1
            if value['timestamp'] > last_run_time[value['id']]:
                last_run_time[value['id']] = value['timestamp']
                last_run_count[value['id']] = value['count']

        average[hour] = dict()
        latest[hour] = dict()
        for device_id in data_sum.keys():
            average[hour][device_id] = data_sum[device_id] / data_num[device_id]
            latest[hour][device_id] = last_run_count[device_id]

    return {'average': average, 'latest': latest}
