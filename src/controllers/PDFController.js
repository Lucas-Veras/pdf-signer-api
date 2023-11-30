var fs = require("fs");
var path = require("path");
var plainAddPlaceholder =
  require("@signpdf/placeholder-plain").plainAddPlaceholder;
var signpdf = require("@signpdf/signpdf").default;
var P12Signer = require("@signpdf/signer-p12").P12Signer;

const sign = (req, res) => {
  try {
    if (!req.file || !req.body.name) {
      return res.status(400).json({ status: 400, error: 'File and name are required.' });
    }

    const fileName = req.file.originalname;
    const fileExtension = fileName.split('.').pop().toLowerCase();
    if (fileExtension !== 'pdf') {
      return res.status(400).json({ status: 400, error: 'Invalid file format. Only PDF files are allowed.' });
    }

    const { name } = req.body;

    const pdfBuffer = req.file.buffer;

    const certificatePath = path.join(__dirname, "../utils/certificate.p12");
    const certificateBuffer = fs.readFileSync(certificatePath);

    const signer = new P12Signer(certificateBuffer);

    const pdfWithPlaceholder = plainAddPlaceholder({
      pdfBuffer: pdfBuffer,
      name: name,
    });

    signpdf.sign(pdfWithPlaceholder, signer).then(function (signedPdf) {
      // const uploadsPath = path.join(__dirname, "../uploads/signed.pdf");
      // fs.writeFileSync(uploadsPath, signedPdf);

      res.setHeader("Content-Disposition", "attachment; filename=signed.pdf");
      res.setHeader("Content-Type", "application/pdf");
      res.status(200).send(signedPdf);
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: 500, error: error.message });
  }
};

module.exports = { sign };
