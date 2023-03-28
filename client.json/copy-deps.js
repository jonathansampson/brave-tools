const fs = require("fs").promises;
const path = require("path");

const copyFile = async (source, target) => {
  // Copy source to targe, making sure the target directory exists.
  const targetDir = path.dirname(target);
  await fs.mkdir(targetDir, { recursive: true });
  await fs.copyFile(source, target);
};

// Copy index.html and bootstrap.min.css to the dist directory
copyFile("src/index.html", "dist/index.html");
copyFile("src/css/styles.css", "dist/css/styles.css");
copyFile(
  "node_modules/bootstrap/dist/css/bootstrap.min.css",
  "dist/css/bootstrap.min.css"
);
