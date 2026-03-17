const fs = require('fs');
const path = require('path');

const publicDir = path.join(__dirname, 'public');
const files = fs.readdirSync(publicDir).filter(f => f.endsWith('.html'));

files.forEach(file => {
  const filePath = path.join(publicDir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Replace absolute static paths with relative
  content = content.replace(/href="\/css\//g, 'href="./css/');
  content = content.replace(/src="\/js\//g, 'src="./js/');
  content = content.replace(/href="\/([a-zA-Z0-9-]+\.html(?:\?[^"]*)?)"/g, 'href="./$1"');
  
  fs.writeFileSync(filePath, content);
  console.log(`Updated ${file}`);
});
