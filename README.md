# UWMap

A modern map for a modern campus.

## Deployment

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

Upgrade node and npm:
```bash
npm -g n
n latest
npm install -g npm@latest
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
ln -s /etc/nginx/sites-available/{nginx-fastapi.conf,nginx-t3.conf}  /etc/nginx/sites-available/
systemctl restart nginx
```

Generate secrets:
```bash
echo "- `openssl rand -hex 20`" >> backend_api/keys.yaml
```

Run backend-api:
```bash
pushd backend_api 
TEST_ENV=0 uvicorn api:app
popd
```

Run frontend:
```bash
pushd backend_api 
npm run build && npm run start
popd
```

View backend at [api.](https://api.uwmap.live) and frontend at [@.](https://uwmap.live).

## Developing

Documentation for the backend API is live at [api./docs](https://api.uwmap.live/docs).
