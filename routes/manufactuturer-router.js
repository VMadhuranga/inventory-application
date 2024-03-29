const express = require("express");

const manufactureController = require("../controllers/manufacturer-controller");

const router = express.Router();

router.get("/manufacturers", manufactureController.manufacturerListGET);
router.get("/manufacturer/create", manufactureController.manufacturerCreateGET);
router.post(
  "/manufacturer/create",
  manufactureController.manufacturerCreatePOST,
);
router.get(
  "/manufacturer/:id/update",
  manufactureController.manufacturerUpdateGET,
);
router.post(
  "/manufacturer/:id/update",
  manufactureController.manufacturerUpdatePOST,
);
router.get(
  "/manufacturer/:id/delete",
  manufactureController.manufacturerDeleteGET,
);
router.post(
  "/manufacturer/:id/delete",
  manufactureController.manufacturerDeletePost,
);
router.get("/manufacturer/:id", manufactureController.manufacturerDetailGET);

module.exports = router;
