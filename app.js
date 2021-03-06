const express = require("express");
const app = express();
const port = 3000;
const multer = require("multer");
const upload = multer({ dest: "uploads/" });
const fs = require("fs");

const getTimeStamp = () => {
  const date = new Date();
  return `${date.getFullYear()}-${
    date.getMonth() + 1
  }-${date.getDate()}T${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
};

app.use(express.json());

app.get("/", (req, res) => {
  res.sendFile("index.html", { root: __dirname });
});

app.post("/", upload.array("files"), async (req, res) => {
  try {
    //take file move it into new post folder
    const postDirName = getTimeStamp();
    const destinationDir = `${__dirname}/site/content/posts/${postDirName}`;
    console.log(destinationDir);
    await fs.promises.mkdir(destinationDir, { recursive: true });
    for (let file of req.files) {
      const fileDir = `${__dirname}/uploads/${file.filename}`;
      await fs.promises.rename(
        fileDir,
        `/${destinationDir}/${file.originalname}`
      );
    }
    const imageTags = req.files.reduce((acc, curr) => {
      return (
        acc +
        `\n<img loading="lazy" src="/posts/${postDirName}/${curr.originalname}"></img>`
      );
    }, "");
    // const frontMatter = `---\ntags: post\ndate: ${Date.now()}\nreadableDate: ${postDirName}\n---\n`;
    const frontMatter = `---\ntags: post\ndate: ${postDirName.replace(
      "T",
      " "
    )}\nlayout: post.mustache\n---\n`;
    const imageBlock = `<div>${imageTags}</div>`;
    const postBody = `\n\n${req.body.postBody}`;
    await fs.promises.writeFile(
      `${destinationDir}/${postDirName}.md`,
      frontMatter + imageBlock + postBody
    );
    res.send("posted");
  } catch (err) {
    console.log(err.message);
    res.send("There was an error", err.message);
  }
  //add some cleanup here for if theres a failure
});

app.listen(port, () => {
  console.log(`app listening at http://localhost:${port}`);
});
