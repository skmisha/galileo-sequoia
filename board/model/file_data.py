import datetime


class FileMetaData(object):

    def __init__(self, bucket_name):
        self.date = "{}".format(datetime.datetime.now())
        self.key_name = self.date
        self.bucket_name = bucket_name
        self.desc = ""

    def getKeyName(self):
        return self.key_name

    def getDate(self):
        return self.date

    def setDesc(self, desc):
        self.description = desc
