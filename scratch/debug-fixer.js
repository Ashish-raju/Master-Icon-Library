const fs = require('fs');
const SVGFixer = require('oslllo-svg-fixer');
const path = require('path');

const testSvg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="512" height="512"><path d="M12,0C5.373,0,0,5.373,0,12s5.373,12,12,12s12-5.373,12-12S18.627,0,12,0z"/></svg>';
const testSvgNoDims = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12,0C5.373,0,0,5.373,0,12s5.373,12,12,12s12-5.373,12-12S18.627,0,12,0z"/></svg>';

async function test() {
    const scratchDir = path.join(__dirname, 'test-fix');
    if (!fs.existsSync(scratchDir)) fs.mkdirSync(scratchDir, { recursive: true });
    
    fs.writeFileSync(path.join(scratchDir, 'with-dims.svg'), testSvg);
    fs.writeFileSync(path.join(scratchDir, 'no-dims.svg'), testSvgNoDims);
    
    const outputDir = path.join(scratchDir, 'output');
    if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });
    
    console.log('Running fixer...');
    await SVGFixer(scratchDir, outputDir, { showProgressBar: false }).fix();
    
    console.log('Result with dims:');
    const withDims = fs.readFileSync(path.join(outputDir, 'with-dims.svg'), 'utf8');
    console.log(withDims.substring(0, 150));
    const m1 = withDims.match(/d="M([\d\.]+)/);
    if(m1) console.log('Start coord:', m1[1]);
    
    console.log('\nResult no dims:');
    const noDims = fs.readFileSync(path.join(outputDir, 'no-dims.svg'), 'utf8');
    console.log(noDims.substring(0, 150));
    const m2 = noDims.match(/d="M([\d\.]+)/);
    if(m2) console.log('Start coord:', m2[1]);
}

test();
