import { Logger } from './constants.js';

export function getRollHandler(coreModule) {
    return class RollHandler extends coreModule.api.RollHandler {
        async handleActionClick(event, encodedValue) {
            Logger.info(`Handling action event: ${encodedValue}`);
            try {
                const payload = encodedValue.split('|');
                if (payload.length !== 2) {
                    super.throwInvalidValueErr();
                }

                const actionType = payload[0];
                const actionId = payload[1];

                if (!this.actor) {
                    for (const token of canvas.tokens.controlled) {
                        const actor = token.actor;
                        await this._handleMacro(event, actionType, actionId, actor);
                    }
                } else {
                    await this._handleMacro(event, actionType, actionId, this.actor);
                }
            } catch (e) {
                Logger.error("Error handling action event", e);
            }
        }

        async _handleMacro(event, actionType, actionId, actor) {
            try {
                switch (actionType) {
                    case 'attribute':
                        // Fallback check for T20 specific roll methods
                        if (typeof actor.setupAtributo === 'function') {
                            await actor.setupAtributo(actionId);
                        } else if (typeof actor.rollAtributo === 'function') {
                            await actor.rollAtributo(actionId);
                        } else {
                            // T20 V13+ often uses generic roll methods or specific sheet events
                            // Let's try to mimic a sheet click if the direct method fails
                            const rollData = { event: event, type: 'atributo', id: actionId };
                            if (actor.sheet && typeof actor.sheet._onRoll === 'function') {
                                actor.sheet._onRoll(event, actionType, actionId);
                            } else if (game.tormenta20 && game.tormenta20.rollAttribute) {
                                game.tormenta20.rollAttribute(actor, actionId);
                            } else {
                                Logger.error(`Could not find attribute roll method on actor for ${actionId}.`);
                                ui.notifications.error(`Não foi possível rolar o atributo ${actionId}. Verifique se o sistema T20 está atualizado.`);
                            }
                        }
                        break;
                    case 'skill':
                        if (typeof actor.setupPericia === 'function') {
                            await actor.setupPericia(actionId);
                        } else if (typeof actor.rollPericia === 'function') {
                            await actor.rollPericia(actionId);
                        } else {
                            if (actor.sheet && typeof actor.sheet._onRoll === 'function') {
                                actor.sheet._onRoll(event, actionType, actionId);
                            } else if (game.tormenta20 && game.tormenta20.rollSkill) {
                                game.tormenta20.rollSkill(actor, actionId);
                            } else {
                                Logger.error(`Could not find skill roll method on actor for ${actionId}.`);
                                ui.notifications.error(`Não foi possível rolar a perícia ${actionId}.`);
                            }
                        }
                        break;
                    case 'item':
                        const item = actor.items.get(actionId);
                        if (item) {
                            if (typeof item.use === 'function') {
                                item.use();
                            } else if (typeof item.roll === 'function') {
                                item.roll();
                            } else if (item.sheet) {
                                item.sheet.render(true);
                            }
                        } else {
                            Logger.error(`Item ${actionId} not found on actor.`);
                        }
                        break;
                    case 'condition':
                        const token = canvas.tokens.get(actor.token?.id) || canvas.tokens.placeables.find(t => t.actor?.id === actor.id);
                        if (token) {
                            // T20 uses standard foundry effects, but might have custom toggles
                            const effect = CONFIG.statusEffects.find(e => e.id === actionId);
                            if (effect) {
                                await token.toggleEffect(effect);
                            } else {
                                await token.toggleEffect(actionId);
                            }
                        } else if (typeof actor.toggleStatusEffect === 'function') {
                            await actor.toggleStatusEffect(actionId);
                        } else {
                            Logger.error("Could not toggle status effect, no token or actor method found.");
                        }
                        break;
                }
            } catch (e) {
                Logger.error("Error executing macro", e);
            }
        }
    };
}
