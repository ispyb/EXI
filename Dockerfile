FROM debian:9
ENV branch master
ENV DEBIAN_FRONTEND noninteractive
ENV JAVA_HOME /opt/jdk
ENV TOMCAT_VERSION 8.5.14
#######################
# PACKAGES
#######################

#RUN apt-get update && apt-get install -y wget unzip supervisor mysql-server mysql-client git vim python-suds python-pip && pip install requests
RUN apt-get update && apt-get install -y wget unzip supervisor mysql-server mysql-client git vim python-suds python-pip

#######################
# INSTALLING JAVA
#######################

#RUN cd /opt &&  wget --no-check-certificate --no-cookies --header "Cookie: oraclelicense=accept-securebackup-cookie" http://download.oracle.com/otn-pub/java/jdk/8u112-b15/jdk-8u112-linux-x64.tar.gz
#RUN cd /opt && tar xvfz jdk-8u112-linux-x64.tar.gz && ln -s jdk1.8.0_112 jdk
RUN apt-get install -y default-jdk
ENV JAVA_HOME /usr/lib/jvm/java-8-openjdk-amd64/jre
RUN export PATH=$JAVA_HOME/jre/bin:$PATH
#############################
# DOWNLOADING APACHE TOMCAT
#############################

# Get Tomcat
# RUN wget --quiet --no-cookies http://apache.rediris.es/tomcat/tomcat-8/v${TOMCAT_VERSION}/bin/apache-tomcat-${TOMCAT_VERSION}.tar.gz -O /tmp/tomcat.tgz && \
RUN wget --quiet --no-cookies https://archive.apache.org/dist/tomcat/tomcat-8/v${TOMCAT_VERSION}/bin/apache-tomcat-${TOMCAT_VERSION}.tar.gz -O /tmp/tomcat.tgz && \
tar xzvf /tmp/tomcat.tgz -C /opt && \
mv /opt/apache-tomcat-${TOMCAT_VERSION} /opt/tomcat && \
rm /tmp/tomcat.tgz && \
rm -rf /opt/tomcat/webapps/examples && \
rm -rf /opt/tomcat/webapps/docs && \
rm -rf /opt/tomcat/webapps/ROOT

RUN cd /opt  && chmod +x /opt/tomcat/bin/*sh
RUN sed -i 's/8080/8090/g' /opt/tomcat/conf/server.xml

#############################
# INSTALLING NPM
#############################
RUN apt-get install -y curl
#RUN curl -sL https://deb.nodesource.com/setup_10.x | bash -
RUN curl -sL https://deb.nodesource.com/setup_8.x | bash -
RUN apt-get install -y nodejs

#RUN apt-get update && apt-get install -y nodejs nodejs-legacy

RUN node --version
RUN npm --version
#RUN apt-get install -y npm nodejs nodejs-legacy

#############################
# DOWNLOADING EXI
#############################
#RUN mkdir /root/.ssh/
#ADD id_rsa /root/.ssh/id_rsa
#RUN touch /root/.ssh/known_hosts
#RUN ssh-keyscan gitlab.maxiv.lu.se >> /root/.ssh/known_hosts
RUN cd /opt/tomcat/webapps && mkdir /opt/tomcat/webapps/EXI
COPY . /opt/tomcat/webapps/ROOT/

#############################
# BUILDING EXI
#############################

#RUN echo '{ "proxy":"http://proxy.esrf.fr:3128", "https-proxy":"http://proxy.esrf.fr:3128"}' > /opt/tomcat/webapps/EXI/.bowerrc
RUN npm config set strict-ssl false && cd /opt/tomcat/webapps/ROOT && npm install && npm install -g bower --allow-root && npm install -g grunt && bower install --allow-root  && grunt --force
RUN apt-get install -y apt-utils procps

##################
# DOCKER SUPERVISOR
##################
RUN mkdir -p /var/log/supervisor
COPY supervisord.conf /etc/supervisor/supervisord.conf
COPY tomcat.conf /etc/supervisor/conf.d/tomcat.conf
#EXPOSE 9001

CMD ["/usr/bin/supervisord"]