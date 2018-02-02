import { v } from '@dojo/widget-core/d';
import { WidgetBase } from '@dojo/widget-core/WidgetBase';

import * as css from './styles/zombies.m.css';

export class Zombies extends WidgetBase {
	private _onZombieClick() {
		// zombie clicked
	}

	protected render() {
		return v('div', { classes: css.root }, [
			v('div', { classes: css.zombieOne, onclick: this._onZombieClick, key: 'zombieOne' }, [
				v('div', { classes: css.zombieOneBody, key: 'zombieOneBody' }),
				v('div', { classes: [ css.zombieOneLeg, css.zombieOneBackLeg ], key: 'zombieOneBackLeg' }),
				v('div', { classes: [ css.zombieOneLeg, css.zombieOneFrontLeg ], key: 'zombieOneFrontLeg' })
			]),
			v('div', { classes: css.zombieTwo, onclick: this._onZombieClick, key: 'zombieTwo' }, [
				v('div', { classes: css.zombieTwoBody, key: 'zombieTwoBody' }),
				v('div', { classes: [ css.zombieTwoLeg, css.zombieTwoBackLeg ], key: 'zombieTwoBackLeg' }),
				v('div', { classes: [ css.zombieTwoLeg, css.zombieTwoFrontLeg ], key: 'zombieTwoFrontLeg' })
			])
		]);
	}
}

export default Zombies;
