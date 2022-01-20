import fs from 'fs';
import path from 'path';

const __dirname = path.resolve();
const directoryPath = path.join(__dirname, 'moc');

const rawFileData = (name, res) => {
  fs.readFile(path.resolve(directoryPath, `${name}.json`), (err, rawData) => {
    if (err) res.send('Parse File Error');
    try {
      res.json(JSON.parse(rawData));
    } catch {
      res.send('Parse File Error');
    }
  });
};

const allMocFiles = () => {
  const uniqueFileList = [];

  fs.readdirSync(directoryPath).forEach(file => {
    if (!/.json/.test(file)) {
      return;
    }
    const name = file.replace(/\.[^/.]+$/, "").replace(/[<>()\[\]\\.,;:]+/, "_");
    if (!uniqueFileList.includes(name)) {
      uniqueFileList.push(name);
    }
  })

  return uniqueFileList;
};

export const generateRouting = (router) => {
  allMocFiles().forEach(file => {
    const rawFile = (req, res) => {
      rawFileData(file, res)
    }

    router.get('/' + file, rawFile);
    router.post('/' + file, rawFile);
  })
};

export const credentials = () => {
  const privateKey = fs.readFileSync('sslcert/localhost.key', 'utf8');
  const certificate = fs.readFileSync('sslcert/localhost.crt', 'utf8');
  return { key: privateKey, cert: certificate };
};