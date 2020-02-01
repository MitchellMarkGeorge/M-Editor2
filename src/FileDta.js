
// import * as fs from 'fs';

import * as path_os from 'path';

import * as is_image from 'is-image';
import * as image_type from 'image-type';


// import * as os from 'os';

import * as code from 'codemirror';

// // const fs = require('fs');
// // const path_os = require('path');
// // const os = require('os');
// // const code = require('codemirror');




// export default class Filetree2 {


//   // add icons
//   // create codemirrot documents for each file



//   constructor(path, name = null, isLeaf = false) {
//     this.path = path;
//     this.title = name;
//     this.children = [];
//     this.isLeaf = isLeaf;
//     this.selectable;
//     this.key;
//     this.saved = true;
//     this.document = undefined;
//     this.mode = undefined;
//     //this.text;
//     // would rather use numbers for key

//     // let meditor_config_path = path_os.join(path, 'm-editor.json')

//     // if(!fs.existsSync(meditor_config_path)) {

//     //   try {
//     //   fs.writeFileSync(meditor_config_path, '{\n\t"runscript": "the script you want the editor to run to start your project."\n}')
//     //   } catch (err) {
//     //     ;
//     //   }
//     // }
//     // ASYNC OR SYNC

//   }

//   path;
//   title;
//   children
//   isLeaf
//   document;
//   mode;
//   selectable;
//   expanded;
//   key;
//   saved;
//   //text
//   // would rather use numbers






//   static readDir(path) {
//     let fileArray = [];



//     let inital_array = fs.readdirSync(path);
//     // console.log(inital_array);
//     // might make async

//     if (inital_array.length === 0) {
//       console.log('empty arr');
//     }

//     // dont load node_modules files OR .git (do i need to remove .git???)
//     if (inital_array.includes('node_modules')) {
//       this.removeItem(inital_array, 'node_modules');

//     }

//     if (inital_array.includes('.git')) {

//       this.removeItem(inital_array, '.git');
//     }

//     if (inital_array.includes('.idea')) {

//       this.removeItem(inital_array, '.idea');
//     }

//     if (inital_array.includes('.vscode')) {

//       this.removeItem(inital_array, '.vscode');
//     }



// 	if (inital_array.includes('.DS_Store')) {
// 	  this.removeItem(inital_array, '.DS_Store');
// 	}


//     inital_array.forEach(file => {
//       let file_path = path_os.join(path, file);
//       let file_info = new Filetree2(file_path, file);

//       //let stat = fs.statSync(file_info.path);;

//       // make all fs methods async
//       // make stat/ readfile sync???
//       fs.stat(file_info.path, (err, stat) => {if (stat){

//         if (stat.isDirectory()) {
//           file_info.isLeaf = false;
//           //console.log('Folder');
//           file_info.selectable = false;
//           file_info.key = file_info.path

//           file_info.children = Filetree2.readDir(file_info.path);


//         } else if (stat.isFile()) {

//           //console.log('File')
//           file_info.isLeaf = true;
//           file_info.children = undefined;
//           file_info.selectable = true;
//           file_info.key = file_info.path;
//           // i could also use label (i can have some files with the same name)



//           fs.readFile(file_path, (err, file) => {
//             if (file) { 
//             let text = file.toString();
//             file_info.mode = code.findModeByFileName(file_info.title);
//             file_info.document = code.Doc(text, file_info.mode);

//             // code.modeURL = "node_modules/codemirror/mode/%N/%N.js"
//             // code.requireMode(file_info.mode.mode, () => {
//             //   console.log("done! mode loaded");
//             //     });

//           } else if (err) {
//             console.error(err);

//           }



//         });

//         // file_info.mode = code.findModeByFileName(file_info.label);
//         // file_info.document = code.Doc(file_info.text, file_info.mode);

//         // let text: any = fs.readFileSync(file_path)
//         //   text = text.toString();
//         //   file_info.mode = code.findModeByFileName(file_info.label);
//         //   file_info.document = code.Doc(text, file_info.mode)
//           //file_info.document;
//         } else if(err){
//           console.log(err);
//         }

//         // should i still do this???


//       //fileArray.push(file_info);


//       }});

//     //   if (stat.isDirectory()) {
//     //     file_info.children = Filetree.readDir(file_info.path);
//     //     delete file_info.document;

//     //   } else if (stat.isFile()) {
//     //     delete file_info.children;

//     //   fs.readFile(file_path, (err, file) => {if (file) { file_info.document = file.toString() }});
//     //     // file_info.document = data;
//     //   }

//     //   // should i still do this???


//     fileArray.push(file_info);


//     });



//     return fileArray;
//   }

//   static removeItem(arr, item) { 
//      let index = arr.indexOf(item);

//      if (index !== -1) {
//        arr.splice(index, 1);
//      }

//    }

//   build() {
//     console.log('building')

//     this.children = Filetree2.readDir(this.path);

//   }


// }

import fs from 'fs';
import path from 'path';

// make into promisies?????
// specify key

// export function walk2(project_path, callback) {
//   let rootObject = {
//     "path": project_path,
//     "title": path.basename(project_path),
//     "isLeaf": false,
//     "children": [],
//     "selectable": false
//   }
//   fs.readdir(project_path, function (err, inital_array) {
//     if (err) { return callback(err) }

//     if (inital_array.length === 0) {
//       console.log('empty arr');
//     }

//     // dont load node_modules files OR .git (do i need to remove .git???)
//     if (inital_array.includes('node_modules')) {
//       removeItem(inital_array, 'node_modules');

//     }

//     if (inital_array.includes('.git')) {

//       removeItem(inital_array, '.git');
//     }

//     if (inital_array.includes('.idea')) {

//       removeItem(inital_array, '.idea');
//     }

//     if (inital_array.includes('.vscode')) {

//       removeItem(inital_array, '.vscode');
//     }



//     if (inital_array.includes('.DS_Store')) {
//       removeItem(inital_array, '.DS_Store');
//     }

//     if (inital_array.length == 0) return callback(null, rootObject);

//     for (let item of inital_array) {

//       fs.stat(path_os.resolve(project_path, item), function (err, stats) {
//         if (err) return callback(err, null);
//         if (stats && stats.isDirectory()) {
//           walk2(path_os.resolve(project_path, item), function (err, res) {
//             if (err) return callback(err, null);
//             rootObject.children.push(res);
//           });
//         } else {
//           let file_content = fs.readFileSync(path_os.resolve(project_path, item))
            
//             if (file_content) {
//               let base64String;
//               let text = file_content;
//               let mode = code.findModeByFileName(item);
//               // let document = code.Doc(text.toString(), mode)
//               let document;
//               let isImage = is_image(path_os.resolve(project_path, item));
//               let imageType = image_type(text);

//               if (imageType) {
//                 let imageTypeMime = imageType.mime;
//                 let data = text.toString('base64');
//                 base64String = `data:${imageTypeMime};base64,${data}`

//               } else {
//                 text = text.toString(); // do i actually need to?
//                 document = code.Doc(text, mode)
//               }

//               let file_obj = {
//                 "path": path_os.resolve(project_path, item),
//                 "mode": mode,
//                 "document": document,
//                 "isLeaf": true,
//                 "title": item,
//                 "saved": true,
//                 "isImage": isImage,
//                 "base64": base64String
//               }
//               rootObject.children.push(file_obj);
              
//             }
          
          
//         }
//       })
//       if (!err) {callback(null, rootObject)}
//     }
    
    
//   })

// }


export function walk2(project_path, done) {

  var results = {
        "path": project_path,
        "title": path.basename(project_path),
        "isLeaf": false,
        "children": [],
        "selectable": false,
        "key": project_path 
      };

  //results.key = results.path;
  fs.readdir(project_path, function(err, list) {
    if (err) return done(err);
    if (list.length === 0) {
      console.log('empty arr');
    }

    // dont load node_modules files OR .git (do i need to remove .git???)
    if (list.includes('node_modules')) {
      removeItem(list, 'node_modules');

    }

    if (list.includes('.git')) {

      removeItem(list, '.git');
    }

    if (list.includes('.idea')) {

      removeItem(list, '.idea');
    }

    if (list.includes('.vscode')) {

      removeItem(list, '.vscode');
    }

    var i = 0;
    (function next() {
      var file = list[i++];
      //console.log(file) // first element in array???
      if (!file) return done(null, results);
      var file_path = path.resolve(project_path, file);
      fs.stat(file_path, function(err, stat) {
        if (stat && stat.isDirectory()) {
          walk(file_path, function(err, res) {
            
            //res.key = res.path;
            //results.key = res.path; 
            results.children.push(res);
            
            next();
          });
        } else {
          let base64String;
          let text = fs.readFileSync(file_path);
          let mode = code.findModeByFileName(file);
          // let document = code.Doc(text.toString(), mode)
          let document;
          let isImage = is_image(file_path);
          let imageType = image_type(text);

          if (imageType) {
            let imageTypeMime = imageType.mime;
            let data = text.toString('base64');
            base64String = `data:${imageTypeMime};base64,${data}`

          } else {
            text = text.toString(); // do i actually need to?
            document = code.Doc(text, mode)  
          } 

          

          

          let file_obj = {

            
            "path": file_path, 
            "mode": mode,
            "document": document,
            "isLeaf": true,
            "title": file,
            "saved": true, 
            "isImage": isImage, 
            "base64": base64String,
            "key": file_path
          }
          results.children.push(file_obj);
          next();
        }
      });
    })();
  });
};












export default function walk(dir, callback) {
  var results = {
    "path": dir,
    "title": path.basename(dir),
    "isLeaf": false,
    "children": [],
    "selectable": false


  };
  fs.readdir(dir, function (err, list) {
    if (err) { return callback(err); }

    if (list.length === 0) {
      console.log('empty arr');
    }

    // dont load node_modules files OR .git (do i need to remove .git???)
    if (list.includes('node_modules')) {
      removeItem(list, 'node_modules');

    }

    if (list.includes('.git')) {

      removeItem(list, '.git');
    }

    if (list.includes('.idea')) {

      removeItem(list, '.idea');
    }

    if (list.includes('.vscode')) {

      removeItem(list, '.vscode');
    }
    var pending = list.length;
    if (!pending) { return callback(null, results); }
    list.forEach(function (file) {
      fs.stat(dir + '/' + file, function (err, stat) {
        if (stat && stat.isDirectory()) { //path.resolve
          walk(dir + '/' + file, function (err, res) {
            // results.title = path.basename(results.path); // might handle err here
            // results.isLeaf = false;
            results.children.push(res);

            if (!--pending) { callback(null, results); }
          });
        } else {
          // let path = path_os.resolve(dir, file);
          // let text = fs.readFileSync(dir + "/" + file).toString();
          let base64String;
          let text = fs.readFileSync(dir + "/" + file);
          let mode = code.findModeByFileName(file);
          // let document = code.Doc(text.toString(), mode)
          let document;
          let isImage = is_image(dir + "/" + file);
          let imageType = image_type(text);

          if (imageType) {
            let imageTypeMime = imageType.mime;
            let data = text.toString('base64');
            base64String = `data:${imageTypeMime};base64,${data}`

          } else {
            text = text.toString(); // do i actually need to?
            document = code.Doc(text, mode)
          }





          let file_obj = {


            "path": dir + "/" + file,
            "mode": mode,
            "document": document,
            "isLeaf": true,
            "title": file,
            "saved": true,
            "isImage": isImage,
            "base64": base64String

            // "key": dir + "/" + file
          }

          // file_obj.mode = code.findModeByFileName(file);
          // file_info.document = code.Doc(text, file_obj.mode);

          // let file_obj = { // path.resoleve
          //   "path": dir + "/" + file,
          //   "isLeaf": true,
          //   "title": file,

          // }
          // results.isLeaf = true;
          // results.title = results.path;
          results.children.push(file_obj);
          if (!--pending) { callback(null, results); }
        }
      });
    });
  });
};

function removeItem(arr, item) {
  let index = arr.indexOf(item);

  if (index !== -1) {
    arr.splice(index, 1);
  }

}
