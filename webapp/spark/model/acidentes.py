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
		self.acidentes = self.rawacidentes.drop("COD_FACTOR_ATMOSFERICO")
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
	
	def get_TipoAcidente_p_Distrito(self, spark):

		df1 = spark.sql("SELECT COUNT(ID_ACIDENTE) AS N_Acidentes, DESC_DISTRITO, Tipo_Natureza FROM acidentes GROUP BY DESC_DISTRITO, Tipo_Natureza")
		listing = df1.toPandas().to_dict(orient='records') 
		jsonlisting = json.dumps(listing, indent=2)
		return jsonlisting

			
	def get_pD_Rain(self, spark):
		df1 = spark.sql("SELECT COUNT(FACTOR_ATMOSFERICO) AS Rain, DESC_DISTRITO FROM acidentes \
			Where FACTOR_ATMOSFERICO = 'Chuva' GROUP BY DESC_DISTRITO")	
		df1 = df1.toPandas().to_dict(orient='records') 
		df1 = json.dumps(df1, indent=2)
		return df1

	def get_pD_Fog(self, spark):
		df = spark.sql("SELECT COUNT(FACTOR_ATMOSFERICO) AS Fog, DESC_DISTRITO FROM acidentes \
			Where FACTOR_ATMOSFERICO = 'Nevoeiro' GROUP BY DESC_DISTRITO")	
		listing = df.toPandas().to_dict(orient='records') 
		jsonlisting = json.dumps(listing, indent=2)
		return jsonlisting

	def get_pD_Sun(self, spark):
		df = spark.sql("SELECT COUNT(FACTOR_ATMOSFERICO) AS Sun, DESC_DISTRITO FROM acidentes \
			Where FACTOR_ATMOSFERICO = 'Bom tempo' GROUP BY DESC_DISTRITO")	
		listing = df.toPandas().to_dict(orient='records') 
		jsonlisting = json.dumps(listing, indent=2)
		return jsonlisting

	def get_pD_Hail(self, spark):
		df = spark.sql("SELECT COUNT(FACTOR_ATMOSFERICO) AS Hail, DESC_DISTRITO FROM acidentes \
			Where FACTOR_ATMOSFERICO = 'Granizo' GROUP BY DESC_DISTRITO")	
		listing = df.toPandas().to_dict(orient='records') 
		jsonlisting = json.dumps(listing, indent=2)
		return jsonlisting

	def get_pD_NA(self, spark):
		df = spark.sql("SELECT COUNT(FACTOR_ATMOSFERICO) AS ConditionNotDefined, DESC_DISTRITO FROM acidentes \
			Where FACTOR_ATMOSFERICO = 'NÃO DEFINIDO' GROUP BY DESC_DISTRITO")	
		listing = df.toPandas().to_dict(orient='records') 
		jsonlisting = json.dumps(listing, indent=2)
		return jsonlisting

	def get_pD_Snow(self, spark):
		df = spark.sql("SELECT COUNT(FACTOR_ATMOSFERICO) AS Snow, DESC_DISTRITO FROM acidentes \
			Where FACTOR_ATMOSFERICO = 'Neve' GROUP BY DESC_DISTRITO")	
		listing = df.toPandas().to_dict(orient='records') 
		jsonlisting = json.dumps(listing, indent=2)
		return jsonlisting

	def get_pD_CloudofSmoke(self, spark):
		df = spark.sql("SELECT COUNT(FACTOR_ATMOSFERICO) AS CloudOfSmoke, DESC_DISTRITO FROM acidentes \
			Where FACTOR_ATMOSFERICO = 'Nuvem de fumo' GROUP BY DESC_DISTRITO")	
		listing = df.toPandas().to_dict(orient='records') 
		jsonlisting = json.dumps(listing, indent=2)
		return jsonlisting
	
	def get_pD_Windy(self, spark):
		df = spark.sql("SELECT COUNT(FACTOR_ATMOSFERICO) AS Windy, DESC_DISTRITO FROM acidentes \
			Where FACTOR_ATMOSFERICO = 'Vento Forte' GROUP BY DESC_DISTRITO")	
		listing = df.toPandas().to_dict(orient='records') 
		jsonlisting = json.dumps(listing, indent=2)
		return jsonlisting

	# more processing ... as needed
	
	# more getters ... as needed
	