import sqlite3
import time
import random

random.seed("acacf35fec8cecc4eb71ff329d1276111df44c7e")

con = sqlite3.connect("mock-backend.db")
cur = con.cursor()

cur.execute("CREATE TABLE device_data(id, timestamp, lat, long, count)")

lat_long = [(float(x), float(x)) for x in range(10)]
count = [random.randrange(10, 100) for x in range(10)]

timestamp = 1700086281.8461056
for x in range(10000):
    timestamp += random.randrange(100000, 150000)
    for y in range(10):
        timestamp += random.randrange(10000, 100000)
        count[y] = int(count[y] * (random.random() + 0.5)) + 1
        data = (y, timestamp, lat_long[y][0], lat_long[y][1], count[y])
        cur.execute("INSERT INTO device_data VALUES(?, ?, ?, ?, ?)", data)

con.commit()
