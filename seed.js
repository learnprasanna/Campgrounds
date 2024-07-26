const mongoose = require("mongoose");
const Campground = require("./models/campground");

mongoose.connect("mongodb://127.0.0.1:27017/campgrounds", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error"));
db.once("open", () => {
  console.log("Database Connected");

  const generateImageUrls = (num) => {
    const urls = [];
    for (let i = 0; i < num; i++) {
      urls.push(`https://picsum.photos/seed/${i}/350/350`);
    }
    return urls;
  };

  const imageUrls = generateImageUrls(60);

  Campground.find({})
    .then((campgrounds) => {
      campgrounds.forEach((campground, index) => {
        if (index < imageUrls.length) {
          campground.image = imageUrls[index];
          campground.author = "66a0610dc1ce155119966a35";
        }

        // Convert price to a number if it's a string
        if (
          typeof campground.price === "string" &&
          campground.price.startsWith("$")
        ) {
          campground.price = parseFloat(campground.price.replace("$", ""));
        }
      });

      // Use bulkWrite to update all campgrounds
      const bulkOps = campgrounds.map((campground) => ({
        updateOne: {
          filter: { _id: campground._id },
          update: {
            $set: { image: campground.image, price: campground.price },
          },
        },
      }));

      return Campground.bulkWrite(bulkOps);
    })
    .then((result) => {
      console.log("Campgrounds updated:", result);
      mongoose.connection.close();
    })
    .catch((err) => {
      console.error("Error updating campgrounds:", err);
      mongoose.connection.close();
    });
});
