from datetime import datetime

class FeedSetAggregated:
	def __init__(self, breast_count, milk_ml, solid_ml, fmla_ml):
		self._breast_count = round(breast_count, 1)
		self._milk_ml = round(milk_ml, 1)
		self._solid_ml = round(solid_ml, 1)
		self._fmla_ml = round(fmla_ml, 1)

	def get_breast_count(self):
		return self._breast_count

	def get_milk_ml(self):
		return self._milk_ml

	def get_solid_ml(self):
		return self._solid_ml

	def get_fmla_ml(self):
		return self._fmla_ml

class FeedSet:
	def __init__(self, feed_records):

		milk_feeds = (x for x in feed_records if x.get_type() == 'milk')
		fmla_feeds = (x for x in feed_records if x.get_type() == 'formula')
		solid_feeds = (x for x in feed_records if x.get_type() == 'solid')

		self._breast_count = 0
		self._milk_ml = 0
		self._fmla_ml = 0
		self._solid_ml = 0

		# calculate everything in the constructor
		for milk in milk_feeds:

			# this is goofy: I'm storing the values as strings in 
			# the DB... both numeric and 'BR' or 'BL'
			# Need to fix that eventually, but not terribly important for now.
			try:
				self._milk_ml += int(milk.get_value())
			except:
				self._breast_count += 1

		# sum up forumula feeding amounts
		self._fmla_ml = sum(int(feed.get_value()) for feed in fmla_feeds)
		self._solid_ml = sum(int(feed.get_value()) for feed in solid_feeds)

	def get_breast_count(self):
		return self._breast_count

	def get_milk_ml(self):
		return self._milk_ml

	def get_fmla_ml(self):
		return self._fmla_ml

	def get_solid_ml(self):
		return self._solid_ml
