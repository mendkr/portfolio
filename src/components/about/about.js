import './about.scss'

import chroma from 'chroma-js'
import rebound from 'rebound'
import css from 'dom-css'
import on from 'dom-event'
import select from 'dom-select'

import DOMComponent from '../dom-component/dom-component'
import Close from '../close/close'
import viewport from '../utils/viewport'

export default class About extends DOMComponent {

	constructor (element) {
		super(element)

        const springSystem = new rebound.SpringSystem()

		this.openBtn = select('.about__open', this.element)
		this.close = new Close(select('[data-component="Close"]', this.element))
		this.overlay = new DOMComponent(select('.about__overlay', this.element))

		this.backgroundColor = chroma('white').alpha(0)
		this.colors = [chroma('white').alpha(0), chroma('white')]

		this.spring = springSystem.createSpring(10, 6)

		this.hide = this.hide.bind(this)

		this.addChild(this.close)
	}

	init () {
		super.init()

		this.close.on('press', () => this.hide())
		on(this.openBtn, 'click', () => this.show())

		this.spring.addListener({
            onSpringUpdate: (spring) => this.springUpdate(spring)
        })

		this.on('esc', this.hide)
	}

	show () {
		this.focus()
		this.spring.setEndValue(1)

		this.close.show()
	}

	hide () {
		this.sleep()
		this.spring.setEndValue(0)

		this.close.hide()
	}

	springUpdate (spring) {
		let progress = spring.getCurrentValue()

		this.backgroundColor = chroma.scale(this.colors).domain([0, 1])(progress)
		this.overlay.translation[1] = progress * viewport.height

		this.render()
	}

	render () {
		super.render()

		this.overlay.render()

		css(this.element, 'background-color', this.backgroundColor.css())
	}

	resize () {
		super.resize()

		this.springUpdate(this.spring)
	}

}
