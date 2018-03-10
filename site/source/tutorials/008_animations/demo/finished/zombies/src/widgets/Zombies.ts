import { v, w } from '@dojo/widget-core/d';
import { WidgetBase } from '@dojo/widget-core/WidgetBase';
import WebAnimation, { AnimationProperties } from '@dojo/widget-core/meta/WebAnimation';
import { VNode } from '@dojo/widget-core/interfaces';
import Slider from '@dojo/widgets/slider';

import * as css from './styles/zombies.m.css';

export class Zombies extends WidgetBase {
	private _play = false;
	private _playHearts = false;
	private _zombieWalkDuration = 8000;
	private _numHearts = 5;
	private _zombieLegsPlaybackRate = 1;

	private _onZombieClick() {
		this._play = !this._play;
		this.invalidate();
	}

	private _onAnimationFinish() {
		this._play = false;
		this._playHearts = true;
		this.invalidate();
	}

	private _onHeartsFinish() {
		if (this._playHearts = true) {
			this._playHearts = false;
			this.invalidate();
		}
	}

	private _getZombieAnimation(id: string, direction: string): AnimationProperties {
		return {
			id,
			effects: [
				{ [direction]: '0%' },
				{ [direction]: '35%' }
			],
			timing: {
				duration: this._zombieWalkDuration,
				easing: 'ease-in',
				fill: 'forwards'
			},
			controls: {
				play: this._play,
				onFinish: this._onAnimationFinish
			}
		};
	}

	private _getZombieBodyAnimation(id: string): AnimationProperties {
		return {
			id,
			effects: [
				{ transform: 'rotate(0deg)' },
				{ transform: 'rotate(-2deg)' },
				{ transform: 'rotate(0deg)' },
				{ transform: 'rotate(3deg)' },
				{ transform: 'rotate(0deg)' }
			],
			timing: {
				duration: 1000,
				iterations: Infinity
			},
			controls: {
				play: this._play
			}
		};
	}

	private _getZombieLegAnimation(id: string, front?: boolean): AnimationProperties {
		const effects = [
			{ transform: 'rotate(0deg)' },
			{ transform: 'rotate(-5deg)' },
			{ transform: 'rotate(0deg)' },
			{ transform: 'rotate(5deg)' },
			{ transform: 'rotate(0deg)' }
		];

		if (front) {
			effects.reverse();
		}

		return {
			id,
			effects,
			timing: {
				duration: 1000,
				iterations: Infinity
			},
			controls: {
				play: this._play,
				playbackRate: this._zombieLegsPlaybackRate
			}
		};
	}

	private _getHeartAnimation(id: string, sequence: number, play: boolean): AnimationProperties[] {
		const delay = sequence * 500;
		const leftOffset = Math.floor(Math.random() * 400) - 200;

		return [
			{
				id: `${id}FloatAway`,
				effects: [
					{ opacity: 0, marginTop: '0', marginLeft: '0px' },
					{ opacity: 0.8, marginTop: '-300px', marginLeft: `${1 - leftOffset}px` },
					{ opacity: 0, marginTop: '-600px', marginLeft: `${leftOffset}px` }
				],
				timing: {
					duration: 1500,
					delay
				},
				controls: {
					play: this._playHearts,
					onFinish: sequence === this._numHearts - 1 ? this._onHeartsFinish : undefined
				}
			},
			{
				id: `${id}Scale`,
				effects: [
					{ transform: 'scale(1)' },
					{ transform: 'scale(0.8)' },
					{ transform: 'scale(1)' },
					{ transform: 'scale(1.2)' },
					{ transform: 'scale(1)' }
				],
				timing: {
					duration: 500,
					iterations: Infinity,
					delay,
					easing: 'ease-in-out'
				},
				controls: {
					play: this._playHearts
				}
			}
		];
	}

	private _getHearts(): VNode[] {
		const hearts = [];
		let play = false;
		let i;
		for (i = 0; i < this._numHearts; i++) {
			const key = `heart${i}`;

			hearts.push(v('div', { classes: css.heart, key }));
			this.meta(WebAnimation).animate(key, this._getHeartAnimation(key, i, play));
		}
		return hearts;
	}

	private _onZombieLegsPlaybackRateChange(value: string) {
		this._zombieLegsPlaybackRate = parseFloat(value);
		this.invalidate();
	}

	protected render() {
		const webAnimation = this.meta(WebAnimation);
		webAnimation.animate('zombieOne', this._getZombieAnimation('zombieOneShuffle', 'left'));
		webAnimation.animate('zombieTwo', this._getZombieAnimation('zombieTwoShuffle', 'right'));
		webAnimation.animate('zombieOneBody', this._getZombieBodyAnimation('zombieOneBody'));
		webAnimation.animate('zombieOneBackLeg', this._getZombieLegAnimation('zombieOneBackLeg'));
		webAnimation.animate('zombieOneFrontLeg', this._getZombieLegAnimation('zombieOneFrontLeg', true));
		webAnimation.animate('zombieTwoBody', this._getZombieBodyAnimation('zombieTwoBody'));
		webAnimation.animate('zombieTwoBackLeg', this._getZombieLegAnimation('zombieTwoBackLeg'));
		webAnimation.animate('zombieTwoFrontLeg', this._getZombieLegAnimation('zombieTwoFrontLeg', true));

		return v('div', { classes: css.root }, [
			v('div', { classes: css.controls }, [
				w(Slider, { min: 0.1, max: 10, step: 0.1, value: this._zombieLegsPlaybackRate, onInput: this._onZombieLegsPlaybackRateChange })
			]),
			v('div', { classes: css.zombieOne, onclick: this._onZombieClick, key: 'zombieOne' }, [
				v('div', { classes: css.zombieOneBody, key: 'zombieOneBody' }),
				v('div', { classes: [ css.zombieOneLeg, css.zombieOneBackLeg ], key: 'zombieOneBackLeg' }),
				v('div', { classes: [ css.zombieOneLeg, css.zombieOneFrontLeg ], key: 'zombieOneFrontLeg' })
			]),
			v('div', { classes: css.zombieTwo, onclick: this._onZombieClick, key: 'zombieTwo' }, [
				v('div', { classes: css.zombieTwoBody, key: 'zombieTwoBody' }),
				v('div', { classes: [ css.zombieTwoLeg, css.zombieTwoBackLeg ], key: 'zombieTwoBackLeg' }),
				v('div', { classes: [ css.zombieTwoLeg, css.zombieTwoFrontLeg ], key: 'zombieTwoFrontLeg' })
			]),
			v('div', { classes: css.heartsHolder }, this._getHearts())
		]);
	}
}

export default Zombies;
