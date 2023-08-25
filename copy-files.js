const fs = require("fs-extra");

const copyFile = async function () {
  try {
    fs.copySync("public", "./dist/public");
    fs.copySync("config.env", "./dist/config.env");
    fs.copySync("package.json", "./dist/package.json");
    fs.copySync("package-lock.json", "./dist/package-lock.json");
    fs.copySync(".gitignore", "./dist/.gitignore");

    console.log("Fichiers copiés avec succés");
  } catch (error) {
    console.log("Erreurs lors de la copie des fichiers", error);
  }
};

copyFile();
