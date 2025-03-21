// Build and browse files structure
class FilesExplorer { 
  constructor(structure) {
    this._structure = structure;
    this._currentStructure = this._structure;
    this._depth = [];
  }

  static buildFromFilesPath(files) {
    return new FilesExplorer(
      FilesExplorer.buildStructureFromFiles(files)
    );
  }

  static buildStructureFromFiles(files) {
    let structure = {};

    files
      .map((sound) => sound.replace('/sounds/', ''))
      .map((sound) => sound.split('/'))
      .forEach((filePathArr) => {
	let pathLength = filePathArr.length;
	let currentPath = structure;

	filePathArr.forEach((pathPart) => {
	  if (pathLength === 1) {
	    currentPath[pathPart] = null;
	  } else {
	    if (!currentPath[pathPart]) {
	      currentPath[pathPart] = {};
	    }

	    currentPath = currentPath[pathPart];
	  }
	  
	  pathLength -= 1;
	});
      });

    return structure;
  }

  static buildFromFilesPathAndDepth({ files, depth }) {
    const explorer = FilesExplorer.buildFromFilesPath(files);

    depth.forEach((dirName) => {
      explorer.changeDir(dirName);
    });

    return explorer;
  }

  list() {
    return Object.keys(this._currentStructure);
  }

  changeDir(dirName) {
    if (!this._dirExists(dirName))
      throw new Error(`No dir named ${dirName} found!`);

    this._currentStructure = this._currentStructure[dirName];
    this._depth.push(dirName);
  }

  get workingDir() { return this._depth; }

  aFile(name) { return this._currentStructure[name] === null };

  aDir(name) { return !this.aFile(name); }

  absolutePath(name) {
    return ['/sounds'].concat(this._depth).concat([name]).join('/');
  };

  goUpDir() {
    this._depth.pop();
    this._currentStructure = this._structure;

    this._depth.forEach((dirName) => {
      this._currentStructure = this._currentStructure[dirName];
    });
  }

  _dirExists(dirName) {
    return this.list().includes(dirName);
  }
}

export default FilesExplorer;
