FROM registry.access.redhat.com/rhoar-nodejs/nodejs-10
EXPOSE 4000

USER default
COPY . ./

USER root
RUN chmod -R g+w src/

USER default
RUN npm install --silent && npm run build

CMD ["npm", "start"]