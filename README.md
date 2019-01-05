# project: dj-edb-webapp
**dj-edb Web Application** - *Project design documentation &amp; reference repository*

## Overview:
This repository serves as a journal to document and chronical the development of a Web Application that allows the public to easily listen to recordings of my live DJ Mixes over the Internet.  This project merges two of my passions: IT/Computing/Programming and Music (House Music DJ'ing). This Application is built "in the Cloud", using **Amazon Web Services (AWS)** - https://aws.amazon.com/. I've been educating myself on the AWS Cloud Platform, with the goal of earning multiple AWS Certifications in 2019 - https://aws.amazon.com/certification/ (*Cloud Practioner, Solutions Architect Associate, & Developer Associate*). This project is a practical application of what I've learned thus far (by taking online courses - https://acloud.guru/). This is in conjunction with the Web development skills I've acquired in recent years (through online training materials and experimentation).

This Web Application is ***"serverless"*** in its architecture - https://aws.amazon.com/serverless/. Meaning no physical or virtual servers are provisioned.  Instead, the Application is comprised of a collection of **AWS** services that work together to execute the Application code and deliver the user experience:

* **S3:** The AWS Simple Storage Service (*File Storage*). It is used to host the static Web Sites (*HTML/JS/CSS*) and cover art files. This utulization of S3 eliminates the need to provision a dedicated web server (*such as Apache or NGNIX*) *Documentation link: https://docs.aws.amazon.com/s3/index.html#lang/en_us*

* **Cognito:** The AWS Authentication service. It stores and authenticates user credentials and provides access tokens for the Backend REST API (data access). Using this service greatly reduces the amount of code needed to provide robust authentication functionality. *Documention link: https://docs.aws.amazon.com/cognito/index.html#lang/en_us*

* **API Gateway:** The AWS Web API Service. It provides a **REST**ful Client access interface to the Lambda Function that accesses the Database. *Documentation link: https://docs.aws.amazon.com/apigateway/latest/developerguide/welcome.html*

* **Lambda:** The AWS scalable Runtime environment host for executing re-usable, functional, code. In this application, it is used to execute the custom code to access the Back-end Database (*which is triggered by an API Call*). Lambda supports popular Runtime Environments (*Java, .NET, etc...*). This project uses the **NodeJS** Runtime - https://nodejs.org/ (***Javascript***). *Documentation link: https://docs.aws.amazon.com/lambda/index.html?id=docs_gateway#lang/en_us*

* **DynamoDB:** The AWS NoSQL database in the Cloud. It hosts the data-table containing the DJ Mix information displayed in the **Front-end** Client site. *Documentation link: https://docs.aws.amazon.com/dynamodb/index.html?id=docs_gateway#lang/en_us*

**Serverless** architectures have emerged as a popular design pratice. They allow applications to be developed, deployed, and scaled in a highly-effcient, and highly-available fashion. This Application was inspired by the AWS serverless ***"getting started"*** tutorial: https://aws.amazon.com/getting-started/projects/build-serverless-web-app-lambda-apigateway-s3-dynamodb-cognito/

The **dj-edb** Web Application consists of 2 major sub-projects:

* **Back-end:** A **REST**ful API (*https://en.wikipedia.org/wiki/Representational_state_transfer*) and Database to manage and exchange data with **Front-end** Clients, along with an Authentication Mechanism to secure data access.

* **Front-end:** Browser-based Clients that communicate with the Back-end to access and manage Mixes. The Application has separate Clients: One for playing Mixes and one for administering the Mix Information stored in the Back-end.

The **Back-end** is built out and tested first. Next, the **Front-end** is designed and deployed (first, the private Admin site and finally, the public Mix Audio site).

**Javascript** code is used for the both the Back-end (*NodeJS - https://nodejs.org/en/*) and Front-end (*Angular - https://angular.io/*). 

The Mix audio is streamed via online/Cloud services from SoundCloud https://soundcloud.com and MixCloud https://mixcloud.com. Both services allow users to upload audio files and embed streaming audio players (via HTML iframe) into their own custom site/application (dj-edb.com).

Below is a diagram that provides an architectural overview of the Application:

![Overview Diagram](/images/dj-edb_WebApp_ArchitectureOverview.png)

## Back-end:

The **Back-end** tier of the Application is comprised of a Database and a RESTful API to facilatate the exchange of data with the **Front-end** Client Web Applicaions. An Authentication service (**Cognito**) secures access to the data.

AWS **DynamoDB** is a cloud-based NoSQL Database service (*https://en.wikipedia.org/wiki/NoSQL*) that allows for the collection and management of data in a Document-based store (typically in a JSON-style key-value format).  In NoSQL Databases, unlike tradtional relational databases, Documents/Records can have varying combinations of fields and data types.  In other words, there is no specific "hard-wired" Schema that each Documen/Record is required to conform to. This has the advantage of providing data flexibility as an application's requirements evolve.

The layout of the mix information data is outlined below:

| *Field Name*    | *Data Type* | *Description*                  | *Note*      |
|-----------------|-------------|--------------------------------|-------------|
| MixId           | string      | Mix ID                         | Primary key |
| Title           | string      | Mix Title                      |             |
| About           | string      | About the Mix                  |             |
| DJ              | string      | DJ Name                        |             |
| Year            | string      | Year recorded                  |             |
| Month           | string      | Month recorded                 |             |
| Day             | string      | Day recorded                   |             |
| CoverArtURL     | string      | Cover Art image file URL       |             |
| SoundCloudURL   | string      | SoundCloud web site link URL   |             |
| SoundCloudHTML  | string      | Embedded SoundCloud player URL |             |
| MixCloudURL     | string      | MixCloud web site link URL     |             |
| MixCloudHTML    | string      | Embedded MixCloud player URL   |             |
| **Playlist**    | **list**    | **Track Play List**            |             |
| *TrackNumber*   |      string |             Track Number/Order |             |
| *TrackTitle*    |      string |                    Track Title |             |
| *TrackArtitst*  |      string |                   Track Artist |             |
| *TrackLabel*    |      string |               Track Label Name |             |
| *TrackYear*     |      string |             Track Release Year |             |
| **Comments**    | **list**    | **Member Comments**            |             |
| *MemberId*      |      string |                      Member ID |             |
| *Created*       |      string |        Comment Date/Time Stamp |             |
| *Text*          |      string |                   Comment Text |             |
| Created         | string      |  Item Creation Date/Time Stamp |             |
| LastUpdated     | string      |    Item Update Date/Time Stamp |             |

In AWS DynamoDB, **Items** (data records/documents) are stored in **Tables**. Tables contain **Attributes** (fields).  The DynamoDB console provides a GUI dialog for initializing a table:

* The Table for this Application is named: **dj_edb_mixes**. A Primary Key is required. I named it **MixId**. A *Sort Key* has been added to group mixes in order by **Year** (*recording year*). Each item added to the Table must contain a unique MixId and a Year. This helps the Database Engine store and partation the data for efficient retrival:
![Create Table - Part 1](/images/DynamoDB_CreateTable_1.png)

```
$ aws dynamodb describe-table --table-name dj_edb_mixes
```

```
{
    "Table": {
        "AttributeDefinitions": [
            {
                "AttributeName": "MixId",
                "AttributeType": "S"
            },
            {
                "AttributeName": "Year",
                "AttributeType": "S"
            }
        ],
        "TableName": "dj_edb_mixes",
        "KeySchema": [
            {
                "AttributeName": "MixId",
                "KeyType": "HASH"
            },
            {
                "AttributeName": "Year",
                "KeyType": "RANGE"
            }
        ],
        "TableStatus": "ACTIVE",
        "CreationDateTime": 1546293438.881,
        "ProvisionedThroughput": {
            "NumberOfDecreasesToday": 0,
            "ReadCapacityUnits": 5,
            "WriteCapacityUnits": 5
        },
        "TableSizeBytes": 6416,
        "ItemCount": 2,
        "TableArn": "arn:aws:dynamodb:us-east-1:225952625414:table/dj_edb_mixes",
        "TableId": "747ff781-223e-40f3-9c61-a5f258cdaaba"
    }
}
```