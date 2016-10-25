#!/usr/bin/env bash

now=$(date +%s)
length=55
end=$((now+length))

while [ $now -lt $end ]; do
    php /var/www/time_distance/app/console game:passportcontrol -v
    now=$(date +%s)
done
