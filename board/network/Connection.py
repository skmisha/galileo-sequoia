#!/usr/bin/python

import json
import os
import urllib2

from boto import boto
from boto.s3.key import Key
import requests

from model.file_data import FileMetaData


class Connection(object):
    def __init__(self):
        self.AWS_ACCESS_KEY_ID = 'AKIAIEHHP5PKGBX2WG7Q'
        self.AWS_SECRET_ACCESS_KEY = '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'
        self.URL = "http://ec2-54-69-15-160.us-west-2.compute.amazonaws.com:3000/api/event"
        pass

    def connect(self):
        """
        Used to create connection for both s3 and our server
        @return: Connecting to s3 and getting
        """
        self._s3 = boto.connect_s3(self.AWS_ACCESS_KEY_ID, self.AWS_SECRET_ACCESS_KEY)
        self._bucket_name = "sequoia_bucket_1"
        self._bucket = self._s3.create_bucket(self._bucket_name)

        pass

    def upload_file(self, signal, description = ""):
        """
        Upload something to s3, creates metadata and send it to our server.
        @param description: str - Description of files to upload
        @param signal: FileDescriptor - signal to upload , but it can be anything(binary).
        @return: None
        """
        file_meta_data = FileMetaData(self._bucket_name)
        key = Key(self._bucket, file_meta_data.getKeyName())
        key.key = file_meta_data.getKeyName()
        key.set_contents_from_file(signal)
        file_meta_data.setDesc(description)

        self._send_meta_data(file_meta_data)
        pass

    def delete_all(self):
        """
        Should be called on destruction of all files. Bucket can be deleted only if there are no files
        @return: None
        """
        self._s3.delete_bucket(self._bucket_name)
        pass

    def _send_meta_data(self, file_meta_data):
        """
        Sending metadata through api
        @param file_meta_data: FileMetaData to upload by 'post' it to server
        @return:None
        """
        headers = {'content-type': 'application/json'}
        response = requests.post(self.URL, data=json.dumps(file_meta_data.__dict__),headers = headers)
        # req = urllib2.Request(self.URL)
        # req.add_header('Content-Type', 'application/json')
        # response = urllib2.urlopen(req,json.dumps(file_meta_data.__dict__))
        #TODO: Do something with response
        pass

if __name__ == '__main__':
    conn = Connection()
    conn.connect()
    cwd = os.getcwd()
    fd = open(os.path.join(cwd, "test.txt"))
    conn.upload_file(fd)
    pass