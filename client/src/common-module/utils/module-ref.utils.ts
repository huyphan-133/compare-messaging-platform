import { Logger } from "@nestjs/common";
import { ModuleRef } from "@nestjs/core";

export class ModuleRefUtils {
    private static log: Logger = new Logger(ModuleRefUtils.name);

    private static moduleRefs: Record<string, ModuleRef> = {};

    static registerModuleRef(name: string, moduleRef: ModuleRef) {
        if (!ModuleRefUtils.moduleRefs[name]) {
            this.log.log(`auto register ModuleRef '${name}'...`);
            ModuleRefUtils.moduleRefs[name] = moduleRef;
        }
    }

    static getModuleRef(name: string): ModuleRef {
        return ModuleRefUtils.moduleRefs[name];
    }
}