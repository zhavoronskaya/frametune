// Build and browse files structure

type Structure = {
  [key: string]: Structure | null;
};

class FilesExplorer {
  private _structure: Structure;
  private _currentStructure: Structure;
  private _depth: string[];

  constructor(structure: Structure) {
    this._structure = structure;
    this._currentStructure = this._structure;
    this._depth = [];
  }

  static buildFromFilesPath(files: string[]) {
    return new FilesExplorer(FilesExplorer.buildStructureFromFiles(files));
  }

  static buildStructureFromFiles(files: string[]) {
    const structure: Structure = {};

    files
      .map((sound) => sound.replace("/sounds/", "")) // TODO remove hardcoded "/sounds"
      .map((sound) => sound.split("/"))
      .forEach((filePathArr) => {
        let pathLength = filePathArr.length;
        let currentPath = structure;

        filePathArr.forEach((pathPart) => {
          if (pathLength === 1) {
            currentPath[pathPart] = null;
          } else {
            currentPath[pathPart] ||= {};
            currentPath = currentPath[pathPart];
          }

          pathLength -= 1;
        });
      });

    return structure;
  }

  static buildFromFilesPathAndDepth({
    files,
    depth,
  }: {
    files: string[];
    depth: string[];
  }) {
    const explorer = FilesExplorer.buildFromFilesPath(files);

    depth.forEach((dirName) => {
      explorer.changeDir(dirName);
    });

    return explorer;
  }

  list() {
    return Object.keys(this._currentStructure);
  }

  changeDir(dirName: string) {
    if (!this._dirExists(dirName))
      throw new Error(`No dir named ${dirName} found!`);

    if (!this._currentStructure?.[dirName])
      throw new Error(`${dirName} is not a directory!`);

    this._currentStructure = this._currentStructure[dirName];
    this._depth.push(dirName);
  }

  get workingDir() {
    return this._depth;
  }

  aFile(name: string) {
    return this._currentStructure[name] === null;
  }

  aDir(name: string) {
    return !this.aFile(name);
  }

  absolutePath(name: string) {
    return ["/sounds"].concat(this._depth).concat([name]).join("/"); // TODO remove hardcoded "/sounds"
  }

  goUpDir() {
    this._depth.pop();
    this._currentStructure = this._structure;

    this._depth.forEach((dirName) => {
      this._currentStructure = this._currentStructure[dirName]!;
    });
  }

  _dirExists(dirName: string) {
    return this.list().includes(dirName);
  }
}

export default FilesExplorer;
