#!/bin/bash

# demo-magic from https://github.com/paxtonhare/demo-magic, MIT

. demo-magic.sh

DEMO_PROMPT="\[\e]0;\u@\h: \w\a\]uwmap@\h:\w\$ "

clear

pe "cd uwmap"

pe "python3 -m pip install -r backend_api/requirements.txt"
cat 3.o | pv --quiet --line-mode --rate-limit 12
pe "npm install --prefix ./main-app"

pe "systemctl stop nginx"
p "certbot certonly --standalone -m e226li@uwaterloo.ca -n -d demo.uwmap.live -d api.demo.uwmap.live --agree-tos"
sleep 1
cat 4.o | pv --quiet --line-mode --rate-limit 5
sleep 0.4
pe "systemctl start nginx"

p "sed 's/api.uwmap.live/api.demo.uwmap.live/g' -i nginx-fastapi.conf"
p "sed 's/uwmap.live/demo.uwmap.live/g' -i nginx-t3.conf"
p "cp {nginx-fastapi.conf,nginx-t3.conf} /etc/nginx/sites-available"
p "ln -s /etc/nginx/sites-available/{nginx-fastapi.conf,nginx-t3.conf}  /etc/nginx/sites-enabled/"
p "systemctl reload nginx"

pe "pushd backend_api"
pe "uvicorn api:app &"
pe "popd"

pe "pushd main-app"
pe "npm run dev &"
