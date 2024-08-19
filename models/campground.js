const mongoose = require("mongoose");
const Review = require("./reviews");
const { required } = require("joi");
const Schema = mongoose.Schema;

const opts = { toJSON: { virtuals: true } };

const campGroundSchema = new Schema({
  title: String,
  price: Number,
  image: { url: String, filename: String },
  geometry: {
    type: {
      type: String,
      enum: ["Point"],
      required: true,
    },
    coordinates: {
      type: [Number],
      required: true,
    },
  },
  description: String,
  location: String,
  author: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
}, opts);

campGroundSchema.virtual("properties.popupMarkup").get(function () {
  return `<a href="/campgrounds/${this._id}"> ${this.title} </a>`;
});

campGroundSchema.post("findOneAndDelete", async function (doc) {
  if (doc) {
    await Review.deleteMany({
      _id: {
        $in: doc.reviews,
      },
    });
  }
});

module.exports = mongoose.model("Campground", campGroundSchema);
