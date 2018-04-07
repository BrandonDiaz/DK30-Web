#!/bin/bash

npm install

if [[ ! -e .env ]]; then
    touch .env
    echo "DISCORD_CLIENT_ID=" >> .env
    echo "DISCORD_CLIENT_SECRET=" >> .env
    echo "DISCORD_CALLBACK_URL=" >> .env
    echo "SESSION_SECRET=" >> .env
    echo "DB_USER=" >> .env
    echo "DB_PASS=" >> .env
    echo "DB_HOST=localhost" >> .env
    echo "DB_PORT=27017" >> .env
    echo "DB_NAME=dk30" >> .env
fi