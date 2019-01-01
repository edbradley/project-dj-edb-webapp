# project-dj-edb-webapp
**dj-edb Web Application - ***Project design documentation &amp; reference repository*****

## Overview:
This project acts as a journal to document and chronical the development of a Web Application to allow the public to easily listen to my DJ Mixes via the Internet.  This project merges two of my passions: IT/Computing/Programming and Music (House Music DJ'ing). This application will be built "in the Cloud", using Amazon Web Services https://aws.amazon.com/ (AWS). I've been educating myself on the AWS Cloud Platform, with the goal of earning AWS Certifications in 2019 https://aws.amazon.com/certification/ (Cloud Practioner, Solutions Architect Associate, & Developer Associate). This project is a practical application of what I've learned thus far (via online training coursework) https://acloud.guru/.

This Application is "serverless" in its design https://aws.amazon.com/serverless/. Meaning no physical or virtual servers are provisioned.  Instead, the Application is comprised of a collection of AWS services that work together to execute code and deliver the user experience. Serverless architectures have emerged as a popular design pratice that allow applications to be developed, deployed, and scaled in a highly effcient, and robust fashion.

The Application consists of 2 major sub-projects:

* **Backend:** A REST API and Database to manage and exchange data with Frontend Clients, along with an Auhentication Mechanism to secure data access.

* **Frontend:** Browser-based Clients that communicate with the Backend to access and manage Mixes. The Application has separate Clients for playing Mixes and administering the Mix Information.

The **Backend** is built out and tested first. Next, the **Frontend** is designed and deployed (first, the private Admin site and finally, the public Audio site).

The Mix audio is streamed via online services from SoundCloud https://soundcloud.com and MixCloud https://mixcloud.com. Both services allow users to upload audio files and embed streaming audio players (via HTML iframe) into their custom site/application.