import { createContextMenu } from './utils'

const menuItems = [
	{
		title: 'Add to group',
		action: d => {
			console.log(d)
		},
	},
	{
		title: 'Second action',
		action: d => {
			console.log(d)
		},
	},
]
	// const drag = simulation => {
	// 	const dragstarted = d => {
	// 		if (!d3.event.active) simulation.alphaTarget(0.3).restart()
	// 		d.fx = d.x
	// 		d.fy = d.y
	// 	}

	// 	const dragged = d => {
	// 		d.fx = d3.event.x
	// 		d.fy = d3.event.y
	// 	}

	// 	const dragended = d => {
	// 		if (!d3.event.active) simulation.alphaTarget(0)
	// 		d.fx = null
	// 		d.fy = null
	// 	}

	// 	return d3.drag().on('start', dragstarted).on('drag', dragged).on('end', dragended)
	// }
	.on('contextmenu', d => {
		createContextMenu(d, menuItems, width, height, '#graphSvg')
	})
	.on('contextmenu', d => {
		createContextMenu(d, menuItems, width, height, '#graphSvg')
	})
