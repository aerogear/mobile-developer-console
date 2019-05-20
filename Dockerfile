FROM nodeshift/centos7-s2i-nodejs:10.x
EXPOSE 4000

USER default
COPY . ./

USER root
RUN chmod -R g+w src/

USER default
RUN npm install --silent && npm run build

CMD ["npm", "start"]