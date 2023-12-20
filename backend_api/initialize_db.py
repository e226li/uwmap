import sqlite3
import os

if os.path.isfile("device-data.db"):
    raise FileExistsError

con = sqlite3.connect("device-data.db")
cur = con.cursor()

cur.execute("CREATE TABLE device_data(id, timestamp, lat, long, count)")
cur.execute("CREATE INDEX timestamp_idx ON device_data(timestamp)")
cur.execute("CREATE TABLE device_data_verbose(id, timestamp, lat, long, count, details)")

con.commit()
