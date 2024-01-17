<p align="center">
  <a href="https://uwmap.live" target="_blank" rel="noreferrer noopener">
    <img width="250" alt="UW Map Logo" src="https://github.com/e226li/uwmap/assets/110436783/28600b50-7e7e-4938-9440-2917e9d2fa94">
  </a>
</p>

<p align="center">A <strong>modern map</strong> for a modern campus.</p>
<br/>

<p align="center">
  <a href="https://uwmap.live/"><img src="https://img.shields.io/static/v1?label=&message=uwmap.live&color=%23202122&style=for-the-badge&logo=vercel&logoColor=%23fffffff" alt="uwmap.live"></a>
  <a href="https://api.uwmap.live/docs"><img src="https://img.shields.io/static/v1?label=&message=API&color=%233b82f6&style=for-the-badge&logo=fastapi&logoColor=%23fff" alt="API"></a>
</p>

<h2 align="center">UW Map</h2>
<br/>
<p align="center">
  UW Map is a webapp that allows students to find their way around the University of Waterloo campus, <strong>while avoiding all the traffic</strong>. It features a responsive, interactive map with a variety of useful features and helpful data.
</p>
<br/>
<br/>

## Deployment

### Web Server
Deployment server is running Debian 12 (Bookworm).

```bash
$ pwd
~/uwmap
```

Set up DNS:
```dns
uwmap.live.             300     IN      A       {ip}
api.uwmap.live.         300     IN      CNAME   uwmap.live.
```

Get packages: 
```bash
apt update -y && apt upgrade -y
apt install -y nginx python3 python3-pip nodejs npm certbot
```

Upgrade node, npm, and set up PM2:
```bash
npm install -g n
n latest
npm install -g npm@latest
npm install -g pm2
pm2 startup
```

Get dependencies:
```bash
python3 -m pip install -r backend_api/requirements.txt
npm install --prefix ./main-app
```

Get SSL certificates:
```bash
systemctl stop nginx
certbot certonly
systemctl start nginx
```

Set up reverse proxies:
```bash
cp {nginx-fastapi.conf,nginx-t3.conf} /etc/nginx/sites-available
ln -s /etc/nginx/sites-available/{nginx-fastapi.conf,nginx-t3.conf}  /etc/nginx/sites-enabled/
systemctl restart nginx
```

Generate secrets:
```bash
echo "- `openssl rand -hex 20`" | tee -a backend_api/keys.yaml
```

Run backend_api:
```bash
pushd backend_api 
pm2 start "TEST_ENV=0 uvicorn api:app" --name backend_api
popd
```

Run frontend:
```bash
pushd main-app 
npm run build
pm2 start npm --name "frontend" -- start
popd
```

Enable automatic startup after reboot:
```bash
pm2 save
```

View backend at [api.](https://api.uwmap.live) and frontend at [@.](https://uwmap.live).

### ESP32s

ArduinoIDE is used to deploy firmware (`./uwmap.ino`) to the ESP32s.

To deploy, connect the ESP32 to the computer and set the partition scheme: `Tools > Partition Scheme > Huge APP`.

Modify the line containing the "url" string so that `device_id=x` refers to a desired ESP32 id.

If connected via usb, it is necessary to put the ESP32 into download mode by holding the Boot and Reset buttons simultaneously.

Select the correct board and port, then run Upload.

## Developing

Documentation for the backend API is live at [api./docs](https://api.uwmap.live/docs).
