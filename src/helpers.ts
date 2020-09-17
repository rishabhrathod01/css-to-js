const postcss = require('postcss');
const postcssJs = require('postcss-js');


export default function convert(s: string) {
  let codeToConvert:string = s;
  let type: string = '';
  let jsStyle = {};
  console.log({codeToConvert});
  try {
    jsStyle = JSON.parse(codeToConvert);
    type = 'js';
  } catch (error) {
    console.log({error});
    type = 'css';
  }
  switch(type) {
    case 'css': {
      const root = postcss.parse(s);
      console.log({root});
      return JSON.stringify(postcssJs.objectify(root), null, 2);
    }
    case 'js': {
      return postcss().process(jsStyle, { parser: postcssJs }).then( (result: { css: any; }) => {
        return result.css;
      });
    }
    default: return s;
  }
}