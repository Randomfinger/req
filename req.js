mod={ test : ()=>{
  console.log(req(process.argv[1]))
},status:'Entwurf', moduleDescription:`Modul req:



Abbruch:
Wird wohl nix, weil es synchron alles lesen muss um es auch direkt zurrück zu geben 

reqDirty funktioniert, updatet sich selbst bei jedem aufruf ...

Besser ein Healrequire.js entwickeln das requires in files sucht und testet ob diese plausibel sind
und wenn nciht versucht tzu ersetzen



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
  console.log('\ninputPath:',inputPath,'X:',X)
  var original = inputPath
  inputPath = firstLevelNorm(inputPath)

	try {
	  var boooo = require(inputPath)
	}
	catch(error) {
	  console.error(error);
	  console.log('Pfad: '+inputPath,'nicht direkt requireble');
	  fs.watch('./', (eventType, filename) => {
		  console.log(`event type is: ${eventType}`);
		  if (filename) {
		  	fs.readFile('./'+filename,(paths)=>{
		  		var fund = paths.split('\n')
		  		.filter((pat)=>{
		  			return pat.match(original)
		  		}).forEach((fund)=>{
		  			console.log('Finalfund: ', fund)
		  		})
		  	})
		    console.log(`filename provided: ${filename}`);
		  } else {
		    console.log('filename not provided');
		  }
		});
	  console.log('\n\n#',genLinkList(inputPath))
	}
}

function firstLevelNorm(path){
	if (typeof path === 'string' && path.length > 1) {
		if (path.length > 2) {
			if (!!path.match(/^\./)) {
				if (!!path.match(/^\.\./)) {
					if ( !!path.match(/^\.\.\//) ) {
						return path
					}else{
						return './'+path
					}
				}else if(!!path.match(/^\.\//)){
					return path
				}else if(!!path.match(/^\.\w/)){
					return './'+path
				}else{
					return './'+path
				}
			}else{
				return './'+path
			}
		} else {
			console.log('Sehr kleiner path: ', path)
			return './'+path
		}
	} else {
		console.error('!unbrauchbarer Pfad: ', path)
	}
}

function genLinkList(path){
 glob = require('glob')
 glob('**/*.js', {}, function (er, files) {console.log(files)})
// require('child_process').execSync('rsync -avAXz --info=progress2 "/src" "/dest"', {stdio:[0,1,2]});
 console.log('\n\npath:',path)
 const { spawn } = require('child_process');
 let blankList = []
  const find = spawn('find', [formatRawPath(path)]);
  find.stdout.on('data', (data) => {
    blankList = blankList+data.toString()
  	// console.log(data.toString())
  });
  find.stdout.on('finish', (data) => {
    save('blank', blankList)
  	blankList = blankList.split('\n')
  	.filter((p)=>{
  		return p.match(/.js$/) 
  		&& !p.match(/node_modules/) 
  		&& !p.match(/.git/)
  	})
  	console.log(formatPathArr(blankList))
  	console.log('cmd war:'+'find '+formatRawPath(path))
  }).then((afterfinish)=>{ console.log('afterfinish',afterfinish) });
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

	// fs.readFile(filename, function(error, data) {
	// 	data=data+''
	// 	fs.writeFile('protokoll'+filename+'.js', def, 'utf8', 
	// 		function(cb){console.log('written to: '+'protokoll'+filename+'.js\n')})
	// })

	//rm -r blank*
	if (type == 'blank') {
		// console.log(blanklist)
		fs.writeFile('blank'+Date.now()+'.txt', blankList, 'utf8', 
			function(cb){console.log('written blanklist \n')})
	}
}

//wannabe...
// getIndexedBlanklist(){
// 	var filename = list.filter = blank.sort d.[0]
// 	return fs.readFile(filename, function(error, data) {
// 		data=data+''
// 	})
// }



module.exports = req