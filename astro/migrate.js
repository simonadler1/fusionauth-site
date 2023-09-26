import fs from 'fs';
import { execSync } from 'child_process';

const usage = `
Migrate a docs file. Will move all images and includes as best it can. Inspect it when done!
Usage migrate.js [options]
  -s, --source                The source file to migrate. Relative to 'site/v1/tech' (ex: getting-started/5-minute-docker.adoc)
  -t, --target                The target directory to migrate to. Relative 'astro/src/content/docs' (ex: get-started/download-and-install)
  -d, --debug                 Debug mode. Will log extra info. (optional)
`;

const state = {};

const debugLog = (...stuff) => {
  if (state.debug) {
    console.log(...stuff);
  }
}

const trickyUrlRegex = RegExp(/http[^ ]*\[(.*)]/);

const validateArgs = () => {
  try {
    if (!process.argv.find(arg => ['-t', '--target'].includes(arg))) {
      throw new Error('You must specify a target!');
    }

    if (!process.argv.find(arg => ['-s', '--source'].includes(arg))) {
      throw new Error('You must specify a source!');
    }

  } catch (e) {
    console.error(e.message);
    console.log(usage);
    process.exit(-1);
  }
  if (process.argv.length < 3 || process.argv.find(arg => ['-h', '--help'].includes(arg))) {
    console.log(usage);
    process.exit(0);
  }
};

const setState = () => {
  const s = process.argv.findIndex(arg => ['-s', '--source'].includes(arg));
  state.source = process.argv[s + 1];

  const t = process.argv.findIndex(arg => ['-t', '--target'].includes(arg));
  state.target = process.argv[t + 1];

  if (process.argv.find(arg => ['-d', '--debug'].includes(arg))) {
     state.debug = true;
  }

  const parts = state.target.split('/').map(part => part.split('-').join(' '));

  state.category = parts[0];
  if (parts.length > 1) {
    state.subcategory = parts[1];
  }
  if (parts.length > 2) {
    state.tertiary = parts[2];
  }

  debugLog('state', JSON.stringify(state, null, 2));
};

const gitMoveFile = (oldPath, newPath) => {
  console.log(`Moving ${oldPath} to ${newPath}`);
  execSync(`git mv ${oldPath} ${newPath}`, (err, stdout, stderr) => {
    if (err) {
      console.log(err);
      process.exit(-1);
    }
  });
}

const move = () => {
  const fileName = state.source.split('/').pop();
  const oldPath = '../site/docs/v1/tech/' + state.source;
  state.newPath = 'src/content/docs/' + state.target + '/' + fileName.replace('.adoc', '.mdx');

  if (!fs.existsSync(oldPath)) {
    throw Error(`${state.source} does not exist!`);
  }
  gitMoveFile(oldPath, state.newPath);
};

const convert = (filePath, partial = false) => {
  console.log(`Converting ${filePath} to proper mdx.`);

  const fileString = fs.readFileSync('./'+ filePath, 'utf8');
  const lines = fileString.split('\n');
  const outLines = [];
  let importIdx = 0;

  const addImport = (line) => {
    const prev = outLines.slice(0, importIdx);
    if (!prev.find(l => l === line)) {
      outLines.splice(importIdx, 0, line);
      importIdx++;
    }
    if (outLines[importIdx] !== '') {
      // add a blank line after imports
      outLines.splice(importIdx, 0, '');
    }
  }

  const doFrontMatter = () => {
    const next = () => {
      const line = lines.shift();
      if (line.startsWith('layout') || line.startsWith('navcategory')) {
        //skip
        next();
      } else if (line.trim() === '---') {
        outLines.push(`section: ${state.category}`);
        if (state.subcategory) {
          outLines.push(`subcategory: ${state.subcategory}`);
        }
        if (state.tertiary) {
          outLines.push(`tertcategory: ${state.tertiary}`);
        }
        outLines.push(line);
      } else {
        outLines.push(line);
        next();
      }
    }
    next();
    importIdx = outLines.length;
  };

  const moveInclude = (line) => {
    line = line.replace('include::', '').replace('\[\]', '');
    let newDir = '';
    let targetPath = state.target.split('/').pop();
    if (line.startsWith('docs/v1/tech/shared')) {
      newDir = 'src/content/docs/_shared/';
    } else if ('src/content/docs/' + state.target + '/') {
      newDir = 'src/content/docs/' + state.target + '/';
    } else {
      console.error(`I don't know where to put this!`, line);
      return;
    }
    const fileName = line.split('/').pop();
    const oldPath = '../site/' + line;
    const newPath = newDir + fileName.replace('.adoc', '.mdx');
    if (fs.existsSync(newPath)) {
      console.log(`Looks like ${newPath} already exists!`);
    } else {
      gitMoveFile(oldPath, newPath);
      convert(newPath, true);
    }
    const alias = fileName.replace('.adoc', '')
                          .replace('_', '')
                          .split('-')
                          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                          .join('');
    addImport(`import ${alias} from '${newPath}';`);
    outLines.push(`<${alias} />`);
  }

  const convertSourceBlock = (header) => {
    // WATCH IT there's several different ways for asciidoc to shove meta in around code blocks.
    const headerParts  = header.replace('[', '').replace(']', '').split(',');
    let lang = '';
    let title = '';
    if (headerParts.length > 1) {
      lang = headerParts[1].trim();
    }
    if (headerParts.length > 2) {
      title = ` title="${headerParts[2].trim().replace('title=', '')}"`;
    }

    let meta = lines.shift(); //might be a dash might not

    if (meta.startsWith('.')) {
       meta = meta.substring(1, meta.length);
       lines.shift(); // skip the dashes
       title = ` title="${meta}"`;
    }
    outLines.push('```' + lang + title);

    const next = () => {
      const line = lines.shift();
      debugLog(`source line`, line, lines.length);
      if (line.startsWith('----')) {
        outLines.push('```');
        return false;
      } else {
        outLines.push(line)
        return true;
      }
    }
    let keepGoing = true;
    while (keepGoing) {
      keepGoing = next();
    }
  };

  const handleAside = (line) => {
    const types = {
        'NOTE': 'note',
        'TIP': 'tip',
        'IMPORTANT': 'caution',
        'WARNING': 'caution'
    };
    let oldType = line.substring(1, line.indexOf(']'));
    const splits = oldType.split('.');
    let subType = '';
    if (splits.length > 1) {
      oldType = splits[0];
      subType = splits[1];
    }
    const newType = types[oldType];
    outLines.push(`<Aside type="${newType}">`);
    lines.shift(); // skip the dashes
    const next = () => {
      const line = lines.shift();
      if (line === '====') {
        outLines.push('</Aside>');
      } else {
        outLines.push(convertLine(line));
        next();
      }
    }
    next();
    addImport(`import Aside from 'src/components/Aside.astro';`);
  }

  const convertLine = (line) => {
    if (line.startsWith('=')) {
      line = line.replaceAll('=', '#');
    }
    const linkMatches = line.matchAll(/link:([^ ]*)\[([^:]*)]/g);
    if (linkMatches) {
      for (const match of linkMatches) {
        const old = match[0];
        const url = match[1];
        const label = match[2];
        if (label.includes('window="_blank"')) {
          const realLabel = label.split(',')[0];
          const a = `<a href="${url}" target="_blank">${realLabel}</a>`;
          line = line.replace(old, a);
        } else {
          const link = `[${label}](${url})`;
          line = line.replace(old, link);
        }
      }
    }
    const crumbMatches = line.matchAll(/\[breadcrumb]#([\w ]*)#/g);
    if (crumbMatches) {
      for (const match of crumbMatches) {
        const old = match[0];
        const label = match[1];
        const crumb = `<strong>${label}</strong>`;
        line = line.replace(old, crumb);
      }
    }
    while (line.includes('<<')) {
      const idx = line.indexOf('link:');
      let start = line.substring(idx, line.length);
      const text = start.substring(start.indexOf('<<') + 2, start.indexOf('>>'));
      start = start.replace(`<<${text}>>`, `<ScrollRef target="${text}" />`);
      line = line.substring(0, idx) + start;
      addImport(`import ScrollRef from 'src/components/ScrollRef.astro';`);
    }
    // please don't explode, please don't explode
    const matches = line.matchAll(/http[^ ]*\[([\w ]*)]/g);
    if (matches) {
      for (const match of matches) {
        const fragment = line.slice(match.index, match.index + match[0].length);
        const label = fragment.slice(fragment.indexOf('[') + 1, fragment.indexOf(']'));
        const url = fragment.slice(0, fragment.indexOf('['));
        const replacement = `[${label}](${url})`;
        line = line.replace(fragment, replacement);
      }
    }
    return line;
  }

  const moveImage = (imageLocation, imageFile) => {
    const oldPath = `../site/assets/img/docs/${imageLocation}`;
    const newPath = `public/img/docs/${state.target}/${imageFile}`;
    if (fs.existsSync(newPath)) {
      console.log(`Looks like ${newPath} already exists! Sweet!`);
    } else {
      gitMoveFile(oldPath, newPath);
    }
  };

  const handleImage = (line) => {
    line = line.replace('image::', '');
    const imageLocation = line.substring(0, line.indexOf('['));
    const imageFile = imageLocation.split('/').pop();
    const meta = line.substring(line.indexOf('[') + 1, line.indexOf(']')).split(',');
    const title = meta.shift();
    const props = meta.map(prop => {
        const [key, value] = prop.split('=');
        return `${key}="${value}"`;
    }).join(' ');

    outLines.push(`<img src="/img/docs/${state.target}/${imageFile}" alt="${title}" ${props} />`);
    moveImage(imageLocation, imageFile);
  };

  const skipLeads = [':code_id', ':sectnumlevels', '- <<', '* <<', '** <<'];
  const asides = ['[NOTE', '[TIP', '[IMPORTANT', '[WARNING'];

  const nextLine = (frontDone = false) => {
    if (lines.length === 0) {
      return [false, frontDone];
    }
    let line = lines.shift();
    debugLog(`working line`, line, lines.length, outLines.length);
    if (!line.trim()) {
      // empty line
      outLines.push(line);
      return [true, frontDone];
    } else if (line.trim() === '---' && !frontDone) {
      outLines.push(line);
      doFrontMatter();
      return [true, true]
    } else if (skipLeads.find(lead => line.startsWith(lead))) {
      // skip
      if (lines.length > 0 && lines[0].trim() === '') {
        // remove extra newline
        lines.shift();
      }
      return [true, frontDone];
    } else if (line.startsWith('[source')) {
      convertSourceBlock(line);
      return [true, frontDone];
    } else if (line.startsWith('include::')) {
      moveInclude(line);
      return [true, frontDone];
    } else if (asides.find(aside => line.startsWith(aside))) {
      handleAside(line);
      return [true, frontDone];
    } else if (line.startsWith('image::')) {
      handleImage(line);
      return [true, frontDone];
    } else {
      line = convertLine(line)
      outLines.push(line);
      return [true, frontDone];
    }
  };

  let continueLoop = true;
  let frontDone = false;
  while (continueLoop) {
    [continueLoop, frontDone] = nextLine(frontDone);
  }

  fs.writeFileSync(filePath, outLines.join('\n'), 'utf8');
};

console.log(`
          _                                      _        _     _  _  _  _                                           _  _  _                                                                                  _                                        
        _(_)_                                   (_)      (_)   (_)(_)(_)(_)                                       _ (_)(_)(_) _                                                                              (_)                                       
      _(_) (_)_      _  _  _  _      _  _  _  _  _     _  _     (_)      (_)_     _  _  _       _  _  _          (_)         (_)    _  _  _     _  _  _  _   _               _  _  _  _  _   _       _  _  _ (_) _  _    _  _  _  _   _       _  _     
    _(_)     (_)_  _(_)(_)(_)(_)   _(_)(_)(_)(_)(_)   (_)(_)    (_)        (_) _ (_)(_)(_) _  _(_)(_)(_)         (_)             _ (_)(_)(_) _ (_)(_)(_)(_)_(_)_           _(_)(_)(_)(_)(_)_(_)_  _ (_)(_)(_)(_)(_)(_)  (_)(_)(_)(_)_(_)_  _ (_)(_)    
   (_) _  _  _ (_)(_)_  _  _  _   (_)           (_)      (_)    (_)        (_)(_)         (_)(_)                 (_)            (_)         (_)(_)        (_) (_)_       _(_) (_) _  _  _ (_) (_)(_)         (_)       (_) _  _  _ (_) (_)(_)          
   (_)(_)(_)(_)(_)  (_)(_)(_)(_)_ (_)           (_)      (_)    (_)       _(_)(_)         (_)(_)                 (_)          _ (_)         (_)(_)        (_)   (_)_   _(_)   (_)(_)(_)(_)(_) (_)            (_)     _ (_)(_)(_)(_)(_) (_)             
   (_)         (_)   _  _  _  _(_)(_)_  _  _  _ (_) _  _ (_) _  (_)_  _  (_)  (_) _  _  _ (_)(_)_  _  _          (_) _  _  _ (_)(_) _  _  _ (_)(_)        (_)     (_)_(_)     (_)_  _  _  _   (_)            (_)_  _(_)(_)_  _  _  _   (_)             
   (_)         (_)  (_)(_)(_)(_)    (_)(_)(_)(_)(_)(_)(_)(_)(_)(_)(_)(_)(_)      (_)(_)(_)     (_)(_)(_)            (_)(_)(_)      (_)(_)(_)   (_)        (_)       (_)         (_)(_)(_)(_)  (_)              (_)(_)    (_)(_)(_)(_)  (_)
`);
console.log('\n\n');
validateArgs();
setState();
move();
convert(state.newPath);
console.log('\nALL DONE BRO! PLEASE CHECK MY WORK!');