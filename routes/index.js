const { mediaRoutes } = require("./v1/media.routes");
const { subCategoryRouter } = require("./v1/subCategory.routes");
const { categoryRouter } = require("./v1/category.routes");
const { parentCategoryRouter } = require("./v1/parentCategory.routes");
const { authRouter } = require("./v1/auth.routes");

const express = require("express");
const router = express.Router();

const moduleRoutes = [
  { path: "/media", router: mediaRoutes },
  { path: "/auth", router: authRouter },
  { path: "/parent-categories", router: parentCategoryRouter },
  { path: "/categories", router: categoryRouter },
  { path: "/sub-categories", router: subCategoryRouter },
];

moduleRoutes.forEach((route) => router.use(route.path, route.router));

module.exports = router;
