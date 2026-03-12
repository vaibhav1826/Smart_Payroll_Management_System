const fs = require('fs');
const path = require('path');

const baseDir = __dirname;
const servicesDir = path.join(baseDir, 'services');
const sharedDir = path.join(baseDir, 'shared');

const targetDirs = ['models', 'controllers', 'routes', 'middleware', 'utils'];
targetDirs.forEach(dir => {
    const p = path.join(baseDir, dir);
    if (!fs.existsSync(p)) fs.mkdirSync(p, { recursive: true });
});

// Move services
if (fs.existsSync(servicesDir)) {
    const domains = fs.readdirSync(servicesDir);
    domains.forEach(domain => {
        const domainPath = path.join(servicesDir, domain);
        if (fs.statSync(domainPath).isDirectory()) {
            ['models', 'controllers', 'routes'].forEach(type => {
                const typeDir = path.join(domainPath, type);
                if (fs.existsSync(typeDir)) {
                    const files = fs.readdirSync(typeDir);
                    files.forEach(file => {
                        fs.renameSync(path.join(typeDir, file), path.join(baseDir, type, file));
                    });
                }
            });
        }
    });
}

// Move shared
if (fs.existsSync(sharedDir)) {
    if (fs.existsSync(path.join(sharedDir, 'middleware'))) {
        fs.readdirSync(path.join(sharedDir, 'middleware')).forEach(file => {
            fs.renameSync(path.join(sharedDir, 'middleware', file), path.join(baseDir, 'middleware', file));
        });
    }
    if (fs.existsSync(path.join(sharedDir, 'utils'))) {
        fs.readdirSync(path.join(sharedDir, 'utils')).forEach(file => {
            if (file !== 'db.js') { // Skip duplicated db.js
                fs.renameSync(path.join(sharedDir, 'utils', file), path.join(baseDir, 'utils', file));
            }
        });
    }
    if (fs.existsSync(path.join(sharedDir, 'config.js'))) {
        fs.renameSync(path.join(sharedDir, 'config.js'), path.join(baseDir, 'config', 'config.js'));
    }
    if (fs.existsSync(path.join(sharedDir, 'rbac.js'))) {
        fs.renameSync(path.join(sharedDir, 'rbac.js'), path.join(baseDir, 'middleware', 'rbac.js'));
    }
}

// File content replacer
function replaceInFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;

    // Replace shared imports
    content = content.replace(/require\(['"]\.\.\/\.\.\/\.\.\/shared\/utils\/(.*?)['"]\)/g, "require('../utils/$1')");
    content = content.replace(/require\(['"]\.\.\/\.\.\/shared\/utils\/(.*?)['"]\)/g, "require('../utils/$1')");

    content = content.replace(/require\(['"]\.\.\/\.\.\/\.\.\/shared\/middleware\/(.*?)['"]\)/g, "require('../middleware/$1')");
    content = content.replace(/require\(['"]\.\.\/\.\.\/shared\/middleware\/(.*?)['"]\)/g, "require('../middleware/$1')");

    content = content.replace(/require\(['"]\.\.\/\.\.\/\.\.\/shared\/config['"]\)/g, "require('../config/config')");
    content = content.replace(/require\(['"]\.\.\/\.\.\/shared\/config['"]\)/g, "require('../config/config')");

    content = content.replace(/require\(['"]\.\.\/\.\.\/\.\.\/shared\/rbac['"]\)/g, "require('../middleware/rbac')");
    content = content.replace(/require\(['"]\.\.\/\.\.\/shared\/rbac['"]\)/g, "require('../middleware/rbac')");

    if (content !== original) {
        fs.writeFileSync(filePath, content, 'utf8');
    }
}

// apply to all targets
const allDirsToProcess = ['models', 'controllers', 'routes', 'middleware', 'utils', 'config'];
allDirsToProcess.forEach(dir => {
    const dPath = path.join(baseDir, dir);
    if (fs.existsSync(dPath)) {
        fs.readdirSync(dPath).forEach(file => {
            if (file.endsWith('.js')) {
                replaceInFile(path.join(dPath, file));
            }
        });
    }
});

// Update index.js
const indexFile = path.join(baseDir, 'index.js');
if (fs.existsSync(indexFile)) {
    let indexContent = fs.readFileSync(indexFile, 'utf8');
    indexContent = indexContent.replace(/require\(['"]\.\/services\/[^\/]+\/routes\/(.+?)['"]\)/g, "require('./routes/$1')");
    fs.writeFileSync(indexFile, indexContent, 'utf8');
}

// remove services and shared recursively
if (fs.existsSync(servicesDir)) fs.rmSync(servicesDir, { recursive: true, force: true });
if (fs.existsSync(sharedDir)) fs.rmSync(sharedDir, { recursive: true, force: true });

console.log("Migration complete");
