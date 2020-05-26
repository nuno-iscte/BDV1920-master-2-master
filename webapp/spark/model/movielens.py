"""
Spark read/write model
"""
from __future__ import print_function

from pyspark.sql.types import *

#import numpy as np
import pandas
import json
#import glob
#import os
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)
	
class MovieLensModel:
	
	def read_data(self, spark, filename):
			
		# TO DO
		
	def __init__(self, spark, filename):
			
		logger.info(" Data model will be from: "+filename)
		# recall that Spark follows lazy computation
		
		self.read_data(spark, filename)
		
		# TO DO
		
		logger.info(" Data Model built.")



	# more processing ... as needed
	
	# more getters ... as needed
	