mod={ test : ()=>{
	[
		['/','/'], ['/F1','/'], ['/F1.js','/'], ['/F1.js','/F2'], ['/F1.js','/F2.js'], ['/F1','/F2.js'],
		['/','/F2.js'],
		['./','../'], //fail Von ../ - Nach ./ -> 		/.././ 
		['../','./'], //fail Von ./ - Nach ../ -> 		/../../ 
		['/home','/home/usr'],	['/home/usr','/home'], ['/home/usr/a/b/c','/'], ['/','/home/usr/a/b/c'],
		['/home/usr/a/b/c','/home/usr/a/b/c'], ['/home/usr/F1','/home/usr/F2.txt'],	['/home/usr/F1.js','/home/usr/F2.js'],
		['/home/usr/F1.js','/home/F2.js'], ['/home/F1.js','/home/usr/F2.js']
	].map((x,i)=>{
		var res = transAbsolutToRelative(x[0], x[1])
		console.log(i+' Von '+x[1]+' - Nach '+x[0]+' -> \t\t'+res,'\n')
		return res
	})

},status:'Entwurf', moduleDescription:`Modul transAbsolutToRelative:
Get 2 Paths with .js files one is absolute Path to go and the other is the node where you start at 
Generate a relative Path from node to absolut

Known fail: Übergabe von ['./','../'] Oder ['../','./']
`}; var pa = process.argv; transAbsolutToRelative.mod = mod;  if( pa.find( a => a.match(/test[al]*/) ) ) {
  console.log('\nmoduleDescription (Status: '+mod.status+'):\n',mod.moduleDescription+'\nTestergebnis:'); 
  mod.test(); pa.find(a => a.match(/all/) ) ? pa.push('test') : pa.splice(pa.indexOf('test'), 1) }; 

/*
ich bin der absolute node und bekomme den absoluten path von einer Datei
*/
function transAbsolutToRelative(absolut, node){
	// console.log('\nVon: ',node,'\nNach: ',absolut,)
	if (absolut.match(/^..?\//) || node.match(/^..?\//)) {console.log('!fail in transAbsolutToRelative, expect absolute paths...'); return 'fail '+absolut+node;}
	if (absolut.trim() == node.trim()){return './'}
	var abs = toSegments(absolut), 
		nod = toSegments(node),
		res= '', up = [], branch = [], stillClean = true
		len = 0
		// console.log('\nVon: ',JSON.stringify(nod),'\nNach: ',JSON.stringify(abs),)
		abs.pathSegs.length > nod.pathSegs.length ? len = abs.pathSegs.length : len = nod.pathSegs.length;
		for (var i = 0; i < len; i++) {
			var a = abs.pathSegs[i], n = nod.pathSegs[i]
			// console.log('\ni: '+i+',	node len: '+nod.pathSegs.length+', stillClean :'+stillClean+',	abs len: '+abs.pathSegs.length+'\n->>	a: '+a+'	?==	n: '+n) 			
			if (a === n && stillClean) {res='.'}
			else {
				stillClean = false
				if (nod.pathSegs.length >= i && n!= undefined) {
					up.push('..')
				}
				if (abs.pathSegs.length >= i+1) {
					branch.push(a)
				}
			}
		}
	return [ res, ...up, ...branch, abs.file].join('/')
}

/*erwarte validen Pfad*/
function toSegments(path){
	var pRes = path.split('/'),
	fRes = pRes[pRes.length-1]
	pRes.pop()
	return {pathSegs:pRes, file:fRes}
}

module.exports = transAbsolutToRelative