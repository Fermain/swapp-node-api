import fs from "fs";
import {IMulterFile} from "../models/user.profile.models";

export class Helpers {

    static async removeFilesFromDir(files: IMulterFile[]) {
        if (files.length === 0) {
            return true;
        }
        const file: IMulterFile = files.pop();
        const path = `${file.destination}/${file.filename}`;
        if (fs.existsSync(path)) {
            fs.unlinkSync(path);
        }
        return this.removeFilesFromDir(files);
    }

    static async removeSingleFileFromDir(file: IMulterFile) {
        const path = `${file.destination}/${file.filename}`;
        if (fs.existsSync(path)) {
            fs.unlinkSync(path);
        }
        return true;
    }
}
