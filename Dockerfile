FROM centos:7.4.1708
ARG BINARY=./mobile-client-service
EXPOSE 4000

ADD ui/build /opt/mobile-client-service/ui
COPY ${BINARY} /opt/mobile-client-service/server/

ENV STATIC_FILES_DIR /opt/mobile-client-service/ui
CMD "/opt/mobile-client-service/server/mobile-client-service"