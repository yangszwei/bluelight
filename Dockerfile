FROM nginx:alpine

# Copy the Nginx configuration file
COPY ./nginx/nginx.conf /etc/nginx/nginx.conf

# Copy the website files
COPY . /usr/share/nginx/html

# Create a self-signed SSL certificate if none exists
RUN if [ ! -f /etc/nginx/certs/selfsigned.key ]; then \
        apk add --no-cache openssl && \
        mkdir -p /etc/nginx/certs && \
        openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
        -keyout /etc/nginx/certs/selfsigned.key \
        -out /etc/nginx/certs/selfsigned.crt \
        -subj "/C=TW/ST=Taiwan/L=Taipei/O=/OU=/CN=localhost"; \
    fi
