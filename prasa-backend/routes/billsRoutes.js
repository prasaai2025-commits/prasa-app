const router = require("express").Router();
const multer = require("multer");

const storage = multer.diskStorage({
  destination: "uploads/bills/",
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname)
});

const upload = multer({ storage });

const { uploadBill } = require("../controllers/billsController");

router.post("/upload", upload.single("bill"), uploadBill);

module.exports = router;
