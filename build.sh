#!/bin/bash
apt-get update
apt-get install -y libssl-dev
composer install --no-scripts
