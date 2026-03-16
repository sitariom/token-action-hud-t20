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
                        // Tenta métodos conhecidos de rolagem do T20
                        if (typeof actor.rollAtributo === 'function') {
                            await actor.rollAtributo(actionId);
                        } else if (typeof actor.setupAtributo === 'function') {
                            await actor.setupAtributo(actionId);
                        } else if (game.tormenta20 && game.tormenta20.rollAttribute) {
                            // Fallback para API global se existir
                            game.tormenta20.rollAttribute(actor, actionId);
                        } else {
                            Logger.error("Could not find attribute roll method on actor.");
                            ui.notifications.warn(`Não foi possível rolar o atributo ${actionId}. Método não encontrado.`);
                        }
                        break;
                    case 'skill':
                        if (typeof actor.rollPericia === 'function') {
                            await actor.rollPericia(actionId);
                        } else if (typeof actor.setupPericia === 'function') {
                            await actor.setupPericia(actionId);
                        } else if (game.tormenta20 && game.tormenta20.rollSkill) {
                            game.tormenta20.rollSkill(actor, actionId);
                        } else {
                            Logger.error("Could not find skill roll method on actor.");
                            ui.notifications.warn(`Não foi possível rolar a perícia ${actionId}. Método não encontrado.`);
                        }
                        break;
                    case 'item':
                        const item = actor.items.get(actionId);
                        if (item) {
                            if (typeof item.use === 'function') {
                                item.use();
                            } else if (typeof item.roll === 'function') {
                                item.roll();
                            } else {
                                item.sheet.render(true);
                            }
                        } else {
                            Logger.error(`Item ${actionId} not found on actor.`);
                        }
                        break;
                    case 'condition':
                        const token = canvas.tokens.get(actor.token?.id) || canvas.tokens.placeables.find(t => t.actor?.id === actor.id);
                        if (token) {
                            await token.toggleEffect(actionId);
                        } else if (typeof actor.toggleStatusEffect === 'function') {
                            await actor.toggleStatusEffect(actionId);
                        }
                        break;
                }
            } catch (e) {
                Logger.error("Error executing macro", e);
            }
        }
    };
}
