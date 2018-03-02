import csv
import sys
from pymongo import MongoClient

def dropCollection(collectionName, db):
    if collectionName in db.list_collection_names():
        db.drop_collection(collectionName)

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
        collectionName = fileName.split('/')
        collectionName = collectionName[len(collectionName)-1].split('.')[0]
        dropCollection(collectionName, mDb)
        with open(fileName,'rb') as csvFile:
            docArray = []
            reader = csv.reader(csvFile, quotechar='"')
            for row in reader:
                doc = createDocument(row)
                docArray.append(doc)
        if collectionName in mDb.list_collection_names():
            mDb[collectionName].insert_many(docArray)
