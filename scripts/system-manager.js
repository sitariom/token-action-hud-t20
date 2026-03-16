import { getActionHandler } from './action-handler.js';
import { getRollHandler } from './roll-handler.js';
import { DEFAULTS } from './defaults.js';
import { Logger } from './constants.js';

export function getSystemManager(coreModule) {
    const ActionHandler = getActionHandler(coreModule);
    const RollHandler = getRollHandler(coreModule);

    return class SystemManager extends coreModule.api.SystemManager {
        getActionHandler() {
            return new ActionHandler();
        }

        getAvailableRollHandlers() {
            return { core: 'Core Tormenta20' };
        }

        getRollHandler(handlerId) {
            return new RollHandler();
        }

        registerSettings(updateFunc) {
            Logger.info("Registering settings...");
        }

        async registerDefaults() {
            Logger.info("Registering default flags (layout)...");
            return DEFAULTS;
        }
    };
}