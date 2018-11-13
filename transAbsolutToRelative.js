mod={ test : ()=>{
	[
		['/','/'],
		['/home/usr','/home/usr'],
		['/home/usr','/home'],
		['/home','/home/usr'],
		['/home/usr/js/codeBsp/evalReduce.js','/home/someOtherUsr/js/solé/PhyChemMath/modelica/zuErsetzenOderReaktivierenElektrolyse.js'],
		['/home/usr/js/solé/PhyChemMath/modelica/zuErsetzenOderReaktivierenElektrolyse.js','/home/usr/js/codeBsp/evalReduce.js'],
	].map((x)=>{
		var res = transAbsolutToRelative(x[0], x[1])
		console.log(res,'\n')
		return res
	})

},status:'Entwurf', moduleDescription:`Modul transAbsolutToRelative:
Get 2 Paths with .js files one is absolute Path to go and the other is the node where you start at 
Generate a relative Path from node to absolut
`}; var pa = process.argv; transAbsolutToRelative.mod = mod;  if( pa.find( a => a.match(/test[al]*/) ) ) {
  console.log('\nmoduleDescription (Status: '+mod.status+'):\n',mod.moduleDescription+'\nTestergebnis:'); 
  mod.test(); pa.find(a => a.match(/all/) ) ? pa.push('test') : pa.splice(pa.indexOf('test'), 1) }; 

/*
ich bin der absolute node und bekomme den absoluten path von einer Datei
*/
function transAbsolutToRelative(absolut, node){
	// console.log('\nVon: ',node,'\nNach: ',absolut,)
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