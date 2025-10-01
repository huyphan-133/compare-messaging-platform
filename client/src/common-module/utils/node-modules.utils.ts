import { readFileSync, readdirSync } from "fs";

export class NodeModulesUtils {
    private static versionLoaded: boolean = false;
    static versions: any = {}

    /**
     * Load thông tin version của các thư viện node đang dùng
     */
    static loadVersions() {
        if (NodeModulesUtils.versionLoaded) return;

        let dirs = readdirSync('node_modules')

        for (let idx = 0; idx < dirs.length; idx++) {
            try {
                let dir: string = dirs[idx]
                let file = 'node_modules/' + dir + '/package.json';
                let json = JSON.parse(readFileSync(file).toString());
                let name = json.name;
                let version = json.version;
                NodeModulesUtils.versions[name] = version;
            } catch (err) {
            }
        }

        NodeModulesUtils.versionLoaded = true
    }
}