# req
make require rich

tl;dr automatic search for required files 

Imagine a project with many NodeJS modules written by different people.
The modules are in various directorys containing various reqires between them.

- Now you in a refactor or review process want to rearrange some modules.
If you move a module to an other dir you need to update all the modules 
which require the moved moudule in order to keep the code as consistent as before.
For one file you can easy do this by hand but as more files you move as more it 
starts do get annoying.
  -> heal.js
  Recursively searches .js files in a path then scan every file for require.
  It then try to replace every require with a path from the previsouly found list.
  At the end every possible replaceable require inside the whole dir is updated.
  
  To execute heal.js on your project you need to edit 2 variables in the file:
  - Change "indexRoot = './TestFiles'" to a top entry point where you want it to start scaning 
  - If "IKnowWhatIMDoing = false" it will just try to execute it and show what it would
    change in the console, for test and safety reasons ;). 
    Change "IKnowWhatIMDoing = true" and it will write the update to all the files!
    
  To test heal.js go to /req and type:
   > node heal.js test 
   ---> It will execute heal.js on the ./TestFiles dir with "IKnowWhatIMDoing = false"
    The result should be a list of objects in the console like:
      { file: './TestFiles/a/A/aa.js', oldPath: 'CC', newPath: './../../c/C/CC.js' }, ...
