const fs = require('fs');
const path = require('path');
const glob = require('glob');

const args = process.argv.slice(2);
const basePath = args[0] || '.';
const outputFile = args[1] || 'readset-output.json';

const patterns = [
  path.join(basePath, 'internal/process/tasking/**/*.go'),
  path.join(basePath, 'internal/process/document/**/*.go'),
  path.join(basePath, 'internal/process/operation/**/impl.go'),
  path.join(basePath, 'internal/process/scoring/**/impl.go'),
];

const readSetRegex =
  /var\s+readSet\s*=\s*\[\]common\.HString\s*\{\s*([^}]+)\s*\}/gm;

const constRegex = /const\s*\(\s*([\s\S]*?)\s*\)/gm;
const constLineRegex = /(\w+)\s*=\s*"([^"]+)"/g;

function extractConstants(content) {
  const constants = {};
  let match;

  while ((match = constRegex.exec(content)) !== null) {
    const constBlock = match[1];
    let constMatch;

    constLineRegex.lastIndex = 0;

    while ((constMatch = constLineRegex.exec(constBlock)) !== null) {
      const constName = constMatch[1];
      const constValue = constMatch[2];

      const commentIndex = constValue.indexOf('//');
      const cleanValue =
        commentIndex !== -1
          ? constValue.substring(0, commentIndex).trim()
          : constValue.trim();

      constants[constName] = cleanValue;
    }
  }

  return constants;
}
function extractReadSet(content, filePath) {
  const results = [];
  let match;

  while ((match = readSetRegex.exec(content)) !== null) {
    const readSetContent = match[1];

    const values = readSetContent
      .split(',')
      .map((value) => value.trim())
      .filter((value) => value.length > 0)
      .map((value) => {
        const commentIndex = value.indexOf('//');
        if (commentIndex !== -1) {
          value = value.substring(0, commentIndex).trim();
        }

        if (value.startsWith('document.')) {
          return value.substring('document.'.length);
        }
        return value;
      })
      .filter((value) => value.length > 0);

    let t = path.basename(path.dirname(filePath));

    if (filePath.includes('scoring') || filePath.includes('operation')) {
      const match = content.match(
        /const\s+\(\s*[^)]*?processAndActivityName\s*=\s*"([^"]+)"[^)]*?\)/s
      );
      if (match && match[1]) {
        t = match[1].trim();
      }
    }

    results.push({
      type: t,
      readSet: values,
    });
  }

  return results;
}

async function main() {
  try {
    let files = [];
    for (const pattern of patterns) {
      const foundFiles = glob.sync(pattern);
      files = files.concat(foundFiles);
    }

    files = [...new Set(files)];

    const allReadSets = [];
    const allConstants = {};

    for (const filePath of files) {
      try {
        const content = fs.readFileSync(filePath, 'utf8');
        const fileName = path.basename(filePath);

        const readSets = extractReadSet(content, filePath);
        if (readSets.length > 0) {
          allReadSets.push(...readSets);
        }

        if (fileName === 'dp-ndf-v0_5_0.go') {
          const constants = extractConstants(content);
          Object.assign(allConstants, constants);
        }
      } catch (error) {
        console.error(`Error:`, error.message);
      }
    }

    const outputData = {
      extractedAt: new Date().toISOString(),
      searchPaths: [
        'internal/process/tasking/',
        'internal/process/document/',
        'internal/process/operation/',
        'internal/process/scoring/',
      ],
      totalFiles: files.length,
      totalReadSets: allReadSets.length,
      totalConstants: Object.keys(allConstants).length,
      readSets: allReadSets,
      constants: allConstants,
    };

    fs.writeFileSync(outputFile, JSON.stringify(outputData, null, 2));
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

main();
