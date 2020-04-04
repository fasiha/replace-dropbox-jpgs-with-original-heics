var {readFileSync} = require('fs');
var assert = require('assert');

/**
 *
 * @param {string} s
 */
function parseExiftoolOutput(s) {
  const filesToMetadata = new Map([]);
  const metadataToFile = new Map([]);
  const photos = s.split('\n========');
  for (const photo of photos) {
    const lines = photo.trim().split('\n');
    if (lines.length < 2) { continue; }
    const match = lines[0].match(/^[= ]*(.*)/)
    assert(match && match[1], 'unable to find photo name: ' + photo);
    const photoname = match[1];
    const metadata = {};
    for (let i = 1; i < lines.length; i++) {
      const firstColonIdx = lines[i].indexOf(':');
      const field = lines[i].slice(0, firstColonIdx).trim();
      // if (field !== 'Create Date') { continue; }
      const data = lines[i].slice(firstColonIdx + 1).trim();
      metadata[field] = data;
    }
    const metadataStr = JSON.stringify(metadata);
    if (metadataStr === '{}') { continue; }
    filesToMetadata.set(photoname, metadataStr);
    metadataToFile.set(metadataStr, photoname);
  }
  return {filesToMetadata, metadataToFile};
}

if (require.main === module) {
  var heic = parseExiftoolOutput(readFileSync('heics.txt', 'utf8'));
  var jpgs = parseExiftoolOutput(readFileSync('jpgs.txt', 'utf8'));

  var hits = [];
  var cmds = [];
  for (const hmeta of heic.metadataToFile.keys()) {
    if (jpgs.metadataToFile.has(hmeta)) {
      hits.push([heic.metadataToFile.get(hmeta), jpgs.metadataToFile.get(hmeta), hmeta]);
      cmds.push(`cp "$SRC/${heic.metadataToFile.get(hmeta)}" "$TARGET/${jpgs.metadataToFile.get(hmeta)}.heic"`);
    }
  }
  console.log(cmds.join('\n'));
}
