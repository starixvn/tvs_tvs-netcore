// grab our gulp packages
let gulp = require('gulp'),
    fs = require('fs'),
    cheerio = require('cheerio'),
    ejs = require('ejs'),
    argv = require('yargs').argv,
    rimraf = require('rimraf'),
	path = require('path');

let encoding = 'utf8';
let workingPath = '../../';

function transform(transformFolder) {
    let outputFolder = getOutputFolder();
    let options = readOptions(outputFolder, transformFolder);
    changeFileNames(outputFolder, transformFolder);
    let template = fs.readFileSync(path.resolve(workingPath, './src/index.ejs'), encoding);
    let output = ejs.render(template, options);
    fs.writeFileSync(transformFolder + '/index.cshtml', output, encoding);
}

function getOutputFolder() {
    let content = fs.readFileSync(path.resolve(workingPath, './.angular-cli.json'), encoding);
    let json = JSON.parse(content);
    return path.resolve(workingPath, json.apps[0].outDir);
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

function readOptions(outputFolder, transformFolder) {
    let resourceDir = transformFolder.replace(/\.\.\//g, '');
    let content = fs.readFileSync(outputFolder + '/index.html', encoding);
    let $ = cheerio.load(content);
    let files = {
        js: [],
        css: []
    };

    let styleElements = $('link');
    styleElements.map((index, element) => {
        let css = resourceDir + '/' + changeBundle($(element).attr('href'));
        files.css.push(css);
    });

    let scriptElements = $('script');
    scriptElements.map((index, element) => {
        let js = resourceDir + '/' + changeBundle($(element).attr('src'));
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

gulp.task('default', () => {
    if (argv.path) {
		let p = workingPath + argv.path;
        rimraf.sync(p);
        fs.mkdirSync(p);
        transform(p);
    } else {
        throw new Error('Missing path');
    }
});