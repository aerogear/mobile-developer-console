FROM centos:7.4.1708
ARG BINARY=./mobile-client-service
EXPOSE 4000

COPY ${BINARY} /opt/mobile-client-service
CMD "/opt/mobile-client-service"