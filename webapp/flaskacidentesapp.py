
from flask import Flask, request, render_template, jsonify, redirect
import json
import os
import logging

# importing own code 
from spark.spark import init_spark_session, stop_spark_session
from spark.model.acidentes import AcidentesModel

# sort of print
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# variables to hold/control information
datasource = os.path.abspath(os.path.dirname(__file__)) + "/datasource/ansr_dataset6.csv"
logger.info(" Raw data filename will be: " + datasource)
model = None
spark = init_spark_session("BDVapp")
app = Flask(__name__)


myTitle = 'Big Data Visualization'
# set routes to control the app

@app.route('/', methods=['GET'])
def home():
	logger.info(" ROUTE: / => MAPS")
	return render_template('maps.html',
							title = myTitle,
							template='maps-template'
						)

@app.route('/maps', methods=['GET'])
def maps():
    # create model
	logger.info(" ROUTE: Create model")
	global spark, datasource, model
	model = AcidentesModel(spark, datasource)
	listing = {}
	listing = model.get_NAcidentes_p_Distrito(spark)
	rain = model.get_pD_Rain(spark)
	fog = model.get_pD_Fog(spark)
	sun = model.get_pD_Sun(spark)
	hail = model.get_pD_Hail(spark)
	nao_def = model.get_pD_NA(spark)
	snow = model.get_pD_Snow(spark)
	cloudofsmoke = model.get_pD_CloudofSmoke(spark)
	wind_c = model.get_pD_Windy(spark)
	
	return render_template('maps.html',
							title = myTitle,
							data=listing,
							rain = rain,
							fog = fog,
							sun = sun,
							hail = hail,
							nao_def = nao_def,
							snow = snow,
							cloudofsmoke = cloudofsmoke,
							wind_c = wind_c,
							
							template='maps-template'
						)

@app.route('/stats', methods=['GET'])
def stats():
	logger.info(" ROUTE: / => STATS")
	global spark, datasource, model
	model = AcidentesModel(spark, datasource)
	crossfilter = model.get_crossfilter(spark)
	return render_template('stats.html',
							title = myTitle,
							data = crossfilter,
							template='stats-template'
						)

# run the app
if __name__ == "__main__":
	port = int(os.environ.get("PORT", 8080))
	app.run(host='0.0.0.0', port=port)



########################################################
# ROUTES AND HTML TEMPLATES SO FAR
#
#	/							home.html	
#	/mod						covid19/model.html
#	/vis/<country>			    covid19/vismodel.html
#	/about						about.html

########################################################
# Some information
#
# render_template alows to separate presentation from controller
# it will render HTML pages
# notice Flask uses Jinja2 template engine for rendering templates
# url_for() to reference static resources. 
# For example, to refer to /static/js/main.js, 
# you can use url_for('static', filename='js/main.js')
# request is to hold requests from a client e.g request.headers.get('')
# URLs to be handled by the app route handler
