import Letter from "../models/LetterModel.js";

export const addLetter = async (req, res) => {
  try {
    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).json({
        message: "Belum ada file yang diupload",
        status: "Gagal",
      });
    }
    const { name } = req.body;
    const { file } = req.files;
    const fileSize = file.data.length;
    const ext = path.extname(file.name);
    const fileName = file.md5 + ext;
    const url = `${req.protocol}://${req.get("host")}/images/${fileName}`;
    const allowedTypes = [".pdf"];
    if (!allowedTypes.includes(ext.toLowerCase())) {
      return res.status(422).json({
        message: "File tidak valid",
        status: "Gagal",
      });
    }
    if (fileSize > 5000000) {
      return res.status(422).json({
        message: "Gambar harus kurang dari 5 MB",
        status: "Gagal",
      });
    }
    file.mv(`./public/${fileName}`, async (err) => {
      if (err) {
        return res.status(500).json({
          message: "Gagal menyimpan file",
          status: "Gagal",
        });
      }

      try {
        createdLetter = await Letter.create({
          name: name,
          file: fileName,
          urlFile: url,
        });

        return res.status(201).json({
          message: "Berhasil menambah surat",
          status: "Berhasil",
          data: createdLetter,
        });
      } catch (error) {
        console.error(error);
        return res.status(400).json({
          message: "Gagal menambah surat ke database",
          status: "Gagal",
        });
      }
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Kesalahan server internal",
      status: "Gagal",
    });
  }
};

export const getLetters = async (req, res) => {
  try {
    const letters = await Letter.findAll();
    res.status(200).json({ message: "Berhasil", result: letters });
  } catch (error) {
    console.log(error);
  }
};
