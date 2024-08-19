const express = require("express");
const router = express.Router({ mergeParams: true });

const catchAsync = require("../utils/catchAsync");
const ExpressError = require("../utils/ExpressError");

const Review = require("../models/reviews");
const Campground = require("../models/campground");
const { reviewValidation } = require("../models/campValidation");

const { isLoggedIn } = require("../middleware");

const validateReview = (req, res, next) => {
  const { error } = reviewValidation.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

router.post(
  "/",
  isLoggedIn,
  validateReview,
  catchAsync(async (req, res) => {
    console.log("Received POST request to add review");
    const campground = await Campground.findById(req.params.id);
    if (!campground) {
      console.log("Campground not found");
      throw new ExpressError("Campground not found", 404);
    }
    const review = new Review(req.body.review);
    review.author = req.user._id;
    console.log("Created new review:", review);
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    req.flash("success", "Review added");
    console.log("Saved review and updated campground");
    res.redirect(`/campgrounds/${campground._id}`);
  })
);

router.delete(
  "/:reviewId",
  catchAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    console.log(
      `Received DELETE request for review ${reviewId} on campground ${id}`
    );
    const campground = await Campground.findByIdAndUpdate(id, {
      $pull: { reviews: reviewId },
    });
    await Review.findByIdAndDelete(req.params.reviewId);
    req.flash("success", "Review deleted");
    console.log("Deleted review and updated campground");
    res.redirect(`/campgrounds/${campground._id}`);
  })
);

module.exports = router;
