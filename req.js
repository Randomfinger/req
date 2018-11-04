mod={ test : ()=>{
  console.log(req(process.argv[1]))
},status:'Entwurf', moduleDescription:`Modul req:
req soll:
1. eine link-liste generieren und separat speichern
	- formatRawPath:  handle übergabeparmeter
	- formatPathArr: handle cmd-result
	- destruct: split path 
	- getDefaultPath: generiere .. 
	- genPathFromSegs: array-fusion
	- save(todo): speichern in timestamp.json
2. wenn es required wird das übergebene modul zurrückgeben
3. eine heal function auf ein dir ausführen und die requires entsprechend korrigieren
Todo:
	1. Finde sinnvollen Path wenn übergebener invalide ist
	2. soll 2.&3.
	3. Blacklist funktion die nodemodule zb excludiert
`}; var pa = process.argv; req.mod = mod;  if( pa.find( a => a.match(/test[al]*/) ) ) {
  console.log('\nmoduleDescription (Status: '+mod.status+'):\n',mod.moduleDescription+'\nTestergebnis:'); 
  mod.test(); pa.find(a => a.match(/all/) ) ? pa.push('test') : pa.splice(pa.indexOf('test'), 1) }; 
const fs = require('fs')

/*
Hauptfunktion: 
erwarte inputPath als möglichst validen path für umgebung
X (todo) als modus o.ä.
*/
function req(inputPath, X){
  mod.args = false; var res = mod.args || '( ͡° ͜ʖ ͡°) - ¯\\_(ツ)/¯'
  // console.log('\ninputPath:',inputPath,'X:',X)
  mod.inputPath = inputPath
  genLinkList(inputPath)
  return res
}

function genLinkList(path){
 console.log('\n\npath:',path)
 const { spawn } = require('child_process');
 let blankList = []
  const find = spawn('find', [formatRawPath(path)]);
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
  	console.log(formatPathArr(blankList))
  	console.log('cmd war:'+'find '+formatRawPath(path))
    // save('blank', blankList)
  });
  find.stderr.on('data', (data) => {
    console.log(`ps stderr: ${data}`);
  });
  find.on('close', (code) => {
    if (code !== 0) {
      console.log(`ps process exited with code ${code}`);
    }
  });
}

function formatRawPath(path){
	let segs = path.split('/'), 
	 plen = segs.length,
	 last = segs.pop()
	console.log(segs)
	console.log(last)
	return getDefaultPath(segs, plen)
}
function destruct(path){
	let res = path.split('/'),
	isFile = res[res.length-1].match(/.[a-zA-Z]+$/),
	file = ''
	if (isFile) {
		file = res.pop()
	}
	return { len:res.length, path:res.join('/'), file, segs:res}
}

function formatPathArr(arr){
	arr = arr.map(destruct)
	return arr
}

function getDefaultPath(path, len){
	if (len > 3) {
		return genPathFromSegs(path, len-2)
	}else{
		console.log('Path is klein: '+ path)
		return genPathFromSegs(path, path.length)
	}
}

function genPathFromSegs(segs, len){
	if (Array.isArray(segs) && segs.length > 1) {
		let res = segs.slice(0,(len-1)).join('/') 
		console.log('genPathFromSegs: ',res)
		return res
	}else {console.log('!genPathFromSegs, kein Array übergeben: ', segs)}
}

function save(type, blankList){
	if (type == 'blank') {
		fs.write('./'+Date.now(), blankList)
	}
}


module.exports = req