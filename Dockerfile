FROM registry.access.redhat.com/ubi8/nodejs-10:1
EXPOSE 4000

USER default
COPY . ./

USER root
RUN chmod -R g+w src/

USER default
RUN npm install --silent && npm run build

CMD ["npm", "start"]
