FROM nginx

COPY _dist /usr/share/nginx/html

EXPOSE 80
