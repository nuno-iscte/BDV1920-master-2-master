"""
An example demonstrating ALS
"""
import sys
if sys.version >= '3':
    long = int

from pyspark.ml.evaluation import RegressionEvaluator
from pyspark.ml.recommendation import ALS
from pyspark.sql import Row

import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Based on example from Apache Spark distribution
# apache/spark/examples/src/main/python/ml/als_example.py

class Recommendation:

    def __init__(self, spark, filename):

        # TO DO
        # Read data
        #
        # self.ratings = ...
        (training, test) = ratings.randomSplit([0.8, 0.2])

        # Build the recommendation model using ALS on the training data
        # Note we set cold start strategy to 'drop' to ensure we don't get 
        # NaN evaluation metrics
        self.als = ALS(maxIter=5, regParam=0.01, userCol="userId", itemCol="movieId", ratingCol="rating",
              coldStartStrategy="drop")
        self.model = self.als.fit(training)

        # evaluate the model by computing the RMSE on the test data
        predictions = model.transform(test)
        evaluator = RegressionEvaluator(metricName="rmse", labelCol="rating",
                                    predictionCol="prediction")
        rmse = evaluator.evaluate(predictions)
        logger.info("Root-mean-square error = " + str(rmse))
        
    # top movie recommendations for each user
    def recommend_for_users(self, num_movies):
        return self.model.recommendForAllUsers(num_movies)

    # top user recommendations for each movie
    def recommend_for_movies(self, num_recommendations):
        return self.model.recommendForAllItems(num_recommendations)
    
    # top movie recommendations for a specified set of users
    def recommend_for_setusers(self, num_users):
        users = self.ratings.select(self.als.getUserCol()).distinct().limit(3)
        return self.model.recommendForUserSubset(users, num_users)
    
    # top user recommendations for a specified set of movies
    def recommend_for_setmovies(self, num_movies):
        movies = self.ratings.select(self.als.getItemCol()).distinct().limit(3)
        return self.model.recommendForItemSubset(movies, num_movies)
    