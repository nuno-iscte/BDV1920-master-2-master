"""
Spark read/write model
"""
from __future__ import print_function

from pyspark.sql.types import *

import pandas
import json
import logging
import datetime

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

#######################################################
# Data from EU Open Data portal
# 	dateRep, day, month, year, cases, deaths, 
# 	countriesAndTerritories, geoId, 
# 	countryterritoryCode, popData2018, continentExp
#######################################################

#acidentes_data = 

class AcidentesModel:
	
	def read_data(self, spark, filename):
			
		self.rawacidentes = spark.read.csv(filename, inferSchema="true", header="true")
		
	
	def write_rawdata(self, spark, filename):
			
		# all together as 1 file
		self.rawacidentes.coalesce(1).write.csv(filename)  
	
	def write_data(self, spark, filename):
			
		self.acidentes.write.csv(filename)
		
		
	def __init__(self, spark, filename):
			
		logger.info(" Data model will be from: "+filename)
		# recall that Spark follows lazy computation
		
		self.read_data(spark, filename)
		
		# process dataframe then store outcome as a SQL table
		# (further processing, if wanted)
		self.acidentes = self.rawacidentes.drop("Hora")
		# self.covid19.cache
		# register dataframes as a SQL temporary view
		self.acidentes.createOrReplaceTempView("acidentes")
		#self.covid19.createGlobalTempView(self.covid19table)
		
		logger.info(" Data Model built.")


	def all(self, spark):
		# df = self.covid19
		# then using dataframe operators
		# or else ...
		df = spark.sql("SELECT * FROM acidentes ")
		# collect toPandas - records, columns, or index
		listing = df.toPandas().to_dict(orient='records') 
		# converts Python dictionary to final json string
		jsonlisting = json.dumps(listing, indent=2)
		#logger.info(jsonlisting)
		return jsonlisting

	def get_NAcidentes_p_Distrito(self, spark):

		df = spark.sql("SELECT COUNT(ID_ACIDENTE) AS N_Acidentes, DESC_DISTRITO FROM acidentes GROUP BY DESC_DISTRITO")
		listing = df.toPandas().to_dict(orient='records') 
		jsonlisting = json.dumps(listing, indent=2)
		return jsonlisting
	
	def get_NASemanas_p_Distrito(self, spark):

		df = spark.sql("SELECT COUNT(ID_ACIDENTE) AS N_Acidentes, DESC_DISTRITO, \
			MES_LABEL FROM acidentes GROUP BY DESC_DISTRITO, MES_LABEL")
		listing = df.toPandas().to_dict(orient='records') 
		jsonlisting = json.dumps(listing, indent=2)
		return jsonlisting

	# more processing ... as needed
	
	# more getters ... as needed
	