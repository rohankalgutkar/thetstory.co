import csv
import sys
import json
import os.path
from pymongo import MongoClient

def initCollection(collectionName, db):
    print("Creating collection " + collectionName)
    db.create_collection(collectionName)
    print("Created collection " + collectionName)

def dropCollection(collectionName, db):
    print("Dropping collection " + collectionName)
    if collectionName in db.list_collection_names():
        db.drop_collection(collectionName)
        print("Collection " + collectionName + " dropped")

def createDocument(row):
    document = {}
    document['SKU'] = row[0]
    document['Description'] = row[1]
    document['Currency'] = row[2]
    document['Price'] = row[3]
    document['Category'] = row[4]
    document['AssetPath'] = row[5]
    document['IsActive'] = row[6]
    return document

if len(sys.argv) == 1:
    print('No file passed to load')
    sys.exit(1)
else:
    mClient = MongoClient()
    mDb = mClient.tstorydb
    for fileName in sys.argv[1:len(sys.argv)]:
        if os.path.isfile(fileName):
            collectionName = fileName.split('/')
            collectionName = collectionName[len(collectionName)-1].split('.')[0]
            dropCollection(collectionName, mDb)
            initCollection(collectionName, mDb)
            with open(fileName,'rb') as csvFile:
                docArray = []
                reader = csv.reader(csvFile, quotechar='"')
                next(reader, None)
                for row in reader:
                    doc = createDocument(row)
                    print("Adding document = " + json.dumps(doc))
                    docArray.append(doc)
            if collectionName in mDb.list_collection_names():
                mDb[collectionName].insert_many(docArray)
                print("Data loaded into " + collectionName)
        else:
            print(fileName + " does not exist!")
            sys.exit(0)
