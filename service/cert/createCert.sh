#!/bash/bin
openssl req -new -nodes -x509 -days 365 -keyout domain.key -out domain.crt -config ssc.txt
