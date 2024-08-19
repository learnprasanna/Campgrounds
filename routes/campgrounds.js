const express = require("express");
const router = express.Router();

const multer = require("multer");
const { storage } = require("../cloudinary");
const upload = multer({ storage });
const mbxGeoCoding = require("@mapbox/mapbox-sdk/services/geocoding");

const mboxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeoCoding({ accessToken: mboxToken });

const catchAsync = require("../utils/catchAsync");
const ExpressError = require("../utils/ExpressError");
const Campground = require("../models/campground");
const { isLoggedIn, isAuthor, validateCampground } = require("../middleware");

router.get(
  "/",
  catchAsync(async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render("campground/index", { campgrounds });
  })
);

router.get("/new", isLoggedIn, (req, res) => {
  res.render("campground/new");
});

router.post(
  "/",
  upload.single("image"),
  validateCampground,
  isLoggedIn,
  catchAsync(async (req, res) => {
    const geodata = await geocoder
      .forwardGeocode({
        query: req.body.campground.location,
        limit: 1,
      })
      .send();
    console.log(
      "LAT * LON #####################",
      geodata.body.features[0].geometry.coordinates
    );
    const campground = new Campground(req.body.campground);
    // console.log(campground);
    // console.log(req.file);
    campground.geometry = geodata.body.features[0].geometry;
    console.log(req.body);
    campground.author = req.user._id;
    campground.image = { url: req.file.path, filename: req.file.path };
    await campground.save();
    console.log(campground);
    req.flash("success", "Campground created successfully");
    res.redirect(`/campgrounds/${campground._id}`);
  })
);

router.get(
  "/:id",
  catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id)
      .populate("reviews")
      .populate("author");
    console.log(campground);
    if (!campground) {
      req.flash("error", "Campground not found");
      return res.redirect("/campgrounds");
    }
    res.render("campground/show", { campground });
  })
);

router.get(
  "/:id/edit",
  isLoggedIn,
  isAuthor,
  catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    if (!campground) {
      throw new ExpressError("Campground not found", 404);
    }
    res.render("campground/edit", { campground });
  })
);

router.put(
  "/:id",
  isLoggedIn,
  isAuthor,
  upload.single("image"),
  validateCampground,
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(
      id,
      { ...req.body.campground },
      { new: true }
    );
    if (req.file) {
      campground.image = { url: req.file.path, filename: req.file.filename };
    }
    await campground.save();
    req.flash("success", "Campground updated successfully");
    res.redirect(`/campgrounds/${campground._id}`);
  })
);

router.delete(
  "/:id",
  isLoggedIn,
  isAuthor,
  catchAsync(async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash("success", "Campground deleted");
    res.redirect("/campgrounds");
  })
);

module.exports = router;
