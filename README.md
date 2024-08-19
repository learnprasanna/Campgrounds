# Campgrounds

Welcome to campgrounds. It is a RESTful application using Express.js and MongoDB to manage and display 
campsites in a specified location. The application features detailed attributes for each campsite, such as 
descriptions and pricing. Users can browse and view campsite details through a user-friendly interface, which 
includes an interactive map for selecting and exploring campsites. The backend provides API endpoints for 
CRUD operations on campsite data, and EJS is used for server-side rendering of dynamic content. Camp locations are geoohashed and saved for later use in cartographic representations. Authentication and authorization mechanisms are implemented to ensure secure user actions. Images are hosted on the cloud using cloudinary.

# Home Page
![Home](https://github.com/user-attachments/assets/df69bc86-37af-42c4-9cd1-e0779d0c18fa)

# Index Cluster Mapping
![campground](https://github.com/user-attachments/assets/68b87d59-cd39-43c2-8186-55ef6a91b48c)
With every new camp addition, the location of a camp is geohashed into longitude and latitude for representation on the clustermap with the help of MapBox API. The map is completely functional and based on new camps added it can populate the entirety of the globe and not just one local spot. 

# Campground Display
![Index-map](https://github.com/user-attachments/assets/5646d584-d5b0-4351-a735-934123a0ca07)
Each camp with its location hashed is represented on a 2-D map for much more detailed view and wherabouts. Users can add reviews and delete them as long as they are its owners. Each camp can only be modified by the user who created it and no one else hence maintaining security and avoiding data tampering.
