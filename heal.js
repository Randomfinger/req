mod={ test : ()=>{
	heal('./TestFiles')
},status:'Entwurf', moduleDescription:`Modul heal:
Ablauf
	1. Suche in einem Verzeichnis .js Dateien
	2. Suche in den Dateien nach require('||"/x.js'||")
	3. Ersetze Pfad in require wenn zuvor 
		als Pfad gefunden (zu relativem Pfad formatiert)

Todo:
	1. Replace require('reqDirty')(...)
	2. Deeper search not found paths in nodemodules 
		wenn nicht vorhanden try generateFileWithRequire -> execute
		wenn fehler generiere npm i script
			if insta execute script (eher greedy..)
			try generateFileWithRequire -> execute
	3. prüfe "var filePath = filePath" -> ...that = this :/
	4. trim fileNames

`}; var pa = process.argv; heal.mod = mod;  if( pa.find( a => a.match(/test[al]*/) ) ) {
  console.log('\nmoduleDescription (Status: '+mod.status+'):\n',mod.moduleDescription+'\nTestergebnis:'); 
  mod.test(); pa.find(a => a.match(/all/) ) ? pa.push('test') : pa.splice(pa.indexOf('test'), 1) }; 

/*
 Ich bin der absolute node und bekomme 
den absoluten path von einer Datei
*/
var genPath = require('./transAbsolutToRelative.js') //(absolut, node)
var fs = require('fs')

/* 
 Höchster Verzeichnispunkt, 
alle darunter liegenden Verzeichnisse werden bearbeitet 
*/
var indexRoot = './TestFiles'

/* !!!!!!!!!!!!!!!!!!!!!!!!!!!!
! Wenn diese Variable true ist, 
! werden potentiell alle **\*.js files
! in indexRoot verändert
!!!!!!!!!!!!!!!!!!!!!!!!!!!!!*/ 
var IKnowWhatIMDoing = false

//make List and goGoGO, start at rootDir...
function heal(rootDir){
  var rootDir = rootDir || indexRoot
  console.log('\nstart genLinkList '+rootDir)
  if (global.process.platform === 'linux') {
  	genLinkList(rootDir)
  }else{
  	console.log('nope weil: '+global.process.platform)
  }
}

//führe find in übergebenem Pfad aus, sammle Liste und pre-filter diese
blankList =''
function genLinkList(path){
 // console.log('\n\ngenLinkList, path:',path,'\n')
 const { spawn } = require('child_process');
 const find = spawn('find', [path]);
 
  find.stdout.on('data', (data) => {
    blankList = blankList+data.toString()
    console.log(data.toString().length, data.toString().slice(0,10))
  });


  find.stdout.on('finish', (data) => {
    blankList = blankList.split('\n')
    .filter((p)=>{
      return p.match(/.js$/) 
      && !p.match(/node_modules/) 
      && !p.match(/.git/)
    })
    console.log(blankList[0], '...'+blankList.length, blankList[blankList.length-1])
    walkList(blankList)
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

/*
For every FilePath:
	1. read File
	2. search & replace if possible
	3. write File / Protokoll in console
*/
function walkList(List){
  List.map((filePath)=>{
    // console.log('Walk: '+filePath)
    var filePath = filePath
      fs.readFile(filePath, 'utf8', 

        (err, file)=>{
          if (err) { console.log(err) }

          var file = (file+'').split('require')
          file = file.map((part, indx, arr)=>{
            return extractRequiredFile(part, filePath)
          }).join('require')

          if(IKnowWhatIMDoing){
	          Promise.resolve(file)
	          .then((finalString)=>{
	          	console.log('\n\n\n\n'+filePath)
	          	// console.log(f)
	            fs.writeFile(filePath, finalString, 'utf8',  
	       		function(cb){console.log('...updated '+filePath+' \n')}) 
	          })
          }
          else{console.log('..,~->\n!!!nicht geändert: '+filePath+'\n\n\n\n')}
        }

      );
  })
}

/*
erwarte part als string direkt nach einem require
- suche richtige Anführungszeichen
- splitte bei Aführugnszeichen dann bei '/', nehme letztes Glied
- wenn file in blankList generiere Relativen Pfad und ersetze alten
return durch fund verändert oder wenn kein fund original
*/
function extractRequiredFile(part, filePath){
  if (part.match(/^\s*\(\s*[\'\"]/)) {
  	var part = part.replace(/^\s*\(\s*/,'('),
  	splitter = part.substr(1,1)
  	var ext = part.split(splitter)
  	var p = ext[1].split('/')
  	var f = '/' + (p[p.length-1]+'.js').replace('.js.js','.js')
  	//filer falls mehrere gefunden werden
  	var reqReplace = blankList.filter(p => p.match(f))

  	if (reqReplace.length > 0) {
  		var newPath = reqReplace.map(x => genPath(x,filePath))
  			.sort((x,y)=>{return x.length -y.length}) [0] 
  			//..nimm den kürzesten Willkür!
  		var prot = {file:filePath, oldPath:ext[1], newPath:newPath}
  		console.log(prot)
  		ext[1] = newPath
  		var res = ext.join(splitter)
  		// console.log('\nres: '+res.substr(0,35)+'...')
  		return res
  	}else{
  		var res = ext.join(splitter)
  		// console.log('\nres: '+res.substr(0,35)+'...')
  		return res
  	}
  	// console.log('\n#'+filePath+'\n~'+f, )
  }else{
  	return part
  }
}


module.exports = heal