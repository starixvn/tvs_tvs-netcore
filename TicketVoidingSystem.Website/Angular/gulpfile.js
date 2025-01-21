// grab our gulp packages
const configPages = require('./gulpConfigPages');
const jeditor = require("gulp-json-editor");
const shell = require('gulp-shell');
const { task, series, src, dest } = require('gulp');
let fs = require('fs'),
  cheerio = require('cheerio'),
  ejs = require('ejs'),
  rimraf = require('rimraf'),
  path = require('path');
let encoding = 'utf8';

function transform(transformFolder, indexEJSPath) {
  let outputFolder = getOutputFolder();
  let options = readOptions(outputFolder);

  changeFileNames(outputFolder, transformFolder);
  let template = fs.readFileSync(path.resolve(indexEJSPath), encoding);
  let output = ejs.render(template, options);
  fs.writeFileSync(transformFolder + '/index.cshtml', output, encoding);
}

function getOutputFolder() {
  let content = fs.readFileSync(path.resolve('./angular.json'), encoding);
  let json = JSON.parse(content);
  return path.resolve(json.projects['project-tvs'].architect['build'].options['outputPath']);
}

function changeFileNames(outputFolder, transformFolder) {
  let fileNames = fs.readdirSync(outputFolder);
  let files = {
    css: [],
    js: []
  };

  fileNames.forEach(fileName => {
    let isCss = fileName.endsWith('.css');
    let isJs = fileName.endsWith('.js');
    if (isCss || isJs) {
      let words = fileName.split('.');
      let bundle = words[1];
      let newFileName = fileName.replace('.' + bundle, '');
      let oldPath = outputFolder + '/' + fileName;
      let newPath = transformFolder + '/' + newFileName;
      fs.renameSync(oldPath, newPath);
    } else {
      let oldPath = outputFolder + '/' + fileName;
      let newPath = transformFolder + '/' + fileName;
      fs.renameSync(oldPath, newPath);
    }
  });

  return files;
}

function readOptions(outputFolder) {
  let content = fs.readFileSync(outputFolder + '/index.cshtml', encoding);
  let $ = cheerio.load(content);
  let files = {
    js: [],
    css: []
  };

  let styleElements = $('link');
  styleElements.map((index, element) => {
    let css = changeBundle($(element).attr('href'));
    files.css.push(css);
  });

  let scriptElements = $('script');
  scriptElements.map((index, element) => {
    let js = changeBundle($(element).attr('src'));
    files.js.push(js);
  });

  let title = $('title').text();

  let options = {
    title: title,
    files: files
  };
  return options;
}

function changeBundle(fileName) {
  let words = fileName.split('.');
  let bundle = words[1];
  let newFileName = fileName.replace('.' + bundle, '');
  let newBundleName = newFileName + '?' + bundle;
  return newBundleName;
}

/* Define gulp task */
const taskList = configPages.map(page => {
  const modifyTSconfigTaskName = `modifyTSconfig-${page.pageName}`;
  const buildAngularTaskName = `buildAngular-${page.pageName}`;
  const postbuildTaskName = `postBuild-${page.pageName}`;

  task(modifyTSconfigTaskName, () => {
    return src("./src/tsconfig.app.json")
      .pipe(jeditor(function (json) {
        json.files = page.tsconfigFiles;
        return json;
      }))
      .pipe(dest("./src"));
  });

  task(buildAngularTaskName, shell.task(`ng build --configuration production --deploy-url ${page.deployUrl} --index ${page.index} --main ${page.main}`));

  task(postbuildTaskName, done => {
    rimraf.sync(page.transformFolder);
    fs.mkdirSync(page.transformFolder);
    transform(page.transformFolder, page.indexEJSPath);
    done();
  });

  return series(modifyTSconfigTaskName, buildAngularTaskName, postbuildTaskName);
});

exports.default = series(taskList);

