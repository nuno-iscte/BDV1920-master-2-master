FROM python:3.6.10
# see https://hub.docker.com/

USER root

# some useful stuff
RUN apt-get update -y; \
    apt-get install wget -y; \
    apt-get install apt-utils -y; \ 
    apt-get install vim-tiny vim-athena -y

RUN pip install --upgrade pip

# in case we need to convert files from xlsx to csv
#RUN pip install xlsx2csv

######################################

# Spark config
ENV SPARK_HOME=/usr/local/spark
ENV PYTHONPATH=$SPARK_HOME/python:$SPARK_HOME/python/lib/py4j-0.10.7-src.zip \
    SPARK_OPTS="--driver-java-options=-Xms1024M --driver-java-options=-Xmx4096M --driver-java-options=-Dlog4j.logLevel=info" \
    PATH=$PATH:$SPARK_HOME/bin

# Spark dependencies
ENV APACHE_SPARK_VERSION=2.4.5 \
    HADOOP_VERSION=2.7

RUN apt-get -y update && \
    apt-get install --no-install-recommends -y openjdk-11-jre-headless ca-certificates-java && \
    rm -rf /var/lib/apt/lists/*

# Using the preferred mirror to download the file
RUN cd /tmp && \
    wget -q $(wget -qO- https://www.apache.org/dyn/closer.lua/spark/spark-${APACHE_SPARK_VERSION}/spark-${APACHE_SPARK_VERSION}-bin-hadoop${HADOOP_VERSION}.tgz\?as_json | \
    python -c "import sys, json; content=json.load(sys.stdin); print(content['preferred']+content['path_info'])") && \
    echo "2426a20c548bdfc07df288cd1d18d1da6b3189d0b78dee76fa034c52a4e02895f0ad460720c526f163ba63a17efae4764c46a1cd8f9b04c60f9937a554db85d2 *spark-${APACHE_SPARK_VERSION}-bin-hadoop${HADOOP_VERSION}.tgz" | sha512sum -c - && \
    tar xzf spark-${APACHE_SPARK_VERSION}-bin-hadoop${HADOOP_VERSION}.tgz -C /usr/local --owner root --group root --no-same-owner && \
    rm spark-${APACHE_SPARK_VERSION}-bin-hadoop${HADOOP_VERSION}.tgz
RUN cd /usr/local && ln -s spark-${APACHE_SPARK_VERSION}-bin-hadoop${HADOOP_VERSION} spark

# Spark config
ENV SPARK_HOME=/usr/local/spark
ENV PYTHONPATH=$SPARK_HOME/python:$SPARK_HOME/python/lib/py4j-0.10.7-src.zip \
    SPARK_OPTS="--driver-java-options=-Xms1024M --driver-java-options=-Xmx4096M --driver-java-options=-Dlog4j.logLevel=info" \
    PATH=$PATH:$SPARK_HOME/bin

######################################

WORKDIR /home/bdvapp
RUN mkdir -p webapp
WORKDIR /home/bdvapp/webapp

ENV VIRTUAL_ENV=/opt/venv
RUN python3 -m venv $VIRTUAL_ENV
ENV PATH="$VIRTUAL_ENV/bin:$PATH"

#ENV PYSPARK_PYTHON=python3 
#ENV SPARK_HOME=${VIRTUAL_ENV}/lib/python3.6/site-packages/pyspark
# install dependencies:
COPY requirements.txt .
RUN pip install -r requirements.txt

COPY . ./

# make sure starting script is executable
# RUN chmod +x start.sh

# creates bdv user in dir /home/bdvapp, 
# and also gives ownership of directories and files
# as it should not be the root managing the app

RUN adduser --home /home/bdvapp bdv
RUN chown -R bdv ./   
USER bdv

#CMD [...]
