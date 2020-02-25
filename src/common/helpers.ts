import fs from "fs";
import {IMulterFile} from "../models/user.profile.models";

export class Helpers {

    static removeFilesFromDir(files: IMulterFile[]) {
        if (files.length === 0) {
            return true;
        }
        const file: IMulterFile = files.pop();
        if (fs.existsSync(file.path)) {
            fs.rmdirSync(file.path, {recursive: false});
        }
        return this.removeFilesFromDir(files);
    }
}
