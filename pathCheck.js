const fs = require('fs');
const path = require('path');

// Adjust this to point to the folder you want to check
const ROOT_DIR = path.join(__dirname, 'src');

function checkCasing(dir) {
  const files = fs.readdirSync(dir);

  files.forEach((file) => {
    const fullPath = path.join(dir, file);
    const stats = fs.statSync(fullPath);

    // Check all files/folders in lowercase
    const actualFiles = fs.readdirSync(path.dirname(fullPath));
    const match = actualFiles.find(f => f === file);
    if (!match) {
      console.log(`Case mismatch detected: ${fullPath}`);
    }

    if (stats.isDirectory()) {
      checkCasing(fullPath);
    }
  });
}

checkCasing(ROOT_DIR);
console.log('Casing check completed!');