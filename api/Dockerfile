FROM node:20-alpine

WORKDIR /app

COPY ./ ./

RUN npm install

RUN npm run build

# DATABASE
ENV DB_HOST=url
ENV DB_USERNAME=jk_admin
ENV DB_PASSWORD=1234
ENV DB_NAME=jktest

# security
ENV JWT_SECRET=secret
ENV JWT_ISSUER=nest
ENV JWT_AUDIENCE=http://localhost:3000
ENV JWT_EXPIRY=5m

EXPOSE 8000

CMD [ "node", "dist/main.js" ]