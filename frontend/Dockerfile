FROM nginx:alpine

# Copy nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Copy all static files
COPY *.html /usr/share/nginx/html/
COPY *.css /usr/share/nginx/html/
COPY *.js /usr/share/nginx/html/

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]