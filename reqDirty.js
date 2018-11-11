var ALL = `./
`

// ######

ALL = ALL.split('\n')
console.log(ALL.length)
var fs = require('fs')
const { spawn } = require('child_process');
var selfName = './req.js'


module.exports=(P, EntryP, forceUp)=>{
    var fund = ALL.find(p => p.match(P))
    var EntryP = EntryP || './'
    if (forceUp) {
      genLinkList(EntryP)
    }
    if (fund) {
      console.log('req: "'+P+'" -> '+fund)
      try {
        return require(fund)
      } catch(error) {
        console.error(error);
        genLinkList(EntryP)
      }  
    }else{
      genLinkList(EntryP)
      console.error('req path "'+P+'" unknown: ')
    }
}

function genLinkList(path){

 // console.log('\n\ngenLinkList, path:',path,'\n')
 const find = spawn('find', [path]);
 
 let blankList = []
  find.stdout.on('data', (data) => {
    blankList = blankList+data.toString()
    // console.log(data.toString())
  });


  find.stdout.on('finish', (data) => {
    blankList = blankList.split('\n')
    .filter((p)=>{
      return p.match(/.js$/) 
      && !p.match(/node_modules/) 
      && !p.match(/.git/)
    })
    
    fs.readFile(selfName, (err, fileData) => {
     if (err) throw err;
     var fileStr = fileData.toString().split( '// #####'+'#' )[1]
     var newFileStr = 'var ALL = `'+ blankList.join('\n') +'`\n// #####'+'#\n//'+new Date()+'\n'+fileStr

      fs.writeFile(selfName, newFileStr, 'utf8',  
       function(cb){console.log('...updated '+selfName+' \n')}) 
    });
  });


  find.stderr.on('data', (data) => {
    console.log(`find stderr: ${data}`);
  });
  find.on('close', (code) => {
    if (code !== 0) {
      console.log(`find process exited with code ${code}`);
    }
  });
}