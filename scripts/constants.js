export const MODULE = {
    ID: 'token-action-hud-t20'
};

export const Logger = {
    info: (...args) => console.log(`Token Action HUD T20 |`, ...args),
    error: (...args) => console.error(`Token Action HUD T20 |`, ...args),
    debug: (...args) => { 
        if (game.modules.get(MODULE.ID)?.api?.debug) {
            console.debug(`Token Action HUD T20 |`, ...args); 
        }
    }
};