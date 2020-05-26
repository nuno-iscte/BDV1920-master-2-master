#!/usr/bin/env bash

# make sure wget is installed, as well as xlsx2csv

# $ apt-get install wget (Linux)
# $ brew install wget   (Mac)
#                       (Windows)

# $ pip install xlsx2csv  (available from Python version 3)

# EU Open Data Portal
euopendata="https://www.ecdc.europa.eu/sites/default/files/documents/COVID-19-geographic-disbtribution-worldwide.xlsx"
wget ${euopendata} -O "covid19.xlsx" -o logfile
# dateRep, day, month, year, cases, deaths, countriesAndTerritories, geoId, 
# countryterritoryCode, popData2018, continentExp

xlsx2csv covid19.xlsx > covid19.csv
