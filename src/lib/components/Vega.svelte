<script lang="ts">
	import * as vega from 'vega';
	import * as vegaLite from 'vega-lite';
	import { Handler } from 'vega-tooltip';
	import * as vl from 'vega-lite-api';

	export let data: { [key: string]: string | number }[];
	export let viz;
	export let title;

	function createChart(node: HTMLDivElement, chartArguments) {
		const options = {
			config: {
				// vega-lite default configuration
			},
			init: (view) => {
				// initialize tooltip handler
				view.tooltip(new Handler().call);
				// enable horizontal scrolling for large plots
				if (view.container()) view.container().style['overflow-x'] = 'auto';
			},
			view: {
				// view constructor options
				loader: vega.loader({
					baseURL: 'https://cdn.jsdelivr.net/npm/vega-datasets@1/'
				}),
				renderer: 'svg'
			}
		};

		vl.register(vega, vegaLite, options);

		chartArguments.viz
			.data(chartArguments.data)
			.width(node.clientWidth)
			.height(node.clientHeight)
			.autosize({ type: 'fit', contains: 'padding', resize: true })
			// .background('grey')
			.render()
			.then((chart) => {
				node.appendChild(chart);
			});

		return {
			// this has to be returned form the action, otherwise it doesnt
			// rerender when its arguments change
			update(newChartArguments) {
				chartArguments = newChartArguments;
				// we have to remove the child from the node and then readd it
				node.removeChild(node.firstChild);
				chartArguments.viz
					.data(chartArguments.data)
					.width(node.clientWidth)
					.height(node.clientHeight)
					.autosize({ type: 'fit', contains: 'padding', resize: true })
					// .background('grey')
					.render()
					.then((chart) => {
						node.appendChild(chart);
					});
			}
		};
	}
</script>

<div class="card bg-white m-5">
	<div class="text-center mt-4">{title}</div>
	<div use:createChart={{ viz, data }} class="m-5 min-h-[200px]" />
</div>
