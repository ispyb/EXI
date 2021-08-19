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
# INSTALLING APACHE
#############################
RUN apt-get install -y apache2 ca-certificates
ENV APACHE_CONFDIR /etc/apache2
ENV APACHE_ENVVARS $APACHE_CONFDIR/envvars

RUN set -ex && \
	\
# generically convert lines like
#   export APACHE_RUN_USER=www-data
# into
#   : ${APACHE_RUN_USER:=www-data}
#   export APACHE_RUN_USER
# so that they can be overridden at runtime ("-e APACHE_RUN_USER=...")
	sed -ri 's/^export ([^=]+)=(.*)$/: ${\1:=\2}\nexport \1/' "$APACHE_ENVVARS" && \
	\
# setup directories and permissions
	. "$APACHE_ENVVARS" && \
	for dir in \
		"$APACHE_LOCK_DIR" \
		"$APACHE_RUN_DIR" \
		"$APACHE_LOG_DIR" \
		/var/www \
	; do \
		rm -rvf "$dir" \
		&& mkdir -p "$dir" \
		&& chown -R "$APACHE_RUN_USER:$APACHE_RUN_GROUP" "$dir"; \
	done

# Apache + PHP requires preforking Apache for best results
RUN a2dismod mpm_event && a2enmod mpm_prefork

# logs should go to stdout / stderr
RUN set -ex && \
	. "$APACHE_ENVVARS" && \
	ln -sfT /dev/stderr "$APACHE_LOG_DIR/error.log" && \
	ln -sfT /dev/stdout "$APACHE_LOG_DIR/access.log" && \
	ln -sfT /dev/stdout "$APACHE_LOG_DIR/other_vhosts_access.log"

# PHP files should be handled by PHP, and should be preferred over any other file type
RUN { \
		echo '<FilesMatch \.php$>'; \
		echo '\tSetHandler application/x-httpd-php'; \
		echo '</FilesMatch>'; \
		echo; \
		echo 'DirectoryIndex disabled'; \
		echo 'DirectoryIndex index.php index.html'; \
		echo; \
		echo '<Directory /var/www/>'; \
		echo '\tOptions -Indexes'; \
		echo '\tAllowOverride All'; \
		echo '</Directory>'; \
	} | tee "$APACHE_CONFDIR/conf-available/docker-php.conf" && \
	a2enconf docker-php

ENV PHP_EXTRA_BUILD_DEPS apache2-dev
ENV PHP_EXTRA_CONFIGURE_ARGS --with-apxs2

# Remove default VirtualHost
RUN rm -rf /etc/apache2/sites-enabled/000-default.conf /var/www/html

# Enable rewrite module
RUN a2enmod rewrite
RUN a2enmod expires
RUN a2dissite 000-default
RUN a2ensite 000-default

# Configure Apache2
ENV APACHE_RUN_USER www-data
ENV APACHE_RUN_GROUP www-data
#ENV APACHE_LOG_DIR /var/log/apache2
ENV APACHE_LOG_DIR /var/log/supervisor
ENV APACHE_PID_FILE /var/run/apache2.pid
ENV APACHE_RUN_DIR /var/run/apache2
ENV APACHE_LOCK_DIR /var/lock/apache2

#############################
# INSTALLING NPM
#############################
RUN apt-get install -y curl
#RUN curl -sL https://deb.nodesource.com/setup_10.x | bash -
RUN curl -sL https://deb.nodesource.com/setup_12.x | bash -
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
COPY . /var/www/

#############################
# BUILDING EXI
#############################

#RUN npm config set strict-ssl false && cd /opt/tomcat/webapps/ROOT && npm install && npm install -g bower --allow-root && npm install -g grunt && bower install --allow-root  && grunt --force
RUN npm config set strict-ssl false && cd /var/www/ && npm install && npm install -g bower --allow-root && npm install -g grunt && bower install --allow-root  && grunt --force
RUN apt-get install -y apt-utils procps


ENV APACHE_DOCUMENT_ROOT=/var/www/
RUN sed -ri -e 's!/var/www/html!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/sites-available/*.conf
RUN sed -ri -e 's!/var/www/!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/apache2.conf /etc/apache2/conf-available/*.conf

##################
# DOCKER SUPERVISOR
##################
RUN mkdir -p /var/log/supervisor
COPY docker-configs/supervisord.conf /etc/supervisor/supervisord.conf
#COPY docker-configs/tomcat.conf /etc/supervisor/conf.d/tomcat.conf
COPY docker-configs/apache2.conf /etc/supervisor/conf.d/apache2.conf
#EXPOSE 9001

CMD ["/usr/bin/supervisord"]