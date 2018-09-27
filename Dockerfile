FROM centos:7.4.1708
ARG BINARY=./mobile-developer-console
EXPOSE 4000

ADD ui/build /opt/mobile-developer-console/ui
COPY ${BINARY} /opt/mobile-developer-console/server/

ENV STATIC_FILES_DIR /opt/mobile-developer-console/ui
CMD "/opt/mobile-developer-console/server/mobile-developer-console"