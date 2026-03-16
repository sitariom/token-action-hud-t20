import { getSystemManager } from './system-manager.js';
import { MODULE, Logger } from './constants.js';

Hooks.on('tokenActionHudCoreApiReady', async (coreModule) => {
    Logger.info("Token Action HUD Core API is ready. Initializing T20 module...");
    try {
        const module = game.modules.get(MODULE.ID);
        module.api = {
            requiredCoreModuleVersion: '2.0',
            SystemManager: getSystemManager(coreModule)
        };
        Hooks.call('tokenActionHudSystemReady', module);
        Logger.info("T20 module initialized successfully.");
    } catch (e) {
        Logger.error("Failed to initialize T20 module", e);
    }
});